import { Product, Order, Customer, CustomerDetails, OrderStatus } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data';

const API_URL = 'http://localhost:3011/api';

let dbCache: {
  products: Product[];
  orders: Order[];
  customers: Customer[];
} = {
  products: [],
  orders: [],
  customers: []
};

export const db = {
  init: async () => {
    try {
      const response = await fetch(`${API_URL}/db`);
      const data = await response.json();
      dbCache = data;
      if (dbCache.products.length === 0) {
        dbCache.products = DEFAULT_PRODUCTS;
        await db.sync();
      }
    } catch (e) { console.error('DB Init Error', e); }
  },

  sync: async () => {
    try {
      await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbCache)
      });
      window.dispatchEvent(new Event('db-updated'));
    } catch (e) { console.error('Sync Error', e); }
  },

  // PRODUCTS
  getProducts: () => dbCache.products,
  updateProduct: async (id: string, updates: Partial<Product>) => {
    dbCache.products = dbCache.products.map(p => p.id === id ? { ...p, ...updates } : p);
    await db.sync();
    return dbCache.products;
  },
  addProduct: async (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    dbCache.products = [...dbCache.products, newProduct as Product];
    await db.sync();
    return dbCache.products;
  },
  deleteProduct: async (id: string) => {
    dbCache.products = dbCache.products.filter(p => p.id !== id);
    await db.sync();
    return dbCache.products;
  },

  // ORDERS
  getOrders: () => dbCache.orders,
  addOrder: async (order: Omit<Order, 'id' | 'dateCreated' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: `PED-${Date.now()}`,
      dateCreated: new Date().toISOString(),
      status: 'pending'
    };
    dbCache.orders.push(newOrder);
    
    // Atualizar dados do cliente
    const details = order.customer;
    const existingIndex = dbCache.customers.findIndex(c => c.phone === details.phone);
    if (existingIndex > -1) {
      dbCache.customers[existingIndex] = {
        ...dbCache.customers[existingIndex],
        name: details.name,
        address: details.address,
        neighborhood: details.neighborhood,
        reference: details.reference,
        lastOrderDate: newOrder.dateCreated,
        totalOrders: dbCache.customers[existingIndex].totalOrders + 1,
        totalSpent: dbCache.customers[existingIndex].totalSpent + order.subtotal
      };
    } else {
      dbCache.customers.push({
        phone: details.phone,
        name: details.name,
        address: details.address,
        neighborhood: details.neighborhood,
        reference: details.reference,
        lastOrderDate: newOrder.dateCreated,
        totalOrders: 1,
        totalSpent: order.subtotal
      });
    }

    await db.sync();
    return newOrder;
  },
  updateOrderStatus: async (id: string, status: OrderStatus) => {
    dbCache.orders = dbCache.orders.map(o => o.id === id ? { ...o, status } : o);
    await db.sync();
  },
  deleteOrder: async (id: string) => {
    dbCache.orders = dbCache.orders.filter(o => o.id !== id);
    await db.sync();
  },
  getPendingOrderByPhone: (phone: string) => {
    return dbCache.orders.find(o => o.customer.phone === phone && o.status === 'pending');
  },
  updateOrderItems: async (id: string, items: any[], subtotal: number, customer: CustomerDetails) => {
    dbCache.orders = dbCache.orders.map(o => 
      o.id === id ? { ...o, items, subtotal, customer, dateCreated: new Date().toISOString() } : o
    );
    await db.sync();
  },

  // CUSTOMERS
  getCustomers: () => dbCache.customers,
  getCustomerByPhone: (phone: string) => dbCache.customers.find(c => c.phone === phone),
  deleteCustomer: async (phone: string) => {
    dbCache.customers = dbCache.customers.filter(c => c.phone !== phone);
    await db.sync();
  }
};

db.init();
