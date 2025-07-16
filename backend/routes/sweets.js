const express = require('express');
const router = express.Router();
const Sweet = require('../models/Sweet');

// GET /api/sweets - Get all sweets
router.get('/', async (req, res) => {
  try {
    const sweets = await Sweet.getAllSweets();
    res.json({
      success: true,
      data: sweets,
      count: sweets.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/sweets/:id - Get sweet by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const sweet = await Sweet.getSweetById(id);
    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    res.json({
      success: true,
      data: sweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/sweets - Create new sweet
router.post('/', async (req, res) => {
  try {
    const { name, category, price, in_stock } = req.body;

    // Basic validation
    if (!name || !category || !price || in_stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, price, and in_stock are required fields'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }

    if (in_stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative'
      });
    }

    const newSweet = await Sweet.createSweet({
      name: name.trim(),
      category: category.trim(),
      price: parseFloat(price),
      in_stock: parseInt(in_stock)
    });

    res.status(201).json({
      success: true,
      message: 'Sweet created successfully',
      data: newSweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/sweets/:id - Update sweet
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const { name, category, price, in_stock } = req.body;

    // Basic validation
    if (!name || !category || !price || in_stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, price, and in_stock are required fields'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }

    if (in_stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative'
      });
    }

    const updatedSweet = await Sweet.updateSweet(id, {
      name: name.trim(),
      category: category.trim(),
      price: parseFloat(price),
      in_stock: parseInt(in_stock)
    });

    res.json({
      success: true,
      message: 'Sweet updated successfully',
      data: updatedSweet
    });
  } catch (error) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/sweets/:id - Delete sweet
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const result = await Sweet.deleteSweet(id);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 