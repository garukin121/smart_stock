import os
import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from app.database import SessionLocal
from app import models, crud, schemas

logger = logging.getLogger(__name__)

async def handle_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_chat.id
    name = update.effective_user.first_name

    db = SessionLocal()
    user = db.query(models.User).filter_by(telegram_chat_id=str(user_id)).first()
    if not user:
        new_user = models.User(telegram_chat_id=str(user_id), name=name)
        db.add(new_user)
        db.commit()
    db.close()

    welcome_msg = (
        f"👋 <b>Selamat datang di SmartStock Bot, {name}!</b>\n\n"
        "Bot ini membantu Anda mencatat transaksi penjualan, memantau stok produk, "
        "dan melihat rekap penjualan harian dengan mudah.\n\n"
        "Gunakan perintah berikut:\n\n"
        "📦 <b>/cek_stok</b>\n"
        "Melihat semua stok produk saat ini\n\n"
        "🛒 <b>/jual</b> &lt;produk&gt; &lt;jumlah&gt;\n"
        "Mencatat transaksi penjualan\n"
        "Contoh: <code>/jual beras 2</code>\n\n"
        "📥 <b>/restock</b> &lt;produk&gt; &lt;jumlah&gt;\n"
        "Menambahkan stok produk\n"
        "Contoh: <code>/restock bayam 10</code>\n\n"
        "📊 <b>/rekap_harian</b>\n"
        "Melihat total penjualan hari ini\n\n"
        "Silakan mulai mencatat transaksi Anda 🚀"
    )
    await update.message.reply_text(welcome_msg, parse_mode="HTML")

async def handle_jual(update: Update, context: ContextTypes.DEFAULT_TYPE):
    args = context.args
    if len(args) < 2:
        await update.message.reply_text("Format salah. Gunakan: /jual [Kode_Barang] [Jumlah]")
        return
        
    kode = args[0]
    try:
        qty = float(args[1])
    except:
        await update.message.reply_text("Jumlah harus angka.")
        return

    db = SessionLocal()
    try:
        product = crud.get_product_by_kode(db, kode)
        # Fallback: cari berdasarkan nama barang (partial, case-insensitive)
        if not product:
            product = db.query(models.Product).filter(
                models.Product.name.ilike(f"%{kode}%")
            ).first()
        if not product:
            await update.message.reply_text(f"Barang '{kode}' tidak ditemukan. Gunakan kode SKU atau nama barang.")
            return

        crud.add_transaction(db, schemas.TransactionCreate(product_id=product.id, quantity=qty))
        await update.message.reply_text(f"✅ Terjual {qty} {product.unit} *{product.name}*.")
    except ValueError as ve:
        await update.message.reply_text(f"Gagal: {str(ve)}")
    except Exception as e:
        logger.error(e)
        await update.message.reply_text("Terjadi kesalahan sistem.")
    finally:
        db.close()

async def handle_restock(update: Update, context: ContextTypes.DEFAULT_TYPE):
    args = context.args
    if len(args) < 2:
        await update.message.reply_text("Format salah. Gunakan: /restock [Kode_Barang] [Jumlah Tambahan]")
        return
        
    kode = args[0]
    qty = float(args[1])

    db = SessionLocal()
    try:
        product = crud.get_product_by_kode(db, kode)
        # Fallback: cari berdasarkan nama barang (partial, case-insensitive)
        if not product:
            product = db.query(models.Product).filter(
                models.Product.name.ilike(f"%{kode}%")
            ).first()
        if not product:
            await update.message.reply_text(f"Barang '{kode}' tidak ditemukan. Gunakan kode SKU atau nama barang.")
            return

        crud.update_inventory(db, product.id, qty)
        new_stock = crud.check_stock_level(db, product.id)
        await update.message.reply_text(f"✅ Restock sukses! Stok *{product.name}* sekarang: {new_stock} {product.unit}.")
    except Exception as e:
        logger.error(e)
        await update.message.reply_text("Terjadi kesalahan.")
    finally:
        db.close()

async def handle_cek_stok(update: Update, context: ContextTypes.DEFAULT_TYPE):
    db = SessionLocal()
    products = db.query(models.Product).all()
    if not products:
        await update.message.reply_text("Belum ada barang terdaftar di sistem.")
        db.close()
        return

    lines = ["📦 <b>SISA STOK SEKARANG</b>\n"]
    for p in products:
        qty = crud.check_stock_level(db, p.id)
        qty_int = int(qty)
        # Status icon
        if qty_int > p.min_stock_alert * 1.5:
            icon = "🟢"
        elif qty_int > p.min_stock_alert:
            icon = "🟡"
        else:
            icon = "🔴"
        lines.append(f"{icon} <b>{p.name}</b> [{p.kode_sku}]\n   Stok: {qty_int} {p.unit} | Min: {int(p.min_stock_alert)}")

    await update.message.reply_text("\n".join(lines), parse_mode="HTML")
    db.close()

async def handle_rekap(update: Update, context: ContextTypes.DEFAULT_TYPE):
    db = SessionLocal()
    stats = crud.get_dashboard_overview(db)
    db.close()
    msg = (
        "📊 <b>Rekap Penjualan Hari Ini</b>\n\n"
        f"💰 Pendapatan: <b>Rp {int(stats['total_revenue_today']):,}</b>\n"
        f"🛒 Total Transaksi: <b>{stats['transaction_count']}</b>\n"
        f"📦 Item Terjual: <b>{int(stats['total_items_sold'])}</b>"
    )
    await update.message.reply_text(msg, parse_mode="HTML")

def create_bot_app():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        logger.warning("No TELEGRAM_BOT_TOKEN provided. Telegram bot will not start.")
        return None
    app = ApplicationBuilder().token(token).build()
    app.add_handler(CommandHandler("start", handle_start))
    app.add_handler(CommandHandler("jual", handle_jual))
    app.add_handler(CommandHandler("restock", handle_restock))
    app.add_handler(CommandHandler("cek_stok", handle_cek_stok))
    app.add_handler(CommandHandler("rekap_harian", handle_rekap))
    return app
