import { describe, it, expect, beforeEach } from 'vitest';
import { SweetShopService } from '../sweetShop';

describe('SweetShopService - Inventory Management', () => {
  let sweetShop: SweetShopService;

  beforeEach(() => {
    sweetShop = new SweetShopService();
  });

  describe('Purchase Sweets', () => {
    it('should purchase sweets and decrease quantity', () => {
      const sweet = sweetShop.addSweet({
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 10
      });

      const updatedSweet = sweetShop.purchaseSweets({
        sweetId: sweet.id,
        quantity: 3
      });

      expect(updatedSweet.quantity).toBe(7);
    });

    it('should throw error when insufficient stock', () => {
      const sweet = sweetShop.addSweet({
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 5
      });

      expect(() => {
        sweetShop.purchaseSweets({
          sweetId: sweet.id,
          quantity: 10
        });
      }).toThrow('Insufficient stock available');
    });

    it('should throw error when sweet not found', () => {
      expect(() => {
        sweetShop.purchaseSweets({
          sweetId: 'non-existent',
          quantity: 1
        });
      }).toThrow('Sweet not found');
    });

    it('should throw error for invalid purchase quantity', () => {
      const sweet = sweetShop.addSweet({
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 10
      });

      expect(() => {
        sweetShop.purchaseSweets({
          sweetId: sweet.id,
          quantity: 0
        });
      }).toThrow('Purchase quantity must be greater than 0');
    });
  });

  describe('Restock Sweets', () => {
    it('should restock sweets and increase quantity', () => {
      const sweet = sweetShop.addSweet({
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 5
      });

      const restockedSweet = sweetShop.restockSweet(sweet.id, 10);
      expect(restockedSweet.quantity).toBe(15);
    });

    it('should throw error when sweet not found', () => {
      expect(() => {
        sweetShop.restockSweet('non-existent', 10);
      }).toThrow('Sweet not found');
    });

    it('should throw error for invalid restock quantity', () => {
      const sweet = sweetShop.addSweet({
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 5
      });

      expect(() => {
        sweetShop.restockSweet(sweet.id, 0);
      }).toThrow('Restock quantity must be greater than 0');
    });
  });

  describe('Inventory Analysis', () => {
    it('should calculate total inventory value', () => {
      sweetShop.addSweet({
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 10
      }); // Value: 25.00

      sweetShop.addSweet({
        name: 'Gummy Bears',
        category: 'candy',
        price: 1.99,
        quantity: 5
      }); // Value: 9.95

      expect(sweetShop.getTotalInventoryValue()).toBe(34.95);
    });

    it('should get sweets by category', () => {
      sweetShop.addSweet({
        name: 'Dark Chocolate',
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

      const chocolates = sweetShop.getSweetsByCategory('chocolate');
      expect(chocolates).toHaveLength(2);
      expect(chocolates.every(sweet => sweet.category === 'chocolate')).toBe(true);
    });
  });
});