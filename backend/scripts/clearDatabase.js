const { pool } = require('../database/db');
require('dotenv').config({ path: './config.env' });

// Function to clear the database
const clearDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('🗑️  Clearing database...');
    
    // Delete all records from sweets table
    const [deleteResult] = await connection.execute('DELETE FROM sweets');
    
    // Reset auto-increment counter
    await connection.execute('ALTER TABLE sweets AUTO_INCREMENT = 1');
    
    connection.release();
    
    console.log(`✅ Database cleared successfully!`);
    console.log(`📊 Deleted ${deleteResult.affectedRows} records`);
    console.log(`🔄 Auto-increment counter reset to 1`);
    
    return {
      success: true,
      deletedRecords: deleteResult.affectedRows,
      message: 'Database cleared successfully'
    };
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    throw error;
  }
};

// Function to verify database is empty
const verifyEmptyDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute('SELECT COUNT(*) as count FROM sweets');
    const count = result[0].count;
    
    connection.release();
    
    if (count === 0) {
      console.log('✅ Database verification: No records found (database is empty)');
      return true;
    } else {
      console.log(`⚠️  Database verification: ${count} records still exist`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error verifying database:', error.message);
    return false;
  }
};

// Main function to run the clearing process
const runClearDatabase = async () => {
  try {
    console.log('🚀 Starting database clearing process...\n');
    
    // Test database connection
    await pool.getConnection().then(conn => {
      console.log('✅ Database connection successful!');
      conn.release();
    });
    
    // Clear the database
    const result = await clearDatabase();
    
    // Verify the database is empty
    await verifyEmptyDatabase();
    
    console.log('\n🎉 Database clearing completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Database clearing failed:', error.message);
    process.exit(1);
  }
};

// Run the clearing process if this file is executed directly
if (require.main === module) {
  runClearDatabase();
}

module.exports = {
  clearDatabase,
  verifyEmptyDatabase,
  runClearDatabase
}; 