import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/db';
import { Product, Order, Customer, OrderStatus, CustomerDetails } from '../types';
import { CATEGORIES, COMPANY_DATA } from '../data';
import { 
  X, LogOut, Package, Tag, 
  CheckCircle2, XCircle, Plus, Trash2,
  Upload, Users, Receipt, BarChart3, 
  Calendar, MapPin, Phone, DollarSign,
  TrendingUp, ShoppingBag, UserCheck, Check,
  Clock, ChevronRight, Edit3, MessageCircle,
  Truck, ClipboardList, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  onClose: () => void;
}

type Tab = 'agenda' | 'products' | 'customers' | 'stats';

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('agenda');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '', description: '', price: 0, category: CATEGORIES[0],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    available: true, unit: 'cento'
  });

  useEffect(() => {
    const fetchData = async () => {
       await db.init();
       const [p, o, c] = await Promise.all([
         db.getProducts(),
         db.getOrders(),
         db.getCustomers()
       ]);
       setProducts(p);
       setOrders(o);
       setCustomers(c.sort((a, b) => b.total_spent - a.total_spent));
    };
    fetchData();

    const handleDbUpdate = async () => {
       const [p, o, c] = await Promise.all([
         db.getProducts(),
         db.getOrders(),
         db.getCustomers()
       ]);
       setProducts(p);
       setOrders(o);
       setCustomers(c.sort((a, b) => b.total_spent - a.total_spent));
    };

    window.addEventListener('db-updated', handleDbUpdate);
    return () => window.removeEventListener('db-updated', handleDbUpdate);
  }, []);

  const statusMap: Record<string, { label: string, color: string, icon: any }> = {
    pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700', icon: Clock },
    scheduled: { label: 'Agendado', color: 'bg-blue-100 text-blue-700', icon: Calendar },
    processing: { label: 'Em Processo', color: 'bg-purple-100 text-purple-700', icon: ClipboardList },
    separated: { label: 'Separado', color: 'bg-orange-100 text-orange-700', icon: Filter },
    ready: { label: 'Pronto p/ Envio', color: 'bg-green-100 text-green-700', icon: Truck },
    completed: { label: 'Finalizado', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: XCircle }
  };

  const handleUpdateStatus = async (id: string, status: OrderStatus, customer: CustomerDetails) => {
    await db.updateOrderStatus(id, status);
    if (status === 'ready') {
      const msg = `Ola ${customer.name}! Seu pedido da Salgados Monica ja esta PRONTO PARA ENVIO! 🚀 Logo chegara ate voce.`;
      window.open(`https://wa.me/${customer.phone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    await db.updateProduct(id, updates);
    setSaveStatus(id);
    setTimeout(() => setSaveStatus(null), 1500);
  };

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Excluir este pedido permanentemente?')) {
      await db.deleteOrder(id);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.addProduct(newProduct);
    setIsAdding(false);
    setNewProduct({
      name: '', description: '', price: 0, category: CATEGORIES[0],
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      available: true, unit: 'cento'
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        if (id) await handleUpdateProduct(id, { image: base64 });
        else setNewProduct({ ...newProduct, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const agenda = useMemo(() => {
    const groups: Record<string, Order[]> = {};
    if (!orders) return groups;
    orders.forEach(o => {
      const date = o.customer.date || 'Sem Data';
      if (!groups[date]) groups[date] = [];
      groups[date].push(o);
    });
    return groups;
  }, [orders]);

  const stats = useMemo(() => {
    if (!orders) return { totalRevenue: 0, totalOrders: 0, activeCustomers: 0 };
    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.subtotal, 0);
    return { totalRevenue, totalOrders: orders.length, activeCustomers: customers.length };
  }, [orders, customers]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-stone-100 z-[100] flex flex-col font-sans">
      <header className="bg-white border-b-2 border-brand-accent px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10 gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">M</div>
          <div>
            <h2 className="font-black text-brand-dark tracking-tighter leading-none">Gestão Salgados Mônica</h2>
            <p className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em] mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Painel Ativo
            </p>
          </div>
        </div>

        <nav className="flex bg-stone-100 p-1.5 rounded-[1.5rem] border border-stone-200">
          {[
            { id: 'agenda', label: 'Agenda', icon: Calendar },
            { id: 'products', label: 'Cardápio', icon: Package },
            { id: 'customers', label: 'Clientes', icon: Users },
            { id: 'stats', label: 'Análise', icon: BarChart3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-brand-primary shadow-sm scale-105' : 'text-stone-500 hover:text-brand-primary opacity-60'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </nav>

        <button onClick={onClose} className="p-3 bg-stone-100 text-stone-600 rounded-2xl hover:bg-stone-200 font-bold transition-all shadow-sm"><X size={24} /></button>
      </header>

      <main className="flex-grow overflow-y-auto p-4 md:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'agenda' && (
          <div className="space-y-12">
            <h3 className="text-4xl font-black text-brand-dark tracking-tighter">Agenda de Produção</h3>
            {Object.entries(agenda).sort().map(([date, dateOrders]) => (
              <div key={date} className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="h-px flex-grow bg-brand-accent" />
                   <h4 className="bg-brand-primary text-white px-6 py-2 rounded-full font-black text-sm shadow-lg tracking-[0.2em]">{date}</h4>
                   <div className="h-px flex-grow bg-brand-accent" />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {dateOrders.map(order => {
                    const currentStatus = statusMap[order.status] || statusMap['pending'];
                    const Icon = currentStatus.icon;
                    return (
                      <div key={order.id} className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm relative overflow-hidden group">
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                          <div className="flex-grow space-y-6">
                            <div className="flex justify-between items-start">
                               <div>
                                  <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{order.id}</span>
                                  <h5 className="text-2xl font-black text-brand-dark tracking-tight">{order.customer.name}</h5>
                                  <p className="text-sm font-bold text-stone-400 mt-1">{order.customer.time} | {order.customer.neighborhood}</p>
                               </div>
                               <div className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${currentStatus.color}`}>
                                  <Icon size={12} />
                                  {currentStatus.label}
                               </div>
                            </div>
                            <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100">
                               <ul className="space-y-2 mb-4">
                                 {order.items.map((it, i) => (
                                   <li key={i} className="flex justify-between text-sm font-bold">
                                      <span>{it.quantity}x {it.product?.name || 'Produto Excluido'}</span>
                                      <span className="text-stone-400">R$ {((it.product?.unit === 'cento' ? it.product.price / 100 : it.product?.price || 0) * it.quantity).toFixed(2)}</span>
                                   </li>
                                 ))}
                               </ul>
                               <div className="border-t border-stone-200 pt-4 flex justify-between font-black">
                                  <span>TOTAL</span>
                                  <span className="text-brand-primary">R$ {order.subtotal.toFixed(2)}</span>
                               </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between gap-6 min-w-[200px]">
                             <div className="space-y-2 text-xs font-bold text-stone-500">
                                <p className="flex items-center gap-2"><MapPin size={14}/> {order.customer.address}</p>
                                <p className="flex items-center gap-2"><Phone size={14}/> {order.customer.phone}</p>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {order.status === 'pending' ? (
                                  <button onClick={() => handleUpdateStatus(order.id, 'scheduled', order.customer)} className="flex-grow py-3 bg-brand-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Aprovar</button>
                                ) : (
                                  <select value={order.status} onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus, order.customer)} className="flex-grow py-3 px-4 bg-white border-2 border-brand-accent rounded-xl font-black text-[10px] uppercase outline-none">
                                     <option value="pending">Pendente</option>
                                     <option value="scheduled">Agendado</option>
                                     <option value="processing">Em Processo</option>
                                     <option value="separated">Separado</option>
                                     <option value="ready">Pronto p/ Envio</option>
                                     <option value="cancelled">Cancelado</option>
                                  </select>
                                )}
                                <button onClick={() => handleDeleteOrder(order.id)} className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                             </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'products' && (
           <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-4xl font-black text-brand-dark tracking-tighter">Cardápio</h3>
                 <button onClick={() => setIsAdding(true)} className="px-8 py-4 bg-brand-primary text-white rounded-[2rem] font-black shadow-xl flex items-center gap-3">
                    <Plus size={20} /> NOVO ITEM
                 </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {products.map(p => (
                    <div key={p.id} className="bg-white rounded-[2.5rem] p-6 border border-stone-100 flex flex-col md:flex-row items-center gap-8 relative group">
                       <AnimatePresence>{saveStatus === p.id && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-3 right-8 bg-green-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-xl z-20">SALVO!</motion.div>}</AnimatePresence>
                       <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-inner relative">
                          <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                             <Upload size={20} className="text-white" /><input type="file" accept="image/*" onChange={e => handleImageUpload(e, p.id)} className="hidden" />
                          </label>
                       </div>
                       <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                          <input defaultValue={p.name} onBlur={e => handleUpdateProduct(p.id, { name: e.target.value })} className="font-black text-xl text-brand-dark bg-transparent outline-none w-full tracking-tight" />
                          <div className="flex items-center gap-3">
                             <input type="number" step="0.01" defaultValue={p.price} onBlur={e => handleUpdateProduct(p.id, { price: parseFloat(e.target.value) })} className="w-24 font-black text-brand-primary bg-stone-50 border-2 border-brand-accent rounded-xl px-3 py-2 outline-none" />
                             <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">/ {p.unit}</span>
                          </div>
                          <div className="flex justify-end gap-2">
                             <button onClick={() => handleUpdateProduct(p.id, { available: !p.available })} className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${p.available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{p.available ? 'Disponível' : 'Esgotado'}</button>
                             <button onClick={() => { if(confirm('Excluir?')) db.deleteProduct(p.id); }} className="p-3 text-stone-200 hover:text-red-500"><Trash2 size={20}/></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </main>
    </motion.div>
  );
}
