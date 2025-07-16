const { pool } = require('../database/db');

class Sweet {
  // Get all sweets
  static async getAllSweets() {
    try {
      const [rows] = await pool.execute('SELECT * FROM sweets ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw new Error(`Error fetching sweets: ${error.message}`);
    }
  }

  // Get sweet by ID
  static async getSweetById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM sweets WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching sweet: ${error.message}`);
    }
  }

  // Create new sweet
  static async createSweet(sweetData) {
    try {
      const { name, category, price, in_stock } = sweetData;
      
      // Validate required fields
      if (!name || !category || !price || in_stock === undefined) {
        throw new Error('Name, category, price, and in_stock are required fields');
      }

      const [result] = await pool.execute(
        'INSERT INTO sweets (name, category, price, in_stock) VALUES (?, ?, ?, ?)',
        [name, category, price, in_stock]
      );
      
      return { id: result.insertId, ...sweetData };
    } catch (error) {
      throw new Error(`Error creating sweet: ${error.message}`);
    }
  }

  // Update sweet
  static async updateSweet(id, sweetData) {
    try {
      const { name, category, price, in_stock } = sweetData;
      
      // Check if sweet exists
      const existingSweet = await this.getSweetById(id);
      if (!existingSweet) {
        throw new Error('Sweet not found');
      }

      const [result] = await pool.execute(
        'UPDATE sweets SET name = ?, category = ?, price = ?, in_stock = ? WHERE id = ?',
        [name, category, price, in_stock, id]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Sweet not found or no changes made');
      }
      
      return { id, ...sweetData };
    } catch (error) {
      throw new Error(`Error updating sweet: ${error.message}`);
    }
  }

  // Delete sweet
  static async deleteSweet(id) {
    try {
      // Check if sweet exists
      const existingSweet = await this.getSweetById(id);
      if (!existingSweet) {
        throw new Error('Sweet not found');
      }

      const [result] = await pool.execute('DELETE FROM sweets WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Sweet not found');
      }
      
      return { message: 'Sweet deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting sweet: ${error.message}`);
    }
  }
}

module.exports = Sweet; 