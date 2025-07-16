#!/usr/bin/env node

/**
 * Database Clearing Script for SweetShop
 * 
 * This script will:
 * 1. Clear all existing data from the database
 * 2. Reset the auto-increment counter
 * 3. Verify the database is empty
 * 
 * Usage: node clear.js
 */

const { runClearDatabase } = require('./scripts/clearDatabase');

// Run the clearing process
runClearDatabase(); 