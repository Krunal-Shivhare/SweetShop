# Database Seeding Scripts

This directory contains scripts for managing the SweetShop database.

## Files

- `seedDatabase.js` - Main seeding script with comprehensive functionality
- `README.md` - This documentation file

## Usage

### Quick Start

From the `backend` directory, run one of these commands:

```bash
# Using npm script (recommended)
npm run seed

# Or directly
node seed.js

# Or run the script directly
node scripts/seedDatabase.js
```

### What the Script Does

1. **Clears Database**: Removes all existing data from the `sweets` table
2. **Populates Database**: Adds 5 categories with 3-5 items each:
   - **Chocolate** (5 items)
   - **Cakes & Pastries** (4 items)
   - **Candies & Gummies** (5 items)
   - **Ice Cream & Frozen** (5 items)
   - **Snacks & Treats** (4 items)
3. **Displays Statistics**: Shows summary of the seeded data

### Sample Data Structure

The script creates the following categories and items:

#### Chocolate (5 items)
- Dark Chocolate Truffle - $3.50
- Milk Chocolate Bar - $2.25
- White Chocolate Bonbons - $4.00
- Chocolate Covered Strawberries - $5.50
- Chocolate Fudge Brownie - $3.75

#### Cakes & Pastries (4 items)
- Vanilla Cupcake - $3.00
- Chocolate Lava Cake - $4.50
- Red Velvet Cake Slice - $4.25
- Strawberry Cheesecake - $5.00

#### Candies & Gummies (5 items)
- Gummy Bears - $1.75
- Sour Patch Kids - $2.00
- Jelly Beans - $1.50
- Hard Candies - $1.25
- Lollipops - $0.75

#### Ice Cream & Frozen (5 items)
- Vanilla Ice Cream - $3.75
- Chocolate Ice Cream - $3.75
- Strawberry Ice Cream - $3.50
- Mint Chocolate Chip - $4.00
- Cookie Dough Ice Cream - $4.25

#### Snacks & Treats (4 items)
- Caramel Popcorn - $2.25
- Chocolate Covered Nuts - $3.50
- Trail Mix - $2.75
- Rice Krispies Treats - $2.00

### Output Example

When you run the script, you'll see output like this:

```
🚀 Starting database seeding process...

✅ Database connection successful!

🗑️  Clearing database...
✅ Database cleared successfully!

🌱 Populating database with sample data...
📦 Adding Chocolate category...
📦 Adding Cakes & Pastries category...
📦 Adding Candies & Gummies category...
📦 Adding Ice Cream & Frozen category...
📦 Adding Snacks & Treats category...
✅ Database populated successfully with 23 items!

📊 Database Statistics:
========================
Total items: 23

📈 Items by Category:
  Candies & Gummies: 5 items, Avg Price: $1.45, Total Stock: 270
  Chocolate: 5 items, Avg Price: $3.80, Total Stock: 130
  Ice Cream & Frozen: 5 items, Avg Price: $3.85, Total Stock: 75
  Cakes & Pastries: 4 items, Avg Price: $4.19, Total Stock: 55
  Snacks & Treats: 4 items, Avg Price: $2.63, Total Stock: 110

💰 Total Inventory Value: $1,234.50
📊 Average Price: $3.18

⚠️  Low Stock Items (< 10):
  Strawberry Cheesecake (Cakes & Pastries): 10 in stock
  Cookie Dough Ice Cream (Ice Cream & Frozen): 10 in stock

🎉 Database seeding completed successfully!
```

### Prerequisites

1. **Database Setup**: Make sure your MySQL database is running and accessible
2. **Environment Variables**: Ensure your `config.env` file is properly configured with database credentials
3. **Dependencies**: All required npm packages should be installed

### Environment Variables

Make sure your `config.env` file contains:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=sweetshop_db
DB_PORT=3306
```

### Troubleshooting

**Connection Error**: 
- Check if MySQL is running
- Verify database credentials in `config.env`
- Ensure the database `sweetshop_db` exists

**Permission Error**:
- Make sure your database user has INSERT, DELETE, and ALTER permissions

**Table Not Found**:
- Run the database initialization first: `node database/db.js` (if available)
- Or manually create the `sweets` table using the schema in `database/schema.sql`

### Customization

To modify the sample data, edit the `sampleData` array in `seedDatabase.js`. Each category should have:

```javascript
{
  category: 'Category Name',
  items: [
    { name: 'Item Name', price: 2.50, in_stock: 25 },
    // ... more items
  ]
}
```

### API Integration

The script can also be imported and used programmatically:

```javascript
const { seedDatabase, clearDatabase, populateDatabase } = require('./scripts/seedDatabase');

// Run full seeding process
await seedDatabase();

// Or run individual functions
await clearDatabase();
await populateDatabase();
``` 