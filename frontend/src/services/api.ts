// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Types
export interface Sweet {
  id: number;
  name: string;
  category: 'Chocolate' | 'Cakes' | 'Candies' | 'Ice Cream' | 'Snacks';
  price: number;
  in_stock: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSweetRequest {
  name: string;
  category: string;
  price: number;
  in_stock: number;
}

export interface UpdateSweetRequest extends CreateSweetRequest {}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Transform the data to ensure proper types
      if (data.data) {
        if (Array.isArray(data.data)) {
          data.data = data.data.map(this.transformSweetData);
        } else {
          data.data = this.transformSweetData(data.data);
        }
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private transformSweetData(sweet: any): Sweet {
    return {
      ...sweet,
      price: typeof sweet.price === 'string' ? parseFloat(sweet.price) : sweet.price,
      in_stock: typeof sweet.in_stock === 'string' ? parseInt(sweet.in_stock) : sweet.in_stock,
    };
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string; environment: string }>> {
    return this.request('/health');
  }

  // Get all sweets
  async getAllSweets(): Promise<ApiResponse<Sweet[]>> {
    return this.request('/api/sweets');
  }

  // Get sweet by ID
  async getSweetById(id: number): Promise<ApiResponse<Sweet>> {
    return this.request(`/api/sweets/${id}`);
  }

  // Create new sweet
  async createSweet(sweet: CreateSweetRequest): Promise<ApiResponse<Sweet>> {
    return this.request('/api/sweets', {
      method: 'POST',
      body: JSON.stringify(sweet),
    });
  }

  // Update sweet
  async updateSweet(id: number, sweet: UpdateSweetRequest): Promise<ApiResponse<Sweet>> {
    return this.request(`/api/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sweet),
    });
  }

  // Delete sweet
  async deleteSweet(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/api/sweets/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual API functions for convenience
export const api = {
  healthCheck: () => apiClient.healthCheck(),
  getAllSweets: () => apiClient.getAllSweets(),
  getSweetById: (id: number) => apiClient.getSweetById(id),
  createSweet: (sweet: CreateSweetRequest) => apiClient.createSweet(sweet),
  updateSweet: (id: number, sweet: UpdateSweetRequest) => apiClient.updateSweet(id, sweet),
  deleteSweet: (id: number) => apiClient.deleteSweet(id),
}; 