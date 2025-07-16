import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

// Query keys for categories
export const categoriesKeys = {
  all: ['categories'] as const,
  lists: () => [...categoriesKeys.all, 'list'] as const,
};

// Get all unique categories from sweets
export const useCategories = () => {
  return useQuery({
    queryKey: categoriesKeys.lists(),
    queryFn: async () => {
      try {
        // Fetch all sweets to extract unique categories
        const response = await api.getAllSweets();
        const sweets = response.data;
        
        // Extract unique categories and sort them
        const categories = [...new Set(sweets.map(sweet => sweet.category))].sort();
        
        return categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Return default categories as fallback
        return ['Chocolate', 'Cakes', 'Candies', 'Ice Cream', 'Snacks'];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 