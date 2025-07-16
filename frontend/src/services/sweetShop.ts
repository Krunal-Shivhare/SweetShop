import { Sweet, PurchaseRequest, SearchFilters, SortField, SortOrder } from '../types/sweet';

export class SweetShopService {
  private sweets: Sweet[] = [];

  /**
   * Add a new sweet to the shop
   */
  addSweet(sweetData: Omit<Sweet, 'id'>): Sweet {
    // Validation
    if (sweetData.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
    if (sweetData.quantity < 0) {
      throw new Error('Quantity must be greater than or equal to 0');
    }

    const sweet: Sweet = {
      ...sweetData,
      id: this.generateId()
    };

    this.sweets.push(sweet);
    return sweet;
  }

  /**
   * Delete a sweet by ID
   */
  deleteSweet(id: string): boolean {
    const initialLength = this.sweets.length;
    this.sweets = this.sweets.filter(sweet => sweet.id !== id);
    return this.sweets.length < initialLength;
  }

  /**
   * Get all sweets
   */
  getSweets(): Sweet[] {
    return [...this.sweets];
  }

  /**
   * Get a sweet by ID
   */
  getSweetById(id: string): Sweet | undefined {
    return this.sweets.find(sweet => sweet.id === id);
  }

  /**
   * Update a sweet
   */
  updateSweet(id: string, updates: Partial<Omit<Sweet, 'id'>>): Sweet | null {
    const index = this.sweets.findIndex(sweet => sweet.id === id);
    if (index === -1) return null;

    // Validation for updates
    if (updates.price !== undefined && updates.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
    if (updates.quantity !== undefined && updates.quantity < 0) {
      throw new Error('Quantity must be greater than or equal to 0');
    }

    this.sweets[index] = { ...this.sweets[index], ...updates };
    return this.sweets[index];
  }

  /**
   * Search sweets by filters
   */
  searchSweets(filters: SearchFilters): Sweet[] {
    return this.sweets.filter(sweet => {
      if (filters.name && !sweet.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.category && sweet.category !== filters.category) {
        return false;
      }
      if (filters.minPrice !== undefined && sweet.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && sweet.price > filters.maxPrice) {
        return false;
      }
      return true;
    });
  }

  /**
   * Sort sweets by field and order
   */
  sortSweets(field: SortField, order: SortOrder = 'asc'): Sweet[] {
    const sorted = [...this.sweets].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  /**
   * Purchase sweets (decrease quantity)
   */
  purchaseSweets(request: PurchaseRequest): Sweet {
    const sweet = this.getSweetById(request.sweetId);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    if (sweet.quantity < request.quantity) {
      throw new Error('Insufficient stock available');
    }

    if (request.quantity <= 0) {
      throw new Error('Purchase quantity must be greater than 0');
    }

    sweet.quantity -= request.quantity;
    return sweet;
  }

  /**
   * Restock sweets (increase quantity)
   */
  restockSweet(id: string, quantity: number): Sweet {
    if (quantity <= 0) {
      throw new Error('Restock quantity must be greater than 0');
    }

    const sweet = this.getSweetById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    sweet.quantity += quantity;
    return sweet;
  }

  /**
   * Get total value of inventory
   */
  getTotalInventoryValue(): number {
    return this.sweets.reduce((total, sweet) => total + (sweet.price * sweet.quantity), 0);
  }

  /**
   * Get sweets by category
   */
  getSweetsByCategory(category: Sweet['category']): Sweet[] {
    return this.sweets.filter(sweet => sweet.category === category);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `sweet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}