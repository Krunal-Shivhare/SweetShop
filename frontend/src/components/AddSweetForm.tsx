import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sweet } from '../types/sweet';
import { useSweetShop } from '../contexts/SweetShopContext';
import { useToast } from '../hooks/use-toast';
import { Plus, Edit } from 'lucide-react';

interface AddSweetFormProps {
  editSweet?: Sweet | null;
  onEditComplete?: () => void;
}

export const AddSweetForm: React.FC<AddSweetFormProps> = ({ editSweet, onEditComplete }) => {
  const { state, actions } = useSweetShop();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: editSweet?.name || '',
    category: editSweet?.category || '',
    price: editSweet?.price || 0,
    in_stock: editSweet?.in_stock || 0,
  });

  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (typeof formData.price !== 'number' || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (typeof formData.in_stock !== 'number' || formData.in_stock < 0) {
      newErrors.in_stock = 'Stock must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editSweet) {
        actions.updateSweet(editSweet.id.toString(), formData);
        toast({
          title: "Sweet Updated",
          description: `${formData.name} has been updated successfully`,
        });
        onEditComplete?.();
      } else {
        actions.addSweet(formData);
        toast({
          title: "Sweet Added",
          description: `${formData.name} has been added to your inventory`,
        });
      }

      // Reset form
      setFormData({
        name: '',
        category: '',
        price: 0,
        in_stock: 0,
      });
      setCustomCategory('');
      setShowCustomCategory(false);
      setErrors({});
      setIsOpen(false);
    } catch (error) {
      toast({
        title: editSweet ? "Update Failed" : "Add Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  // If editing, don't show as dialog
  if (editSweet && !isOpen) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Sweet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter sweet name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <span className="text-sm text-destructive">{errors.name}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              {state.categories.length > 0 ? (
                <>
                  <Select
                    value={showCustomCategory ? 'Other' : formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomCategory && (
                    <div className="space-y-2">
                      <Label htmlFor="edit-custom-category">Category Name</Label>
                      <Input
                        id="edit-custom-category"
                        value={customCategory}
                        onChange={(e) => {
                          setCustomCategory(e.target.value);
                          setFormData(prev => ({ ...prev, category: e.target.value }));
                        }}
                        placeholder="Enter category name"
                      />
                    </div>
                  )}
                </>
              ) : (
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Enter category name"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && <span className="text-sm text-destructive">{errors.price}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-in_stock">Stock</Label>
              <Input
                id="edit-in_stock"
                type="number"
                min="0"
                value={formData.in_stock}
                onChange={(e) => handleInputChange('in_stock', parseInt(e.target.value) || 0)}
                placeholder="0"
                className={errors.in_stock ? 'border-destructive' : ''}
              />
              {errors.in_stock && <span className="text-sm text-destructive">{errors.in_stock}</span>}
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="success" className="flex-1">
                Update Sweet
              </Button>
              <Button type="button" variant="outline" onClick={onEditComplete}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="candy" size="lg" className="shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add New Sweet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Sweet
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter sweet name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <span className="text-sm text-destructive">{errors.name}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {state.categories.length > 0 ? (
              <>
                <Select
                  value={showCustomCategory ? 'Other' : formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {showCustomCategory && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-category">Category Name</Label>
                    <Input
                      id="custom-category"
                      value={customCategory}
                      onChange={(e) => {
                        setCustomCategory(e.target.value);
                        setFormData(prev => ({ ...prev, category: e.target.value }));
                      }}
                      placeholder="Enter category name"
                    />
                  </div>
                )}
              </>
            ) : (
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Enter category name"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={errors.price ? 'border-destructive' : ''}
            />
            {errors.price && <span className="text-sm text-destructive">{errors.price}</span>}
          </div>

                      <div className="space-y-2">
              <Label htmlFor="in_stock">Stock</Label>
              <Input
                id="in_stock"
                type="number"
                min="0"
                value={formData.in_stock}
                onChange={(e) => handleInputChange('in_stock', parseInt(e.target.value) || 0)}
                placeholder="0"
                className={errors.in_stock ? 'border-destructive' : ''}
              />
              {errors.in_stock && <span className="text-sm text-destructive">{errors.in_stock}</span>}
            </div>

          <Button type="submit" variant="candy" className="w-full">
            Add Sweet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};