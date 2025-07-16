import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSweetShop } from '../contexts/SweetShopContext';
import { Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

export const InventoryStats: React.FC = () => {
  const { state } = useSweetShop();

  const stats = React.useMemo(() => {
    const totalItems = state.sweets.reduce((sum, sweet) => sum + sweet.in_stock, 0);
    const totalValue = state.sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.in_stock), 0);
    const outOfStock = state.sweets.filter(sweet => sweet.in_stock === 0).length;
    const lowStock = state.sweets.filter(sweet => sweet.in_stock > 0 && sweet.in_stock <= 5).length;
    
    const categoryStats = {
      Chocolate: state.sweets.filter(s => s.category === 'Chocolate').length,
      Cakes: state.sweets.filter(s => s.category === 'Cakes').length,
      Candies: state.sweets.filter(s => s.category === 'Candies').length,
      'Ice Cream': state.sweets.filter(s => s.category === 'Ice Cream').length,
      Snacks: state.sweets.filter(s => s.category === 'Snacks').length,
    };

    const averagePrice = state.sweets.length > 0 
      ? state.sweets.reduce((sum, sweet) => sum + sweet.price, 0) / state.sweets.length 
      : 0;

    return {
      totalSweets: state.sweets.length,
      totalItems,
      totalValue,
      outOfStock,
      lowStock,
      categoryStats,
      averagePrice,
    };
  }, [state.sweets]);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalSweets,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Inventory Value",
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Stock Alerts",
      value: stats.outOfStock + stats.lowStock,
      icon: AlertTriangle,
      color: stats.outOfStock > 0 ? "text-destructive" : stats.lowStock > 0 ? "text-warning" : "text-success",
      bgColor: stats.outOfStock > 0 ? "bg-destructive/10" : stats.lowStock > 0 ? "bg-warning/10" : "bg-success/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chocolate"></div>
                Chocolate
              </span>
              <Badge variant="outline">{stats.categoryStats.Chocolate}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pastry"></div>
                Cakes
              </span>
              <Badge variant="outline">{stats.categoryStats.Cakes}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-candy"></div>
                Candies
              </span>
              <Badge variant="outline">{stats.categoryStats.Candies}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                Ice Cream
              </span>
              <Badge variant="outline">{stats.categoryStats['Ice Cream']}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                Snacks
              </span>
              <Badge variant="outline">{stats.categoryStats.Snacks}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stock Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stock Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Out of Stock</span>
              <Badge variant={stats.outOfStock > 0 ? "destructive" : "outline"}>
                {stats.outOfStock}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Low Stock (≤5)</span>
              <Badge variant={stats.lowStock > 0 ? "secondary" : "outline"} className="bg-warning/20 text-warning border-warning">
                {stats.lowStock}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>In Stock</span>
              <Badge variant="outline" className="bg-success/20 text-success border-success">
                {stats.totalSweets - stats.outOfStock}
              </Badge>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Average Price</span>
                <span className="font-bold text-primary">${stats.averagePrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};