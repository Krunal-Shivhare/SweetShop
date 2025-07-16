import { describe, it, expect, beforeEach } from 'vitest';
import { SweetShopService } from '../sweetShop';

describe('SweetShopService - Search and Sort', () => {
  let sweetShop: SweetShopService;

  beforeEach(() => {
    sweetShop = new SweetShopService();
    
    // Add sample data
    sweetShop.addSweet({
      name: 'Dark Chocolate Bar',
      category: 'chocolate',
      price: 3.50,
      quantity: 10
    });

    sweetShop.addSweet({
      name: 'Milk Chocolate',
      category: 'chocolate',
      price: 2.99,
      quantity: 15
    });

    sweetShop.addSweet({
      name: 'Gummy Bears',
      category: 'candy',
      price: 1.99,
      quantity: 20
    });

    sweetShop.addSweet({
      name: 'Croissant',
      category: 'pastry',
      price: 4.50,
      quantity: 5
    });

    sweetShop.addSweet({
      name: 'Lollipop',
      category: 'candy',
      price: 0.99,
      quantity: 30
    });
  });

  describe('Search Functionality', () => {
    it('should search by name (case insensitive)', () => {
      const results = sweetShop.searchSweets({ name: 'chocolate' });
      expect(results).toHaveLength(2);
      expect(results.every(sweet => sweet.name.toLowerCase().includes('chocolate'))).toBe(true);
    });

    it('should search by category', () => {
      const results = sweetShop.searchSweets({ category: 'candy' });
      expect(results).toHaveLength(2);
      expect(results.every(sweet => sweet.category === 'candy')).toBe(true);
    });

    it('should search by price range', () => {
      const results = sweetShop.searchSweets({ minPrice: 2, maxPrice: 4 });
      expect(results).toHaveLength(2);
      expect(results.every(sweet => sweet.price >= 2 && sweet.price <= 4)).toBe(true);
    });

    it('should search with multiple filters', () => {
      const results = sweetShop.searchSweets({ 
        category: 'chocolate',
        maxPrice: 3.20
      });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Milk Chocolate');
    });

    it('should return empty array when no matches found', () => {
      const results = sweetShop.searchSweets({ name: 'nonexistent' });
      expect(results).toHaveLength(0);
    });
  });

  describe('Sort Functionality', () => {
    it('should sort by name ascending', () => {
      const results = sweetShop.sortSweets('name', 'asc');
      expect(results[0].name).toBe('Croissant');
      expect(results[results.length - 1].name).toBe('Milk Chocolate');
    });

    it('should sort by name descending', () => {
      const results = sweetShop.sortSweets('name', 'desc');
      expect(results[0].name).toBe('Milk Chocolate');
      expect(results[results.length - 1].name).toBe('Croissant');
    });

    it('should sort by price ascending', () => {
      const results = sweetShop.sortSweets('price', 'asc');
      expect(results[0].price).toBe(0.99);
      expect(results[results.length - 1].price).toBe(4.50);
    });

    it('should sort by quantity descending', () => {
      const results = sweetShop.sortSweets('quantity', 'desc');
      expect(results[0].quantity).toBe(30);
      expect(results[results.length - 1].quantity).toBe(5);
    });

    it('should sort by category', () => {
      const results = sweetShop.sortSweets('category', 'asc');
      expect(results[0].category).toBe('candy');
      expect(results[results.length - 1].category).toBe('pastry');
    });
  });
});