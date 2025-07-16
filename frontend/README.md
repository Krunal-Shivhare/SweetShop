# Sweet Shop Management System

A comprehensive sweet shop inventory management system built with React, TypeScript, and TDD principles. This application allows you to manage your sweet inventory with features for adding, searching, purchasing, and restocking sweets.

## 🍭 Features

### Core Operations
- **Add Sweets**: Add new sweets with unique IDs, names, categories, prices, and quantities
- **Delete Sweets**: Remove sweets from inventory
- **View Sweets**: Display all available sweets in a beautiful card layout
- **Update Sweets**: Edit sweet details in-place

### Search & Sort
- **Search by Name**: Find sweets by name (case-insensitive)
- **Filter by Category**: Filter sweets by chocolate, candy, or pastry
- **Price Range Filter**: Find sweets within specific price ranges
- **Multi-field Sorting**: Sort by name, price, category, or stock quantity

### Inventory Management
- **Purchase Sweets**: Buy sweets and automatically decrease stock
- **Stock Validation**: Prevents purchases when insufficient stock available
- **Restock Sweets**: Increase quantity of existing sweets
- **Stock Alerts**: Visual indicators for out-of-stock and low-stock items



## 🎨 Design Features

### Beautiful UI
- **Sweet Shop Theme**: Warm, inviting colors with candy-inspired design
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Cards**: Hover effects and smooth transitions
- **Category Color Coding**: Visual distinction between chocolate, candy, and pastry

### User Experience
- **Toast Notifications**: Success and error feedback
- **Loading States**: Smooth loading indicators
- **Form Validation**: Real-time validation with helpful error messages
- **Empty States**: Helpful guidance when no data is present

## 🧪 Test-Driven Development

This project follows TDD principles with comprehensive test coverage:

### Test Structure
- **Unit Tests**: Service layer business logic
- **Integration Tests**: Component interactions
- **Search & Sort Tests**: Complex filtering and sorting logic
- **Inventory Tests**: Purchase and restock operations

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweet-shop-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Quick Start with Sample Data

1. Open the application
2. Click "Load Sample Data" to populate with example sweets
3. Explore features like search, filter, purchase, and restock

## 📱 How to Use

### Adding Sweets
1. Click "Add New Sweet" button
2. Fill in name, category, price, and quantity
3. Click "Add Sweet" to save

### Searching and Filtering
1. Use the search panel on the left
2. Enter name, select category, or set price range
3. Click "Search" to apply filters
4. Use sort buttons to order results

### Managing Inventory
1. **Purchase**: Set quantity and click "Buy" on any sweet card
2. **Restock**: Enter restock amount and click "Restock"
3. **Edit**: Click edit icon to modify sweet details
4. **Delete**: Click trash icon to remove from inventory



## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Context + useReducer
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite

### Project Structure
```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── SweetCard.tsx    # Sweet display card
│   ├── AddSweetForm.tsx # Add/edit sweet form
│   ├── SearchAndFilter.tsx # Search and filter panel

├── contexts/            # React context providers
├── services/            # Business logic layer
├── types/               # TypeScript definitions
├── hooks/               # Custom React hooks
└── utils/               # Utility functions
```

### Design System
- **Colors**: HSL-based color system with semantic tokens
- **Components**: Customized shadcn/ui components
- **Theming**: Consistent design tokens in CSS variables
- **Responsive**: Mobile-first responsive design

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Git Workflow
Following TDD principles with meaningful commit messages:

```bash
# Example TDD workflow
git add .
git commit -m "Add test for sweet addition feature"
git add .
git commit -m "Implement sweet addition functionality"
git add .
git commit -m "Add test for search by category"
git add .
git commit -m "Implement category search feature"
```

## 🧪 Testing Strategy

### Test Categories
1. **Service Tests**: Core business logic
2. **Component Tests**: UI component behavior
3. **Integration Tests**: End-to-end user workflows
4. **Edge Cases**: Error handling and validation

### Test Coverage Goals
- **Services**: 100% coverage of business logic
- **Components**: Key user interactions
- **Integration**: Critical user workflows

## 🚀 Deployment

This project can be deployed to any static hosting service:

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests first (TDD)
4. Implement the feature
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is for educational purposes as part of a coding kata exercise.

## 🎯 Future Enhancements

- **Persistence**: Local storage or database integration
- **User Authentication**: Multi-user support

- **Barcode Scanning**: Quick product addition
- **Print Reports**: Inventory and sales reports
- **API Integration**: External sweet databases

---

Built with ❤️ following Test-Driven Development principles.