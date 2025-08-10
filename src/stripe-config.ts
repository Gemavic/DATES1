export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'starter',
    priceId: 'price_starter_pack_2025',
    name: 'Starter Pack',
    description: '50 Credits + 10 Bonus',
    mode: 'payment'
  },
  {
    id: 'popular',
    priceId: 'price_popular_pack_2025',
    name: 'Popular Pack', 
    description: '150 Credits + 50 Bonus',
    mode: 'payment'
  },
  {
    id: 'premium',
    priceId: 'price_premium_pack_2025',
    name: 'Premium Pack',
    description: '300 Credits + 100 Bonus',
    mode: 'payment'
  },
  {
    id: 'ultimate',
    priceId: 'price_ultimate_combo_2025',
    name: 'Ultimate Combo',
    description: '500 Credits + 200 Bonus + 50 Kobos',
    mode: 'payment'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};