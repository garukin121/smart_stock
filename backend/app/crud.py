from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from datetime import date, datetime, timedelta

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def get_product_by_kode(db: Session, kode_sku: str):
    return db.query(models.Product).filter(models.Product.kode_sku == kode_sku).first()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump(exclude={'initial_stock'}))
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    # create initial inventory row
    db_inventory = models.Inventory(product_id=db_product.id, current_qty=product.initial_stock)
    db.add(db_inventory)
    db.commit()
    return db_product

def check_stock_level(db: Session, product_id: str):
    inv = db.query(models.Inventory).filter(models.Inventory.product_id == product_id).first()
    return inv.current_qty if inv else 0.0

def add_transaction(db: Session, transaction: schemas.TransactionCreate):
    product = db.query(models.Product).filter(models.Product.id == transaction.product_id).first()
    if not product:
        raise ValueError("Product not found")

    qty = transaction.quantity
    current_stock = check_stock_level(db, product.id)
    if current_stock < qty:
        raise ValueError(f"Insufficient stock (only {current_stock} left)")

    # Deduct stock
    inv = db.query(models.Inventory).filter(models.Inventory.product_id == product.id).first()
    inv.current_qty -= qty

    # Create transaction
    subtotal = product.price * qty
    db_txn = models.Transaction(
        product_id=product.id,
        quantity=qty,
        subtotal=subtotal
    )
    db.add(db_txn)
    db.commit()
    db.refresh(db_txn)
    return db_txn

def update_inventory(db: Session, product_id: str, new_qty: float):
    inv = db.query(models.Inventory).filter(models.Inventory.product_id == product_id).first()
    if inv:
        inv.current_qty += new_qty
        db.commit()
        db.refresh(inv)
        return inv

def get_dashboard_overview(db: Session):
    today = date.today()
    start_time = datetime.combine(today, datetime.min.time())
    
    # Revenue today
    total_rev = db.query(func.sum(models.Transaction.subtotal)).filter(
        models.Transaction.created_at >= start_time
    ).scalar() or 0.0

    # Items sold today
    total_items = db.query(func.sum(models.Transaction.quantity)).filter(
        models.Transaction.created_at >= start_time
    ).scalar() or 0.0

    # Out of stock alerts
    out_of_stock = db.query(models.Product).join(models.Inventory).filter(
        models.Inventory.current_qty <= models.Product.min_stock_alert
    ).count()

    # Txn count
    txn_count = db.query(models.Transaction).filter(
        models.Transaction.created_at >= start_time
    ).count()

    return {
        "total_revenue_today": total_rev,
        "total_items_sold": total_items,
        "out_of_stock_alerts_count": out_of_stock,
        "transaction_count": txn_count
    }

def add_prediction(db: Session, p: schemas.PredictionCreate):
    db_pred = models.Prediction(**p.model_dump())
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    return db_pred
