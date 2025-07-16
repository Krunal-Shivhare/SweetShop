import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SearchFilters, SortField, SortOrder, Sweet } from '../types/sweet';
import { useSweetShop } from '../contexts/SweetShopContext';
import { Search, Filter, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const SearchAndFilter: React.FC = () => {
  const { state, actions } = useSweetShop();
  const [localFilters, setLocalFilters] = useState<SearchFilters>({});
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleSearch = () => {
    const filters: SearchFilters = {
      ...localFilters,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    };
    actions.searchSweets(filters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    setPriceRange({ min: '', max: '' });
    actions.clearFilters();
  };

  const handleSort = (field: SortField) => {
    const newOrder: SortOrder = 
      state.sortField === field && state.sortOrder === 'asc' ? 'desc' : 'asc';
    actions.sortSweets(field, newOrder);
  };

  const getSortIcon = (field: SortField) => {
    if (state.sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return state.sortOrder === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const hasActiveFilters = 
    localFilters.name || 
    localFilters.category || 
    priceRange.min || 
    priceRange.max;

  const activeFilterCount = [
    localFilters.name,
    localFilters.category,
    priceRange.min,
    priceRange.max
  ].filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {activeFilterCount} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search by name */}
        <div className="space-y-2">
          <Label htmlFor="search-name">Search by name</Label>
          <Input
            id="search-name"
            placeholder="Enter sweet name..."
            value={localFilters.name || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, name: e.target.value || undefined }))}
          />
        </div>

        {/* Filter by category */}
        <div className="space-y-2">
          <Label htmlFor="filter-category">Filter by category</Label>
          <Select
            value={localFilters.category || 'all'}
            onValueChange={(value) => 
              setLocalFilters(prev => ({ 
                ...prev, 
                category: value === 'all' ? undefined : value as Sweet['category']
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="Chocolate">Chocolate</SelectItem>
              <SelectItem value="Cakes">Cakes</SelectItem>
              <SelectItem value="Candies">Candies</SelectItem>
              <SelectItem value="Ice Cream">Ice Cream</SelectItem>
              <SelectItem value="Snacks">Snacks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price range */}
        <div className="space-y-2">
          <Label>Price range</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Min ($)"
              type="number"
              step="0.01"
              min="0"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            />
            <Input
              placeholder="Max ($)"
              type="number"
              step="0.01"
              min="0"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button onClick={handleSearch} variant="default" className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          {hasActiveFilters && (
            <Button onClick={handleClearFilters} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Sort options */}
        <div className="border-t pt-4">
          <Label className="text-sm font-medium mb-3 block">Sort by</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('name')}
              className={state.sortField === 'name' ? 'bg-primary/10 border-primary' : ''}
            >
              Name {getSortIcon('name')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('price')}
              className={state.sortField === 'price' ? 'bg-primary/10 border-primary' : ''}
            >
              Price {getSortIcon('price')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('category')}
              className={state.sortField === 'category' ? 'bg-primary/10 border-primary' : ''}
            >
              Category {getSortIcon('category')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('in_stock')}
              className={state.sortField === 'in_stock' ? 'bg-primary/10 border-primary' : ''}
            >
              Stock {getSortIcon('in_stock')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};