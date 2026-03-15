from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ProductBase(BaseModel):
    kode_sku: str
    name: str
    price: float
    unit: str
    min_stock_alert: float

class ProductCreate(ProductBase):
    initial_stock: float = 0.0

class Product(ProductBase):
    id: str
    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    product_id: str
    quantity: float

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str
    subtotal: float
    created_at: datetime
    class Config:
        from_attributes = True

class InventoryBase(BaseModel):
    product_id: str
    current_qty: float

class Inventory(InventoryBase):
    id: str
    last_updated: datetime
    class Config:
        from_attributes = True

class PredictionBase(BaseModel):
    product_id: str
    target_date: date
    demand_value: float
    stock_value: float
    predicted_restock_qty: float

class PredictionCreate(PredictionBase):
    pass

class Prediction(PredictionBase):
    id: str
    created_timestamp: datetime
    class Config:
        from_attributes = True
