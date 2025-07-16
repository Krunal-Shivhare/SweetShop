const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/sweets';

// Test data
const testSweet = {
  name: 'Test Chocolate Bar',
  category: 'Chocolate',
  price: 2.99,
  in_stock: 50
};

const updatedSweet = {
  name: 'Updated Chocolate Bar',
  category: 'Chocolate',
  price: 3.49,
  in_stock: 45
};

// Helper function to make requests
const makeRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ ${method} ${url} failed:`, error.response?.data || error.message);
    return null;
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('\n🏥 Testing Health Check...');
  const result = await makeRequest('GET', 'http://localhost:3000/health');
  if (result) {
    console.log('✅ Health check passed:', result.message);
  }
};

const testCreateSweet = async () => {
  console.log('\n🍬 Testing Create Sweet...');
  const result = await makeRequest('POST', BASE_URL, testSweet);
  if (result) {
    console.log('✅ Sweet created:', result.data);
    return result.data.id;
  }
  return null;
};

const testGetAllSweets = async () => {
  console.log('\n📋 Testing Get All Sweets...');
  const result = await makeRequest('GET', BASE_URL);
  if (result) {
    console.log(`✅ Found ${result.count} sweets`);
    return result.data;
  }
  return [];
};

const testGetSweetById = async (id) => {
  console.log(`\n🔍 Testing Get Sweet by ID (${id})...`);
  const result = await makeRequest('GET', `${BASE_URL}/${id}`);
  if (result) {
    console.log('✅ Sweet found:', result.data);
  }
};

const testUpdateSweet = async (id) => {
  console.log(`\n✏️ Testing Update Sweet (${id})...`);
  const result = await makeRequest('PUT', `${BASE_URL}/${id}`, updatedSweet);
  if (result) {
    console.log('✅ Sweet updated:', result.data);
  }
};

const testDeleteSweet = async (id) => {
  console.log(`\n🗑️ Testing Delete Sweet (${id})...`);
  const result = await makeRequest('DELETE', `${BASE_URL}/${id}`);
  if (result) {
    console.log('✅ Sweet deleted:', result.message);
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');
  
  // Test health check
  await testHealthCheck();
  
  // Test CRUD operations
  const sweetId = await testCreateSweet();
  
  if (sweetId) {
    await testGetAllSweets();
    await testGetSweetById(sweetId);
    await testUpdateSweet(sweetId);
    await testDeleteSweet(sweetId);
  }
  
  console.log('\n🎉 All tests completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  makeRequest,
  runTests
}; 