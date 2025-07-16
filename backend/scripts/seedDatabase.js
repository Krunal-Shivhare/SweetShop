const { pool } = require('../database/db');
require('dotenv').config({ path: './config.env' });

// Sample data for 5 categories with 3-5 items each
const sampleData = [
  // Category 1: Chocolate
  {
    category: 'Chocolate',
    items: [
      { name: 'Dark Chocolate Truffle', price: 3.50, in_stock: 25 },
      { name: 'Milk Chocolate Bar', price: 2.25, in_stock: 40 },
      { name: 'White Chocolate Bonbons', price: 4.00, in_stock: 15 },
      { name: 'Chocolate Covered Strawberries', price: 5.50, in_stock: 20 },
      { name: 'Chocolate Fudge Brownie', price: 3.75, in_stock: 30 }
    ]
  },
  
  // Category 2: Cakes & Pastries
  {
    category: 'Cakes & Pastries',
    items: [
      { name: 'Vanilla Cupcake', price: 3.00, in_stock: 15 },
      { name: 'Chocolate Lava Cake', price: 4.50, in_stock: 12 },
      { name: 'Red Velvet Cake Slice', price: 4.25, in_stock: 18 },
      { name: 'Strawberry Cheesecake', price: 5.00, in_stock: 10 }
    ]
  },
  
  // Category 3: Candies & Gummies
  {
    category: 'Candies & Gummies',
    items: [
      { name: 'Gummy Bears', price: 1.75, in_stock: 50 },
      { name: 'Sour Patch Kids', price: 2.00, in_stock: 45 },
      { name: 'Jelly Beans', price: 1.50, in_stock: 60 },
      { name: 'Hard Candies', price: 1.25, in_stock: 35 },
      { name: 'Lollipops', price: 0.75, in_stock: 80 }
    ]
  },
  
  // Category 4: Ice Cream & Frozen
  {
    category: 'Ice Cream & Frozen',
    items: [
      { name: 'Vanilla Ice Cream', price: 3.75, in_stock: 20 },
      { name: 'Chocolate Ice Cream', price: 3.75, in_stock: 18 },
      { name: 'Strawberry Ice Cream', price: 3.50, in_stock: 15 },
      { name: 'Mint Chocolate Chip', price: 4.00, in_stock: 12 },
      { name: 'Cookie Dough Ice Cream', price: 4.25, in_stock: 10 }
    ]
  },
  
  // Category 5: Snacks & Treats
  {
    category: 'Snacks & Treats',
    items: [
      { name: 'Caramel Popcorn', price: 2.25, in_stock: 30 },
      { name: 'Chocolate Covered Nuts', price: 3.50, in_stock: 20 },
      { name: 'Trail Mix', price: 2.75, in_stock: 25 },
      { name: 'Rice Krispies Treats', price: 2.00, in_stock: 35 }
    ]
  }
];

// Function to clear the database
const clearDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('🗑️  Clearing database...');
    
    // Delete all records from sweets table
    await connection.execute('DELETE FROM sweets');
    
    // Reset auto-increment counter
    await connection.execute('ALTER TABLE sweets AUTO_INCREMENT = 1');
    
    connection.release();
    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    throw error;
  }
};

// Function to populate the database
const populateDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('🌱 Populating database with sample data...');
    
    let totalItems = 0;
    
    for (const category of sampleData) {
      console.log(`📦 Adding ${category.category} category...`);
      
      for (const item of category.items) {
        await connection.execute(
          'INSERT INTO sweets (name, category, price, in_stock) VALUES (?, ?, ?, ?)',
          [item.name, category.category, item.price, item.in_stock]
        );
        totalItems++;
      }
    }
    
    connection.release();
    console.log(`✅ Database populated successfully with ${totalItems} items!`);
  } catch (error) {
    console.error('❌ Error populating database:', error.message);
    throw error;
  }
};

// Function to display database statistics
const displayStatistics = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n📊 Database Statistics:');
    console.log('========================');
    
    // Total items
    const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM sweets');
    console.log(`Total items: ${totalResult[0].total}`);
    
    // Items by category
    const [categoryResult] = await connection.execute(`
      SELECT category, COUNT(*) as count, 
             AVG(price) as avg_price, 
             SUM(in_stock) as total_stock
      FROM sweets 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    console.log('\n📈 Items by Category:');
    categoryResult.forEach(cat => {
      console.log(`  ${cat.category}: ${cat.count} items, Avg Price: $${cat.avg_price.toFixed(2)}, Total Stock: ${cat.total_stock}`);
    });
    
    // Total inventory value
    const [valueResult] = await connection.execute(`
      SELECT SUM(price * in_stock) as total_value, 
             AVG(price) as avg_price
      FROM sweets
    `);
    
    console.log(`\n💰 Total Inventory Value: $${valueResult[0].total_value.toFixed(2)}`);
    console.log(`📊 Average Price: $${valueResult[0].avg_price.toFixed(2)}`);
    
    // Low stock items (less than 10)
    const [lowStockResult] = await connection.execute(`
      SELECT name, category, in_stock 
      FROM sweets 
      WHERE in_stock < 10 
      ORDER BY in_stock ASC
    `);
    
    if (lowStockResult.length > 0) {
      console.log('\n⚠️  Low Stock Items (< 10):');
      lowStockResult.forEach(item => {
        console.log(`  ${item.name} (${item.category}): ${item.in_stock} in stock`);
      });
    }
    
    connection.release();
  } catch (error) {
    console.error('❌ Error displaying statistics:', error.message);
  }
};

// Main function to run the seeding process
const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding process...\n');
    
    // Test database connection
    await pool.getConnection().then(conn => {
      console.log('✅ Database connection successful!');
      conn.release();
    });
    
    // Clear the database
    await clearDatabase();
    
    // Populate with new data
    await populateDatabase();
    
    // Display statistics
    await displayStatistics();
    
    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Database seeding failed:', error.message);
    process.exit(1);
  }
};

// Run the seeding process if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  clearDatabase,
  populateDatabase,
  displayStatistics,
  sampleData
}; 