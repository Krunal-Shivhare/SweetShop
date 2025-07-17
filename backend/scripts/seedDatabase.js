const { pool } = require('../database/db');
require('dotenv').config({ path: './config.env' });

// Sample data for 5 categories of Indian sweets with 3-5 items each
const sampleData = [
  // Category 1: Milk-based Sweets
  {
    category: 'Milk-based Sweets',
    items: [
      { name: 'Gulab Jamun', price: 15.00, in_stock: 30 },
      { name: 'Rasgulla', price: 12.50, in_stock: 35 },
      { name: 'Rasmalai', price: 18.00, in_stock: 25 },
      { name: 'Kheer', price: 22.00, in_stock: 20 },
      { name: 'Sandesh', price: 16.50, in_stock: 28 }
    ]
  },
  
  // Category 2: Dry Sweets
  {
    category: 'Dry Sweets',
    items: [
      { name: 'Ladoo', price: 10.00, in_stock: 40 },
      { name: 'Barfi', price: 14.00, in_stock: 35 },
      { name: 'Jalebi', price: 11.00, in_stock: 45 },
      { name: 'Soan Papdi', price: 13.50, in_stock: 30 },
      { name: 'Besan Ladoo', price: 12.00, in_stock: 38 }
    ]
  },
  
  // Category 3: Festival Specials
  {
    category: 'Festival Specials',
    items: [
      { name: 'Modak', price: 20.00, in_stock: 25 },
      { name: 'Puran Poli', price: 25.00, in_stock: 20 },
      { name: 'Gujiya', price: 18.50, in_stock: 30 },
      { name: 'Karanji', price: 17.00, in_stock: 32 }
    ]
  },
  
  // Category 4: North Indian Sweets
  {
    category: 'North Indian Sweets',
    items: [
      { name: 'Peda', price: 15.00, in_stock: 35 },
      { name: 'Kulfi', price: 19.00, in_stock: 28 },
      { name: 'Phirni', price: 24.00, in_stock: 22 },
      { name: 'Shahi Tukda', price: 28.00, in_stock: 18 },
      { name: 'Gajar Ka Halwa', price: 26.50, in_stock: 25 }
    ]
  },
  
  // Category 5: South Indian Sweets
  {
    category: 'South Indian Sweets',
    items: [
      { name: 'Payasam', price: 23.00, in_stock: 20 },
      { name: 'Mysore Pak', price: 21.00, in_stock: 30 },
      { name: 'Pongal', price: 16.00, in_stock: 35 },
      { name: 'Kesari', price: 14.50, in_stock: 40 },
      { name: 'Coconut Burfi', price: 19.50, in_stock: 28 }
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