import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Sweet, CreateSweetRequest, UpdateSweetRequest } from '../services/api';
import { toast } from 'sonner';

// Query keys
export const sweetsKeys = {
  all: ['sweets'] as const,
  lists: () => [...sweetsKeys.all, 'list'] as const,
  list: (filters: string) => [...sweetsKeys.lists(), { filters }] as const,
  details: () => [...sweetsKeys.all, 'detail'] as const,
  detail: (id: number) => [...sweetsKeys.details(), id] as const,
};

// Get all sweets
export const useSweets = () => {
  return useQuery({
    queryKey: sweetsKeys.lists(),
    queryFn: async () => {
      try {
        const response = await api.getAllSweets();
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch sweets:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

// Get sweet by ID
export const useSweet = (id: number) => {
  return useQuery({
    queryKey: sweetsKeys.detail(id),
    queryFn: async () => {
      const response = await api.getSweetById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create sweet
export const useCreateSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sweet: CreateSweetRequest) => {
      const response = await api.createSweet(sweet);
      return response.data;
    },
    onSuccess: (newSweet) => {
      // Invalidate and refetch sweets list
      queryClient.invalidateQueries({ queryKey: sweetsKeys.lists() });
      
      // Add the new sweet to the cache
      queryClient.setQueryData(sweetsKeys.lists(), (old: Sweet[] = []) => {
        return [newSweet, ...old];
      });

      toast.success('Sweet created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create sweet: ${error.message}`);
    },
  });
};

// Update sweet
export const useUpdateSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, sweet }: { id: number; sweet: UpdateSweetRequest }) => {
      const response = await api.updateSweet(id, sweet);
      return response.data;
    },
    onSuccess: (updatedSweet) => {
      // Invalidate and refetch sweets list
      queryClient.invalidateQueries({ queryKey: sweetsKeys.lists() });
      
      // Update the specific sweet in the cache
      queryClient.setQueryData(sweetsKeys.detail(updatedSweet.id), updatedSweet);

      toast.success('Sweet updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update sweet: ${error.message}`);
    },
  });
};

// Delete sweet
export const useDeleteSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.deleteSweet(id);
      return { id, message: response.message };
    },
    onSuccess: ({ id }) => {
      // Invalidate and refetch sweets list
      queryClient.invalidateQueries({ queryKey: sweetsKeys.lists() });
      
      // Remove the sweet from the cache
      queryClient.removeQueries({ queryKey: sweetsKeys.detail(id) });

      toast.success('Sweet deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete sweet: ${error.message}`);
    },
  });
};

// Health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await api.healthCheck();
      return response.data;
    },
    refetchInterval: 30000, // Check every 30 seconds
    refetchIntervalInBackground: true,
  });
}; 