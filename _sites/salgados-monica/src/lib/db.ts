import { supabase } from './supabase';
import { Product, Order, Customer, OrderStatus, CustomerDetails } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data';

// O Supabase será nosso banco de dados real para o Vercel
export const db = {
  init: async () => {
    // No Supabase a inicialização é automática via cliente
  },

  sync: async () => {
    // Sincronização automática via Supabase
  },

  // PRODUCTS
  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data || data.length === 0) return DEFAULT_PRODUCTS;
    return data;
  },
  
  updateProduct: async (id: string, updates: Partial<Product>) => {
    await supabase.from('products').update(updates).eq('id', id);
    window.dispatchEvent(new Event('db-updated'));
  },

  addProduct: async (product: Omit<Product, 'id'>) => {
    await supabase.from('products').insert([product]);
    window.dispatchEvent(new Event('db-updated'));
  },

  deleteProduct: async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    window.dispatchEvent(new Event('db-updated'));
  },

  // ORDERS
  getOrders: async (): Promise<Order[]> => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  addOrder: async (order: Omit<Order, 'id' | 'dateCreated' | 'status'>) => {
    const { data, error } = await supabase.from('orders').insert([{
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      status: 'pending'
    }]).select();
    
    window.dispatchEvent(new Event('db-updated'));
    return data ? data[0] : null;
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    window.dispatchEvent(new Event('db-updated'));
  },

  deleteOrder: async (id: string) => {
    await supabase.from('orders').delete().eq('id', id);
    window.dispatchEvent(new Event('db-updated'));
  },

  getPendingOrderByPhone: async (phone: string): Promise<Order | null> => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('customer->phone', phone)
      .eq('status', 'pending')
      .single();
    return data;
  },

  updateOrderItems: async (id: string, items: any[], subtotal: number, customer: CustomerDetails) => {
    await supabase.from('orders').update({ items, subtotal, customer }).eq('id', id);
    window.dispatchEvent(new Event('db-updated'));
  },

  // CUSTOMERS
  getCustomers: async (): Promise<Customer[]> => {
    const { data } = await supabase.from('customers').select('*').order('totalSpent', { ascending: false });
    return data || [];
  },

  getCustomerByPhone: async (phone: string): Promise<Customer | null> => {
    const { data } = await supabase.from('customers').select('*').eq('phone', phone).single();
    return data;
  },

  deleteCustomer: async (phone: string) => {
    await supabase.from('customers').delete().eq('phone', phone);
    window.dispatchEvent(new Event('db-updated'));
  }
};
