export interface Sweet {
  id: number;
  name: string;
  category: 'Chocolate' | 'Cakes' | 'Candies' | 'Ice Cream' | 'Snacks';
  price: number;
  in_stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface PurchaseRequest {
  sweetId: string;
  quantity: number;
}

export interface SearchFilters {
  name?: string;
  category?: Sweet['category'];
  minPrice?: number;
  maxPrice?: number;
}

export type SortField = 'name' | 'category' | 'price' | 'in_stock';
export type SortOrder = 'asc' | 'desc';