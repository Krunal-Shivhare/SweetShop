import React, { createContext, useContext, ReactNode } from 'react';
import { Sweet, PurchaseRequest, SearchFilters, SortField, SortOrder } from '../types/sweet';
import { useSweets, useCreateSweet, useUpdateSweet, useDeleteSweet } from '../hooks/useSweets';

interface SweetShopState {
  sweets: Sweet[];
  searchFilters: SearchFilters;
  sortField: SortField;
  sortOrder: SortOrder;
  isLoading: boolean;
  error: string | null;
}

interface SweetShopContextType {
  state: SweetShopState;
  actions: {
    addSweet: (sweetData: Omit<Sweet, 'id'>) => void;
    deleteSweet: (id: string) => void;
    updateSweet: (id: string, updates: Partial<Omit<Sweet, 'id'>>) => void;
    searchSweets: (filters: SearchFilters) => void;
    sortSweets: (field: SortField, order: SortOrder) => void;
    purchaseSweets: (request: PurchaseRequest) => void;
    restockSweet: (id: string, quantity: number) => void;
    clearFilters: () => void;
    clearError: () => void;
  };
}

const SweetShopContext = createContext<SweetShopContextType | undefined>(undefined);

export const SweetShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // API hooks
  const { data: sweets = [], isLoading: isLoadingSweets, error: sweetsError } = useSweets();
  const createSweetMutation = useCreateSweet();
  const updateSweetMutation = useUpdateSweet();
  const deleteSweetMutation = useDeleteSweet();

  // Local state for search and sort
  const [searchFilters, setSearchFilters] = React.useState<SearchFilters>({});
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');

  // Filter and sort sweets
  const filteredAndSortedSweets = React.useMemo(() => {
    // Ensure sweets data is valid
    const validSweets = sweets.filter(sweet => 
      sweet && 
      typeof sweet.id === 'number' && 
      typeof sweet.price === 'number' && 
      typeof sweet.in_stock === 'number' &&
      typeof sweet.name === 'string' &&
      typeof sweet.category === 'string'
    );

    let filtered = validSweets.filter(sweet => {
      if (searchFilters.name && !sweet.name.toLowerCase().includes(searchFilters.name.toLowerCase())) {
        return false;
      }
      if (searchFilters.category && sweet.category !== searchFilters.category) {
        return false;
      }
      if (searchFilters.minPrice !== undefined && sweet.price < searchFilters.minPrice) {
        return false;
      }
      if (searchFilters.maxPrice !== undefined && sweet.price > searchFilters.maxPrice) {
        return false;
      }
      return true;
    });

    // Sort sweets
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [sweets, searchFilters, sortField, sortOrder]);

  const actions = {
    addSweet: (sweetData: Omit<Sweet, 'id'>) => {
      createSweetMutation.mutate({
        name: sweetData.name,
        category: sweetData.category,
        price: sweetData.price,
        in_stock: sweetData.in_stock
      });
    },

    deleteSweet: (id: string) => {
      deleteSweetMutation.mutate(parseInt(id));
    },

    updateSweet: (id: string, updates: Partial<Omit<Sweet, 'id'>>) => {
      updateSweetMutation.mutate({ id: parseInt(id), sweet: updates as any });
    },

    searchSweets: (filters: SearchFilters) => {
      setSearchFilters(filters);
    },

    sortSweets: (field: SortField, order: SortOrder) => {
      setSortField(field);
      setSortOrder(order);
    },

    purchaseSweets: (request: PurchaseRequest) => {
      // Find the sweet and update its stock
      const sweet = sweets.find(s => s.id.toString() === request.sweetId);
      if (sweet && sweet.in_stock >= request.quantity) {
        const updatedSweet = {
          ...sweet,
          in_stock: sweet.in_stock - request.quantity
        };
        updateSweetMutation.mutate({ id: sweet.id, sweet: updatedSweet });
      }
    },

    restockSweet: (id: string, quantity: number) => {
      const sweet = sweets.find(s => s.id.toString() === id);
      if (sweet) {
        const updatedSweet = {
          ...sweet,
          in_stock: sweet.in_stock + quantity
        };
        updateSweetMutation.mutate({ id: sweet.id, sweet: updatedSweet });
      }
    },

    clearFilters: () => {
      setSearchFilters({});
    },

    clearError: () => {
      // Errors are handled by the API hooks
    },
  };

  const state: SweetShopState = {
    sweets: filteredAndSortedSweets,
    searchFilters,
    sortField,
    sortOrder,
    isLoading: isLoadingSweets || createSweetMutation.isPending || updateSweetMutation.isPending || deleteSweetMutation.isPending,
    error: sweetsError?.message || null,
  };

  const contextValue = React.useMemo(() => ({
    state,
    actions,
  }), [state, actions]);

  return (
    <SweetShopContext.Provider value={contextValue}>
      {children}
    </SweetShopContext.Provider>
  );
};

export const useSweetShop = () => {
  const context = useContext(SweetShopContext);
  if (context === undefined) {
    throw new Error('useSweetShop must be used within a SweetShopProvider');
  }
  return context;
};