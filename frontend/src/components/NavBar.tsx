import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SearchFilters, SortField, SortOrder, Sweet } from '../types/sweet';
import { useSweetShop } from '../contexts/SweetShopContext';
import { Search, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Candy } from 'lucide-react';

export const NavBar: React.FC = () => {
  const { state, actions } = useSweetShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState<SearchFilters>({});
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleSearch = () => {
    const filters: SearchFilters = {
      ...localFilters,
      name: searchTerm || undefined,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    };
    actions.searchSweets(filters);
  };

  // Real-time search as user types
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const filters: SearchFilters = {
      ...localFilters,
      name: value || undefined,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    };
    actions.searchSweets(filters);
  };

  // Real-time category filter
  const handleCategoryChange = (category: Sweet['category'] | undefined) => {
    const newFilters = { ...localFilters, category };
    setLocalFilters(newFilters);
    const filters: SearchFilters = {
      ...newFilters,
      name: searchTerm || undefined,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    };
    actions.searchSweets(filters);
  };

  // Real-time price range filter
  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const newPriceRange = { ...priceRange, [field]: value };
    setPriceRange(newPriceRange);
    const filters: SearchFilters = {
      ...localFilters,
      name: searchTerm || undefined,
      minPrice: newPriceRange.min ? parseFloat(newPriceRange.min) : undefined,
      maxPrice: newPriceRange.max ? parseFloat(newPriceRange.max) : undefined,
    };
    actions.searchSweets(filters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocalFilters({});
    setPriceRange({ min: '', max: '' });
    actions.clearFilters();
  };

  const handleClearSearch = () => {
    handleSearchChange('');
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
    searchTerm || 
    localFilters.category || 
    priceRange.min || 
    priceRange.max;

  const activeFilterCount = [
    searchTerm,
    localFilters.category,
    priceRange.min,
    priceRange.max
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        {/* Main Nav Bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="p-2 rounded-full bg-primary text-primary-foreground">
              <Candy className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sweet Shop
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sweets by name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`pl-10 pr-10 ${searchTerm ? 'border-primary' : ''}`}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={hasActiveFilters ? "default" : "outline"} 
                className="flex items-center gap-2 flex-shrink-0"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4" align="end">
              <DropdownMenuLabel>Filter & Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="space-y-4">
                {/* Category Filter */}
                {state.categories.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={!localFilters.category ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategoryChange(undefined)}
                      >
                        All
                      </Button>
                      {state.categories.map((category) => (
                        <Button
                          key={category}
                          variant={localFilters.category === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCategoryChange(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min ($)"
                      type="number"
                      step="0.01"
                      min="0"
                      value={priceRange.min}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    />
                    <Input
                      placeholder="Max ($)"
                      type="number"
                      step="0.01"
                      min="0"
                      value={priceRange.max}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    />
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort by</label>
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

                <DropdownMenuSeparator />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button onClick={handleSearch} className="flex-1">
                    Apply Filters
                  </Button>
                  {hasActiveFilters && (
                    <Button onClick={handleClearFilters} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};