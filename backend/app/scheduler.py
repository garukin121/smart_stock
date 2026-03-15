import logging
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, datetime, timedelta
from app.database import SessionLocal
from app import models, schemas, crud
from app.fuzzy import fuzzy_tsukamoto
import requests
import os

logger = logging.getLogger(__name__)

def evaluate_predictions():
    logger.info("Running daily prediction evaluation...")
    db = SessionLocal()
    try:
        today = date.today()
        start_time = datetime.combine(today, datetime.min.time())
        
        products = db.query(models.Product).all()
        bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        users = db.query(models.User).all()
        chat_ids = [u.telegram_chat_id for u in users if u.telegram_chat_id]

        msg_lines = [f"Halo! Ini Rangkuman Evaluasi Prediksi Tsukamoto Lapak Anda untuk besok ({today + timedelta(days=1)}):\n"]

        for idx, p in enumerate(products, 1):
            # 1. Total Penjualan hari ini
            # Query transactions today
            txns = db.query(models.Transaction).filter(
                models.Transaction.product_id == p.id,
                models.Transaction.created_at >= start_time
            ).all()
            total_demand = sum(t.quantity for t in txns)

            # 2. Sisa Stok
            current_stock = crud.check_stock_level(db, p.id)

            # 3. Fuzzy Prediction
            restock_qty = fuzzy_tsukamoto(demand=total_demand, stock=current_stock)
            
            # Save Prediction
            db_pred = models.Prediction(
                product_id=p.id,
                target_date=today + timedelta(days=1),
                demand_value=total_demand,
                stock_value=current_stock,
                predicted_restock_qty=restock_qty
            )
            db.add(db_pred)
            
            # Add to Message
            msg_lines.append(f"{idx}. {p.name}: Disarankan Membeli {restock_qty:.0f} {p.unit} (Terjual hr ini: {total_demand}, Sisa: {current_stock})")

        db.commit()

        if bot_token and chat_ids:
            final_msg = "\n".join(msg_lines)
            for cid in chat_ids:
                url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                try:
                    requests.post(url, json={"chat_id": cid, "text": final_msg})
                except Exception as e:
                    logger.error(f"Failed to send telegram message to {cid}: {e}")

    except Exception as e:
        logger.error(f"Error in evaluate_predictions: {e}")
    finally:
        db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Runs at 22:00 everyday
    scheduler.add_job(evaluate_predictions, "cron", hour=22, minute=0)
    scheduler.start()
    return scheduler
