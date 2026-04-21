import { supabase } from './supabase';
import { Product, Order, Customer, OrderStatus, CustomerDetails } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data';

const getLocalOrders = (): Order[] => {
  const saved = localStorage.getItem('salgados_monica_orders');
  return saved ? JSON.parse(saved) : [];
};

const saveLocalOrders = (orders: Order[]) => {
  localStorage.setItem('salgados_monica_orders', JSON.stringify(orders));
};

export const db = {
  init: async () => {
    // Inicialização local opcional
  },

  sync: async () => {
    // Sincronização local/remota se necessário
  },

  // PRODUCTS
  getProducts: async (): Promise<Product[]> => {
    if (!supabase) return DEFAULT_PRODUCTS;
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error || !data || data.length === 0) return DEFAULT_PRODUCTS;
      return data;
    } catch (e) {
      console.warn('Erro ao buscar produtos do Supabase, usando local:', e);
      return DEFAULT_PRODUCTS;
    }
  },
  
  updateProduct: async (id: string, updates: Partial<Product>) => {
    if (!supabase) {
      console.warn('Supabase não configurado. Alteração ignorada localmente.');
      return;
    }
    await supabase.from('products').update(updates).eq('id', id);
    window.dispatchEvent(new Event('db-updated'));
  },

  addProduct: async (product: Omit<Product, 'id'>) => {
    if (!supabase) {
      console.warn('Supabase não configurado. Adição ignorada localmente.');
      return;
    }
    await supabase.from('products').insert([product]);
    window.dispatchEvent(new Event('db-updated'));
  },

  deleteProduct: async (id: string) => {
    if (!supabase) {
      console.warn('Supabase não configurado. Deleção ignorada localmente.');
      return;
    }
    await supabase.from('products').delete().eq('id', id);
    window.dispatchEvent(new Event('db-updated'));
  },

  // ORDERS
  getOrders: async (): Promise<Order[]> => {
    if (!supabase) return getLocalOrders();
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    return data || getLocalOrders();
  },

  addOrder: async (order: Omit<Order, 'id' | 'dateCreated' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      dateCreated: new Date().toISOString(),
      status: 'pending'
    };

    if (!supabase) {
      const orders = getLocalOrders();
      orders.push(newOrder);
      saveLocalOrders(orders);
      window.dispatchEvent(new Event('db-updated'));
      return newOrder;
    }

    try {
      // 1. Salva o pedido
      const { data, error } = await supabase.from('orders').insert([{
        customer: order.customer,
        items: order.items,
        subtotal: order.subtotal,
        status: 'pending'
      }]).select();
      
      if (error) throw error;

      // 2. Atualiza/Cria Perfil do Cliente
      const customerInfo = {
        phone: order.customer.phone.replace(/\D/g, ''),
        name: order.customer.name,
        address: order.customer.address,
        neighborhood: order.customer.neighborhood,
        reference: order.customer.reference,
        lastOrderDate: new Date().toISOString(),
      };

      await supabase.from('customers').upsert([customerInfo], { onConflict: 'phone' });

      window.dispatchEvent(new Event('db-updated'));
      return data ? data[0] : newOrder;
    } catch (error) {
      console.error('Erro ao salvar pedido no Supabase, salvando local:', error);
      const orders = getLocalOrders();
      orders.push(newOrder);
      saveLocalOrders(orders);
      window.dispatchEvent(new Event('db-updated'));
      return newOrder;
    }
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    if (!supabase) {
      const orders = getLocalOrders();
      const updated = orders.map(o => o.id === id ? { ...o, status } : o);
      saveLocalOrders(updated);
      window.dispatchEvent(new Event('db-updated'));
      return;
    }
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) {
      console.error('Erro ao atualizar status:', error);
      alert(`Falha ao atualizar status: ${error.message}`);
    }
    window.dispatchEvent(new Event('db-updated'));
  },

  deleteOrder: async (id: string) => {
    if (!supabase) {
      const orders = getLocalOrders();
      saveLocalOrders(orders.filter(o => o.id !== id));
      window.dispatchEvent(new Event('db-updated'));
      return;
    }
    await supabase.from('orders').delete().eq('id', id);
    window.dispatchEvent(new Event('db-updated'));
  },

  getPendingOrderByPhone: async (phone: string): Promise<Order | null> => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!supabase) {
      return getLocalOrders().find(o => o.customer.phone.replace(/\D/g, '') === cleanPhone && o.status === 'pending') || null;
    }
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .filter('customer->>phone', 'eq', cleanPhone)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error || !data || data.length === 0) {
        return getLocalOrders().find(o => o.customer.phone.replace(/\D/g, '') === cleanPhone && o.status === 'pending') || null;
      }
      return data[0];
    } catch (e) {
      console.warn('Erro na busca Supabase, buscando local:', e);
      return getLocalOrders().find(o => o.customer.phone.replace(/\D/g, '') === cleanPhone && o.status === 'pending') || null;
    }
  },

  updateOrderItems: async (id: string, items: any[], subtotal: number, customer: CustomerDetails) => {
    if (!supabase) {
      const orders = getLocalOrders();
      const updated = orders.map(o => o.id === id ? { ...o, items, subtotal, customer } : o);
      saveLocalOrders(updated);
      window.dispatchEvent(new Event('db-updated'));
      return;
    }
    await supabase.from('orders').update({ items, subtotal, customer }).eq('id', id);
    window.dispatchEvent(new Event('db-updated'));
  },

  // CUSTOMERS
  getCustomers: async (): Promise<Customer[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('customers').select('*').order('total_spent', { ascending: false });
    return data || [];
  },

  getCustomerByPhone: async (phone: string): Promise<Customer | null> => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!supabase) return null;
    
    // 1. Tenta buscar na tabela de clientes
    const { data } = await supabase.from('customers').select('*').eq('phone', cleanPhone).maybeSingle();
    if (data) return data;

    // 2. Se não encontrar, busca no último pedido como fallback
    const { data: orderData } = await supabase
      .from('orders')
      .select('customer, created_at')
      .filter('customer->>phone', 'eq', cleanPhone)
      .order('created_at', { ascending: false })
      .limit(1);

    if (orderData && orderData.length > 0) {
      const c = orderData[0].customer;
      return {
        phone: cleanPhone,
        name: c.name,
        address: c.address + (c.number ? `, Num: ${c.number}` : ''),
        neighborhood: c.neighborhood,
        reference: c.reference,
        lastOrderDate: orderData[0].created_at,
        total_orders: 1,
        total_spent: 0
      };
    }

    return null;
  },

  deleteCustomer: async (phone: string) => {
    if (!supabase) return;
    await supabase.from('customers').delete().eq('phone', phone);
    window.dispatchEvent(new Event('db-updated'));
  },
  
  updateCustomer: async (phone: string, updates: Partial<Customer>) => {
    if (!supabase) return;
    await supabase.from('customers').update(updates).eq('phone', phone);
    window.dispatchEvent(new Event('db-updated'));
  }
};

