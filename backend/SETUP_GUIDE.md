# SweetShop Backend Setup Guide

This guide will help you set up the SweetShop backend with the database schema and Postman collection for testing.

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Postman (for API testing)
- npm or yarn

## 🗄️ Database Setup

### 1. Install MySQL
Make sure MySQL is installed and running on your system.

### 2. Create Database
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE sweetshop_db;
USE sweetshop_db;
```

### 3. Run Schema File
```bash
# Option 1: Run from command line
mysql -u root -p sweetshop_db < database/schema.sql

# Option 2: Copy and paste the contents of database/schema.sql into MySQL client
```

### 4. Verify Database Setup
```sql
-- Check if table was created
DESCRIBE sweets;

-- Check sample data
SELECT COUNT(*) as total_sweets FROM sweets;

-- Check categories
SELECT DISTINCT category FROM sweets ORDER BY category;
```

## 🔧 Application Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Update `config.env` with your MySQL credentials:
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=sweetshop_db
DB_PORT=3306
```

### 3. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see output like:
```
✅ Database connected successfully!
✅ Sweets table created/verified successfully!
🚀 Server running on port 3000
📊 Environment: development
🔗 API URL: http://localhost:3000
🏥 Health Check: http://localhost:3000/health
🍬 Sweets API: http://localhost:3000/api/sweets
```

## 📮 Postman Collection Setup

### 1. Import Collection
1. Open Postman
2. Click "Import" button
3. Select the file: `SweetShop_API.postman_collection.json`
4. The collection will be imported with all endpoints organized in folders

### 2. Configure Environment Variables
1. In Postman, click on the collection name "SweetShop API Collection"
2. Go to the "Variables" tab
3. Verify the `base_url` variable is set to: `http://localhost:3000`
4. If needed, create a new environment with this variable

### 3. Test the API

#### 🏥 Health Check
Start by testing the health endpoint:
- **Request**: `GET {{base_url}}/health`
- **Expected Response**: 
```json
{
  "success": true,
  "message": "SweetShop API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

#### 🍬 Basic CRUD Operations
1. **Get All Sweets**: `GET {{base_url}}/api/sweets`
2. **Create Sweet**: `POST {{base_url}}/api/sweets` (with JSON body)
3. **Get Sweet by ID**: `GET {{base_url}}/api/sweets/1`
4. **Update Sweet**: `PUT {{base_url}}/api/sweets/1` (with JSON body)
5. **Delete Sweet**: `DELETE {{base_url}}/api/sweets/1`

#### 🔍 Search & Filter
1. **Search by Name**: `GET {{base_url}}/api/sweets/search/chocolate`
2. **Filter by Category**: `GET {{base_url}}/api/sweets/category/Chocolate`
3. **Low Stock Items**: `GET {{base_url}}/api/sweets/low-stock`

#### 📦 Stock Management
1. **Update Stock**: `PATCH {{base_url}}/api/sweets/1/stock` (with JSON body)

## 📝 Sample API Requests

### Create a New Sweet
```bash
curl -X POST http://localhost:3000/api/sweets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chocolate Truffle",
    "category": "Chocolate",
    "price": 2.50,
    "in_stock": 25
  }'
```

### Get All Sweets
```bash
curl http://localhost:3000/api/sweets
```

### Update Stock
```bash
curl -X PATCH http://localhost:3000/api/sweets/1/stock \
  -H "Content-Type: application/json" \
  -d '{"quantity": -5}'
```

## 🧪 Testing Scenarios

### 1. Happy Path Testing
1. Create a new sweet
2. Retrieve the sweet by ID
3. Update the sweet details
4. Update stock quantity
5. Search for the sweet
6. Delete the sweet

### 2. Error Testing
1. Try to create a sweet with missing fields
2. Try to create a sweet with negative price
3. Try to get a non-existent sweet
4. Try to update stock to negative value

### 3. Search & Filter Testing
1. Search for sweets by name
2. Filter sweets by category
3. Get low stock items
4. Test with different search terms

## 📊 Database Features

### Views Available
- `low_stock_items`: Shows items with stock < 10
- `category_summary`: Shows statistics by category

### Stored Procedures Available
- `AddStock(sweet_id, quantity)`: Add stock to an item
- `GetSweetsByPriceRange(min_price, max_price)`: Get sweets in price range

### Triggers Available
- `before_stock_update`: Prevents negative stock
- `before_price_update`: Prevents negative price

## 🔍 Useful Database Queries

### Get Category Statistics
```sql
SELECT 
    category,
    COUNT(*) as total_items,
    AVG(price) as avg_price,
    SUM(in_stock) as total_stock
FROM sweets 
GROUP BY category 
ORDER BY total_items DESC;
```

### Get Total Inventory Value
```sql
SELECT 
    SUM(price * in_stock) as total_inventory_value,
    COUNT(*) as total_products,
    AVG(price) as average_price
FROM sweets;
```

### Get Low Stock Items
```sql
SELECT * FROM sweets WHERE in_stock < 10 ORDER BY in_stock ASC;
```

## 🚨 Troubleshooting

### Database Connection Issues
1. Verify MySQL is running
2. Check credentials in `config.env`
3. Ensure database exists: `CREATE DATABASE sweetshop_db;`

### API Issues
1. Check if server is running on correct port
2. Verify database connection
3. Check server logs for errors

### Postman Issues
1. Verify `base_url` variable is set correctly
2. Check if server is running
3. Ensure Content-Type header is set for POST/PUT requests

## 📚 Additional Resources

- [API Documentation](README.md)
- [Database Schema](database/schema.sql)
- [Postman Collection](SweetShop_API.postman_collection.json)
- [Test Script](test-api.js)

## 🎯 Next Steps

1. Test all API endpoints using Postman
2. Add more sample data using the provided queries
3. Explore the database views and stored procedures
4. Consider adding authentication and authorization
5. Implement frontend application to consume the API 