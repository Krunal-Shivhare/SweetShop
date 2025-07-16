import { describe, it, expect, beforeEach } from 'vitest';
import { SweetShopService } from '../sweetShop';
import { Sweet } from '../../types/sweet';

describe('SweetShopService', () => {
  let sweetShop: SweetShopService;

  beforeEach(() => {
    sweetShop = new SweetShopService();
  });

  describe('Add Sweets', () => {
    it('should add a new sweet to the shop', () => {
      const sweet: Omit<Sweet, 'id'> = {
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 10
      };

      const addedSweet = sweetShop.addSweet(sweet);

      expect(addedSweet).toEqual({
        ...sweet,
        id: expect.any(String)
      });
      expect(sweetShop.getSweets()).toHaveLength(1);
    });

    it('should generate unique IDs for each sweet', () => {
      const sweet1 = sweetShop.addSweet({
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 10
      });

      const sweet2 = sweetShop.addSweet({
        name: 'Gummy Bears',
        category: 'candy',
        price: 1.99,
        quantity: 15
      });

      expect(sweet1.id).not.toBe(sweet2.id);
    });

    it('should throw error for invalid price', () => {
      expect(() => {
        sweetShop.addSweet({
          name: 'Invalid Sweet',
          category: 'chocolate',
          price: -1,
          quantity: 10
        });
      }).toThrow('Price must be greater than 0');
    });

    it('should throw error for invalid quantity', () => {
      expect(() => {
        sweetShop.addSweet({
          name: 'Invalid Sweet',
          category: 'chocolate',
          price: 2.50,
          quantity: -1
        });
      }).toThrow('Quantity must be greater than or equal to 0');
    });
  });

  describe('Delete Sweets', () => {
    it('should delete a sweet by ID', () => {
      const sweet = sweetShop.addSweet({
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 10
      });

      const deleted = sweetShop.deleteSweet(sweet.id);

      expect(deleted).toBe(true);
      expect(sweetShop.getSweets()).toHaveLength(0);
    });

    it('should return false when trying to delete non-existent sweet', () => {
      const deleted = sweetShop.deleteSweet('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('View Sweets', () => {
    it('should return empty array when no sweets exist', () => {
      expect(sweetShop.getSweets()).toEqual([]);
    });

    it('should return all sweets', () => {
      sweetShop.addSweet({
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 10
      });

      sweetShop.addSweet({
        name: 'Gummy Bears',
        category: 'candy',
        price: 1.99,
        quantity: 15
      });

      expect(sweetShop.getSweets()).toHaveLength(2);
    });
  });
});