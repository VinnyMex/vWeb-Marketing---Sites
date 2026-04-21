export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  phone: string;
  name: string;
  address: string;
  neighborhood: string;
  reference: string;
  date: string;
  time: string;
  observations?: string;
}

export type OrderStatus = 'pending' | 'scheduled' | 'processing' | 'separated' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  dateCreated: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  status: OrderStatus;
}

export interface Customer {
  phone: string;
  name: string;
  address: string;
  neighborhood: string;
  reference: string;
  lastOrderDate: string;
  total_orders: number;
  total_spent: number;
}
