import { Sweet } from '../types/sweet';

export const createSampleSweets = (): Omit<Sweet, 'id'>[] => [
  {
    name: 'Dark Chocolate Bar',
    category: 'chocolate',
    price: 3.99,
    quantity: 15
  },
  {
    name: 'Milk Chocolate Truffles',
    category: 'chocolate',
    price: 12.99,
    quantity: 8
  },
  {
    name: 'Gummy Bears',
    category: 'candy',
    price: 2.49,
    quantity: 25
  },
  {
    name: 'Rainbow Lollipops',
    category: 'candy',
    price: 1.99,
    quantity: 30
  },
  {
    name: 'Sour Gummy Worms',
    category: 'candy',
    price: 3.49,
    quantity: 0  // Out of stock
  },
  {
    name: 'French Macarons',
    category: 'pastry',
    price: 15.99,
    quantity: 5  // Low stock
  },
  {
    name: 'Chocolate Croissant',
    category: 'pastry',
    price: 4.50,
    quantity: 12
  },
  {
    name: 'Strawberry Danish',
    category: 'pastry',
    price: 3.75,
    quantity: 8
  },
  {
    name: 'White Chocolate Chips',
    category: 'chocolate',
    price: 5.99,
    quantity: 20
  },
  {
    name: 'Hard Candy Mix',
    category: 'candy',
    price: 4.99,
    quantity: 3  // Low stock
  }
];

export const loadSampleData = (sweetShopService: any) => {
  const sampleSweets = createSampleSweets();
  sampleSweets.forEach(sweet => {
    sweetShopService.addSweet(sweet);
  });
};