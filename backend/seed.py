from app import models, crud, schemas
from app.database import SessionLocal, engine
from datetime import date, timedelta
import random
from sqlalchemy.orm import Session
from app import models, auth
from datetime import datetime, timedelta

def seed_db():
    print("Membuat tabel database...")
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # 1. Pastikan User Admin ada
    admin_user = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin_user:
        hashed_pw = auth.get_password_hash("password123")
        admin_user = models.User(username="admin", hashed_password=hashed_pw, role="admin", name="Administrator")
        db.add(admin_user)
        db.commit()
        print("Default admin user dibuat. (Username: admin, Password: password123)")

    # 2. Hapus seluruh data Transaksi, Inventory, dan Produk untuk reset bersih sebelum seed dummy
    db.query(models.Prediction).delete()
    db.query(models.Transaction).delete()
    db.query(models.Inventory).delete()
    db.query(models.Product).delete()
    db.commit()
    print("Membersihkan data produk, inventory, transaksi, dan histori prediksi lama...")

    # 3. 20 Dummy Produk
    dummy_products = [
        {"kode_sku": "SKU-S001", "name": "Beras Rojolele 5kg", "price": 65000, "unit": "Karung", "min": 5, "initial": random.randint(3, 15)},
        {"kode_sku": "SKU-S002", "name": "Minyak Goreng Bimoli 1L", "price": 18000, "unit": "Pouch", "min": 10, "initial": random.randint(5, 25)},
        {"kode_sku": "SKU-S003", "name": "Gula Pasir Gulaku 1kg", "price": 14500, "unit": "Pcs", "min": 15, "initial": random.randint(10, 30)},
        {"kode_sku": "SKU-S004", "name": "Telur Ayam Negeri", "price": 28000, "unit": "Kg", "min": 10, "initial": random.randint(8, 20)},
        {"kode_sku": "SKU-S005", "name": "Tepung Terigu Segitiga Biru", "price": 12000, "unit": "Kg", "min": 10, "initial": random.randint(5, 15)},
        {"kode_sku": "SKU-M001", "name": "Aqua Galon 19L", "price": 19000, "unit": "Galon", "min": 10, "initial": random.randint(2, 20)},
        {"kode_sku": "SKU-M002", "name": "Kopi Kapal Api Mix", "price": 15000, "unit": "Renceng", "min": 5, "initial": random.randint(3, 10)},
        {"kode_sku": "SKU-M003", "name": "Teh Pucuk Harum 350ml", "price": 3500, "unit": "Botol", "min": 24, "initial": random.randint(10, 50)},
        {"kode_sku": "SKU-M004", "name": "Susu Kental Manis Frisian Flag", "price": 11000, "unit": "Kaleng", "min": 12, "initial": random.randint(5, 20)},
        {"kode_sku": "SKU-M005", "name": "Sirup Marjan Melon", "price": 22000, "unit": "Botol", "min": 6, "initial": random.randint(2, 10)},
        {"kode_sku": "SKU-B001", "name": "Sabun Mandi Lifebuoy", "price": 4000, "unit": "Pcs", "min": 20, "initial": random.randint(10, 40)},
        {"kode_sku": "SKU-B002", "name": "Rinso Anti Noda 700g", "price": 24000, "unit": "Pcs", "min": 10, "initial": random.randint(5, 15)},
        {"kode_sku": "SKU-B003", "name": "Sunlight Jeruk Nipis 780ml", "price": 16500, "unit": "Pcs", "min": 12, "initial": random.randint(8, 20)},
        {"kode_sku": "SKU-B004", "name": "Pepsodent 190g", "price": 12500, "unit": "Pcs", "min": 15, "initial": random.randint(10, 25)},
        {"kode_sku": "SKU-B005", "name": "Shampo Clear Men 160ml", "price": 25000, "unit": "Botol", "min": 6, "initial": random.randint(3, 12)},
        {"kode_sku": "SKU-K001", "name": "Indomie Goreng", "price": 3000, "unit": "Bungkus", "min": 40, "initial": random.randint(20, 100)},
        {"kode_sku": "SKU-K002", "name": "Indomie Soto Spesial", "price": 2800, "unit": "Bungkus", "min": 40, "initial": random.randint(20, 100)},
        {"kode_sku": "SKU-K003", "name": "Chitato Sapi Panggang 68g", "price": 11000, "unit": "Bungkus", "min": 15, "initial": random.randint(5, 30)},
        {"kode_sku": "SKU-K004", "name": "Biskuit Roma Kelapa", "price": 10500, "unit": "Bungkus", "min": 10, "initial": random.randint(5, 20)},
        {"kode_sku": "SKU-K005", "name": "Taro Net Seaweed", "price": 5500, "unit": "Bungkus", "min": 20, "initial": random.randint(10, 40)},
    ]

    db_products = []
    print("Menambahkan 20 Dummy Produk dan Inventory secara acak...")
    for p_data in dummy_products:
        prod = models.Product(
            kode_sku=p_data["kode_sku"],
            name=p_data["name"],
            price=p_data["price"],
            unit=p_data["unit"],
            min_stock_alert=p_data["min"]
        )
        db.add(prod)
        db.commit()
        db.refresh(prod)
        db_products.append(prod)

        inv = models.Inventory(
            product_id=prod.id,
            current_qty=p_data["initial"]
        )
        db.add(inv)
    
    db.commit()

    # 4. Buat Dummy Transaksi selama 7 hari ke belakang untuk grafik Recharts
    print("Membuat Dummy Transaksi acak untuk Grafik 7 Hari Terakhir...")
    for i in range(7):
        # target_date adalah hari H minus i
        target_date = datetime.now() - timedelta(days=i)
        
        # Tiap hari ada 3-10 transaksi acak
        num_trx_per_day = random.randint(3, 10)
        
        for _ in range(num_trx_per_day):
            random_product = random.choice(db_products)
            qty_sold = random.randint(1, 4)
            
            # Time
            hour = random.randint(8, 20)
            minute = random.randint(0, 59)
            trx_time = target_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
            
            t = models.Transaction(
                product_id=random_product.id,
                quantity=qty_sold,
                subtotal=qty_sold * random_product.price,
                created_at=trx_time
            )
            db.add(t)
            
        # Also create a dummy prediction for today based on random logic
        if i == 0:
            for p in db_products[:5]: # just 5 products
                pred = models.Prediction(
                    product_id=p.id,
                    target_date=target_date.date(),
                    demand_value=random.randint(5, 50),
                    stock_value=random.randint(5, 20),
                    predicted_restock_qty=random.randint(10, 40)
                )
                db.add(pred)
            
    db.commit()
    print("Seeding berhasil. Silakan cek UI Dashboard dan Inventory.")

if __name__ == "__main__":
    seed_db()
