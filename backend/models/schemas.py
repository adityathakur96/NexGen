from pydantic import BaseModel
from typing import Optional, List, Dict


class SalesData(BaseModel):
    """Sales data model for monthly sales and forecasts"""
    month: str
    sales: float
    forecast: float
    sales_2024: Optional[float] = 0
    sales_2025: Optional[float] = 0
    quantity: Optional[float] = None
    orders: Optional[int] = None


class DashboardStats(BaseModel):
    """Dashboard statistics model"""
    total_revenue: str
    growth_rate: str
    active_customers: str
    target_progress: str
    revenue_change: str
    growth_change: str
    customers_change: str
    target_change: str
    total_orders: Optional[str] = None
    avg_order_value: Optional[str] = None
    total_products: Optional[str] = None
    total_locations: Optional[str] = None


class ProductPerformance(BaseModel):
    """Product performance data"""
    product_name: str
    total_revenue: float
    total_quantity: int
    order_count: int
    avg_price: float
    category: str


class CategoryPerformance(BaseModel):
    """Category performance data"""
    category: str
    total_revenue: float
    total_quantity: int
    order_count: int
    avg_order_value: float


class LocationPerformance(BaseModel):
    """Location performance data"""
    location: str
    total_revenue: float
    total_quantity: int
    order_count: int
    customer_count: int


class CustomerSegmentPerformance(BaseModel):
    """Customer segment performance data"""
    customer_segment: str
    total_revenue: float
    customer_count: int
    avg_revenue_per_customer: float
    avg_order_value: float


class InventoryMetrics(BaseModel):
    """Inventory metrics"""
    avg_stock_level: float
    low_stock_products: int
    avg_lead_time: float
    avg_supplier_delay: float
    total_inventory_value: Optional[float] = None
