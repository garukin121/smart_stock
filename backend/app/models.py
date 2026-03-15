import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    telegram_chat_id = Column(String, unique=True, index=True, nullable=True)
    name = Column(String)
    role = Column(String, default="admin")
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, default=generate_uuid)
    kode_sku = Column(String, unique=True, index=True)
    name = Column(String)
    price = Column(Float)
    unit = Column(String)
    min_stock_alert = Column(Float)
    
    transactions = relationship("Transaction", back_populates="product")
    inventory = relationship("Inventory", uselist=False, back_populates="product")
    predictions = relationship("Prediction", back_populates="product")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey("products.id"))
    quantity = Column(Float)
    subtotal = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    product = relationship("Product", back_populates="transactions")

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey("products.id"), unique=True)
    current_qty = Column(Float)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    product = relationship("Product", back_populates="inventory")

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey("products.id"))
    target_date = Column(Date, default=date.today)
    demand_value = Column(Float)
    stock_value = Column(Float)
    predicted_restock_qty = Column(Float)
    created_timestamp = Column(DateTime, default=datetime.utcnow)
    
    product = relationship("Product", back_populates="predictions")
