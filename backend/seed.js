#!/usr/bin/env node

/**
 * Database Seeding Script for SweetShop
 * 
 * This script will:
 * 1. Clear all existing data from the database
 * 2. Populate the database with 5 categories and 3-5 items each
 * 3. Display statistics about the seeded data
 * 
 * Usage: node seed.js
 */

const { seedDatabase } = require('./scripts/seedDatabase');

// Run the seeding process
seedDatabase(); 