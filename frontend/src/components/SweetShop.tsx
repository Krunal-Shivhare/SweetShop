import React, { useState } from 'react';
import { SweetCard } from './SweetCard';
import { AddSweetForm } from './AddSweetForm';
import { NavBar } from './NavBar';

import { ErrorBoundary } from './ErrorBoundary';
import { useSweetShop } from '../contexts/SweetShopContext';
import { Sweet } from '../types/sweet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Candy, Package, AlertCircle } from 'lucide-react';

export const SweetShop: React.FC = () => {
  const { state, actions } = useSweetShop();
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [activeTab, setActiveTab] = useState('inventory');

  const handleEditSweet = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setActiveTab('add');
  };

  const handleEditComplete = () => {
    setEditingSweet(null);
    setActiveTab('inventory');
  };

  const filteredSweets = state.sweets;
  const hasSweets = filteredSweets.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/20 to-accent/10">
      {/* Navigation Bar */}
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Management Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your sweet inventory with ease. Add, search, purchase, and restock your delicious treats.
          </p>
        </div>

        {/* Error Display */}
        {state.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {state.error}
              <button 
                onClick={actions.clearError} 
                className="ml-2 underline hover:no-underline"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {state.isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading...</span>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-fit lg:grid-cols-2 mx-auto">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Candy className="h-4 w-4" />
              {editingSweet ? 'Edit Sweet' : 'Add Sweet'}
            </TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            {/* Sweet Cards Grid */}
            <div className="w-full">
                {!hasSweets && !state.isLoading && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No sweets in inventory</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding some delicious sweets to your shop!
                    </p>
                    <AddSweetForm />
                  </div>
                )}

              {hasSweets && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSweets.map((sweet) => (
                    <ErrorBoundary key={sweet.id}>
                      <SweetCard
                        sweet={sweet}
                        onEdit={handleEditSweet}
                      />
                    </ErrorBoundary>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Add/Edit Sweet Tab */}
          <TabsContent value="add" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              {editingSweet ? (
                <AddSweetForm 
                  editSweet={editingSweet} 
                  onEditComplete={handleEditComplete}
                />
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-candy/20 flex items-center justify-center">
                    <Candy className="h-8 w-8 text-candy" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Add New Sweet</h2>
                    <p className="text-muted-foreground mb-6">
                      Fill in the details below to add a new sweet to your inventory.
                    </p>
                  </div>
                  <AddSweetForm />
                </div>
              )}
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
};