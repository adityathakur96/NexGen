# NexGen Dashboard API Endpoints

## Overview
The API has been updated to match the CSV schema from `NexGen_Dataset.csv` and provides comprehensive analytics based on all available fields.

## CSV Schema Fields
- `customer_id`, `unit_price`, `is_promotion`, `holiday_name`, `weather_condition`
- `customer_segment`, `product_id`, `customer_income`, `competitor_price`, `marketing_spend`
- `product_name`, `lead_time`, `stock_level`, `supplier_delay`, `shelf_life`
- `category`, `date_of_purchase`, `amount`, `quantity`, `location`, `year`, `month`

## API Endpoints

### 1. Dashboard Data

#### `GET /api/dashboard/sales-data`
Returns monthly sales data with forecasts.
```json
[
  {
    "month": "Jan",
    "sales": 3715987.46,
    "forecast": 3901786.83,
    "quantity": 25000,
    "orders": 5000
  }
]
```

#### `GET /api/dashboard/stats`
Returns dashboard statistics.
```json
{
  "total_revenue": "$25,207,055",
  "growth_rate": "-33.4%",
  "active_customers": "6,009",
  "target_progress": "57%",
  "total_orders": "10,000",
  "avg_order_value": "$2,520.71",
  "total_products": "10",
  "total_locations": "5"
}
```

#### `GET /api/dashboard/all`
Returns sales data and stats in one request.

#### `GET /api/dashboard/comprehensive` ⭐ **NEW**
Returns all dashboard data including:
- Sales data
- Stats
- Top products
- Categories
- Locations
- Customer segments
- Inventory metrics

### 2. Product Analytics

#### `GET /api/products/top?limit=10`
Returns top performing products by revenue.
```json
[
  {
    "product_name": "Mobile",
    "total_revenue": 5000000.0,
    "total_quantity": 15000,
    "order_count": 3000,
    "avg_price": 333.33,
    "category": "Electronics"
  }
]
```

### 3. Category Analytics

#### `GET /api/categories`
Returns performance metrics by product category.
```json
[
  {
    "category": "Electronics",
    "total_revenue": 10000000.0,
    "total_quantity": 30000,
    "order_count": 5000,
    "avg_order_value": 2000.0
  }
]
```

### 4. Location Analytics

#### `GET /api/locations`
Returns performance metrics by location.
```json
[
  {
    "location": "New York",
    "total_revenue": 5000000.0,
    "total_quantity": 15000,
    "order_count": 2000,
    "customer_count": 1200
  }
]
```

### 5. Customer Segment Analytics

#### `GET /api/customer-segments`
Returns performance metrics by customer segment.
```json
[
  {
    "customer_segment": "High",
    "total_revenue": 8000000.0,
    "customer_count": 2000,
    "avg_revenue_per_customer": 4000.0,
    "avg_order_value": 2500.0
  }
]
```

### 6. Inventory Metrics

#### `GET /api/inventory/metrics`
Returns inventory-related metrics.
```json
{
  "avg_stock_level": 500.5,
  "low_stock_products": 150,
  "avg_lead_time": 12.3,
  "avg_supplier_delay": 4.2,
  "total_inventory_value": 2500000.0
}
```

## Frontend Integration

The Dashboard component (`frontend/src/pages/Dashboard.jsx`) has been updated to:
- Fetch data from `/api/dashboard/comprehensive` endpoint
- Display real-time stats from S3 data
- Show visualizations for:
  - Sales vs Forecast (Line Chart)
  - Monthly Performance (Bar Chart)
  - Top Products by Revenue (Horizontal Bar Chart)
  - Revenue by Category (Pie Chart)
  - Performance by Location (Bar Chart)

## Usage Example

```javascript
// Fetch comprehensive dashboard data
const response = await fetch('http://localhost:8000/api/dashboard/comprehensive');
const data = await response.json();

// Access different data sections
const salesData = data.sales_data;
const stats = data.stats;
const topProducts = data.top_products;
const categories = data.categories;
const locations = data.locations;
```

## Testing

Test the API using:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Direct API calls: http://localhost:8000/api/dashboard/comprehensive
