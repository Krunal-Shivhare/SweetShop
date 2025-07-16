# SweetShop Backend API

A Node.js REST API for managing a sweets shop inventory with MySQL database integration.

## Features

- ✅ Complete CRUD operations for sweets
- ✅ MySQL database integration with connection pooling
- ✅ Input validation and error handling
- ✅ Search and filter functionality
- ✅ Stock management
- ✅ RESTful API design
- ✅ Security middleware (Helmet, CORS)
- ✅ Request logging
- ✅ Environment configuration

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `config.env` and update the database credentials:
   ```bash
   # Update config.env with your MySQL credentials
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=sweetshop_db
   DB_PORT=3306
   ```

4. **Create MySQL database:**
   ```sql
   CREATE DATABASE sweetshop_db;
   ```

5. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL: `http://localhost:3000/api/sweets`

### 🍬 Sweets Management

#### Get All Sweets
```http
GET /api/sweets
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Chocolate Truffle",
      "category": "Chocolate",
      "price": 2.50,
      "in_stock": 25,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Sweet by ID
```http
GET /api/sweets/:id
```

#### Get Sweets by Category
```http
GET /api/sweets/category/:category
```

#### Search Sweets by Name
```http
GET /api/sweets/search/:term
```

#### Get Low Stock Sweets (< 10 items)
```http
GET /api/sweets/low-stock
```

#### Create New Sweet
```http
POST /api/sweets
Content-Type: application/json

{
  "name": "Vanilla Cupcake",
  "category": "Cakes",
  "price": 3.00,
  "in_stock": 15
}
```

#### Update Sweet
```http
PUT /api/sweets/:id
Content-Type: application/json

{
  "name": "Updated Vanilla Cupcake",
  "category": "Cakes",
  "price": 3.50,
  "in_stock": 20
}
```

#### Update Stock Quantity
```http
PATCH /api/sweets/:id/stock
Content-Type: application/json

{
  "quantity": 5
}
```

#### Delete Sweet
```http
DELETE /api/sweets/:id
```

### 🏥 Health Check
```http
GET /health
```

## Database Schema

### Sweets Table
```sql
CREATE TABLE sweets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  in_stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Sample Data

You can insert sample data using MySQL:

```sql
INSERT INTO sweets (name, category, price, in_stock) VALUES
('Chocolate Truffle', 'Chocolate', 2.50, 25),
('Vanilla Cupcake', 'Cakes', 3.00, 15),
('Strawberry Cheesecake', 'Cakes', 4.50, 8),
('Gummy Bears', 'Candies', 1.75, 50),
('Dark Chocolate Bar', 'Chocolate', 2.00, 30),
('Red Velvet Cake', 'Cakes', 5.00, 12),
('Caramel Popcorn', 'Snacks', 2.25, 20),
('Mint Chocolate Chip', 'Ice Cream', 3.75, 18);
```

## Development

### Project Structure
```
backend/
├── database/
│   └── db.js              # Database connection and initialization
├── models/
│   └── Sweet.js           # Sweet model with CRUD operations
├── routes/
│   └── sweets.js          # API routes for sweets
├── middleware/
│   └── errorHandler.js    # Error handling middleware
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── config.env             # Environment variables
└── README.md              # This file
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Request data validation
- **SQL Injection Protection** - Parameterized queries
- **Error Handling** - Secure error responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 