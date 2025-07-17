import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sweet } from '../types/sweet';
import { useSweetShop } from '../contexts/SweetShopContext';
import { useToast } from '../hooks/use-toast';
import { ShoppingCart, Package, Edit, Trash2 } from 'lucide-react';

interface SweetCardProps {
  sweet: Sweet;
  onEdit?: (sweet: Sweet) => void;
}

export const SweetCard: React.FC<SweetCardProps> = ({ sweet, onEdit }) => {
  const { actions } = useSweetShop();
  const { toast } = useToast();
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Ensure sweet data is valid
  if (!sweet || typeof sweet.id !== 'number' || typeof sweet.price !== 'number' || typeof sweet.in_stock !== 'number') {
    console.error('Invalid sweet data:', sweet);
    return (
      <Card className="relative transition-all duration-200 hover:shadow-lg opacity-60">
        <CardContent className="p-4">
          <p className="text-destructive">Invalid sweet data</p>
        </CardContent>
      </Card>
    );
  }

  const getCategoryVariant = (category: string) => {
    switch (category.toLowerCase()) {
      case 'chocolate':
        return 'chocolate';
      case 'cakes':
      case 'cakes & pastries':
        return 'pastry';
      case 'candies':
      case 'candies & gummies':
        return 'candy';
      case 'ice cream':
      case 'ice cream & frozen':
        return 'default';
      case 'snacks':
      case 'snacks & treats':
        return 'default';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'chocolate':
        return 'bg-chocolate text-white';
      case 'cakes':
      case 'cakes & pastries':
        return 'bg-pastry text-foreground';
      case 'candies':
      case 'candies & gummies':
        return 'bg-candy text-white';
      case 'ice cream':
      case 'ice cream & frozen':
        return 'bg-blue-100 text-blue-800';
      case 'snacks':
      case 'snacks & treats':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handlePurchase = () => {
    try {
      actions.purchaseSweets({
        sweetId: sweet.id.toString(),
        quantity: purchaseQuantity
      });
      toast({
        title: "Purchase Successful",
        description: `Purchased ${purchaseQuantity} ${sweet.name}(s)`,
      });
      setPurchaseQuantity(1);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleRestock = () => {
    try {
      actions.restockSweet(sweet.id.toString(), restockQuantity);
      toast({
        title: "Restock Successful",
        description: `Added ${restockQuantity} ${sweet.name}(s) to inventory`,
      });
      setRestockQuantity(1);
    } catch (error) {
      toast({
        title: "Restock Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    actions.deleteSweet(sweet.id.toString());
    toast({
      title: "Sweet Deleted",
      description: `${sweet.name} has been removed from inventory`,
    });
    setIsDeleteDialogOpen(false);
  };

  const isOutOfStock = sweet.in_stock === 0;
  const isLowStock = sweet.in_stock <= 5 && sweet.in_stock > 0;

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${isOutOfStock ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{sweet.name}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit && onEdit(sweet)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Sweet</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete "{sweet.name}" from your inventory?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className={`w-fit ${getCategoryColor(sweet.category)}`}
        >
          {sweet.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">₹{sweet.price.toFixed(2)}</span>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className={`font-medium ${isOutOfStock ? 'text-destructive' : isLowStock ? 'text-warning' : 'text-success'}`}>
                {sweet.in_stock}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">in stock</span>
          </div>
        </div>

        {isOutOfStock && (
          <Badge variant="outline" className="w-full justify-center text-destructive border-destructive">
            Out of Stock
          </Badge>
        )}

        {isLowStock && (
          <Badge variant="outline" className="w-full justify-center text-warning border-warning">
            Low Stock
          </Badge>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3">
        {/* Purchase Section */}
        <div className="flex gap-2 w-full">
          <div className="flex-1">
            <Label htmlFor={`purchase-${sweet.id}`} className="text-xs">Quantity</Label>
            <Input
              id={`purchase-${sweet.id}`}
              type="number"
              min="1"
              max={sweet.in_stock}
              value={purchaseQuantity}
              onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
              className="h-8"
              disabled={isOutOfStock}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant={getCategoryVariant(sweet.category) as any}
              size="sm"
              onClick={handlePurchase}
              disabled={isOutOfStock || purchaseQuantity > sweet.in_stock}
              className="h-8"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Buy
            </Button>
          </div>
        </div>

        {/* Restock Section */}
        <div className="flex gap-2 w-full">
          <div className="flex-1">
            <Label htmlFor={`restock-${sweet.id}`} className="text-xs">Restock</Label>
            <Input
              id={`restock-${sweet.id}`}
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 1)}
              className="h-8"
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestock}
              className="h-8"
            >
              <Package className="h-3 w-3 mr-1" />
              Restock
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};