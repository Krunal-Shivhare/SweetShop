import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { SweetShop } from '../SweetShop';
import { SweetShopProvider } from '../../contexts/SweetShopContext';

// Test wrapper component
const SweetShopWithProvider = () => (
  <SweetShopProvider>
    <SweetShop />
  </SweetShopProvider>
);

describe('SweetShop Integration', () => {
  beforeEach(() => {
    // Reset any state between tests
  });

  it('should render the Sweet Shop interface', () => {
    render(<SweetShopWithProvider />);
    
    expect(screen.getByText('Management Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage your sweet inventory with ease')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /inventory/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /add sweet/i })).toBeInTheDocument();
  });

  it('should display empty state when no sweets exist', () => {
    render(<SweetShopWithProvider />);
    
    expect(screen.getByText('No sweets in inventory')).toBeInTheDocument();
    expect(screen.getByText('Start by adding some delicious sweets to your shop!')).toBeInTheDocument();
  });

  it('should allow adding a new sweet', async () => {
    const user = userEvent.setup();
    render(<SweetShopWithProvider />);
    
    // Click the Add New Sweet button
    const addButton = screen.getByRole('button', { name: /add new sweet/i });
    await user.click(addButton);

    // Fill in the form
    await user.type(screen.getByLabelText(/name/i), 'Test Chocolate');
    await user.selectOptions(screen.getByLabelText(/category/i), 'chocolate');
    await user.type(screen.getByLabelText(/price/i), '2.99');
    await user.type(screen.getByLabelText(/quantity/i), '10');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add sweet/i });
    await user.click(submitButton);

    // Check that the sweet was added (this might need adjustment based on actual implementation)
    await waitFor(() => {
      expect(screen.queryByText('No sweets in inventory')).not.toBeInTheDocument();
    });
  });

  it('should switch between tabs correctly', async () => {
    const user = userEvent.setup();
    render(<SweetShopWithProvider />);
    
    // Click on Add Sweet tab
    const addTab = screen.getByRole('tab', { name: /add sweet/i });
    await user.click(addTab);

    expect(screen.getByText('Add New Sweet')).toBeInTheDocument();
  });

  it('should display search and filter interface', () => {
    render(<SweetShopWithProvider />);
    
    expect(screen.getByText('Search & Filter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter sweet name...')).toBeInTheDocument();
    expect(screen.getByText('Filter by category')).toBeInTheDocument();
    expect(screen.getByText('Price range')).toBeInTheDocument();
  });
});