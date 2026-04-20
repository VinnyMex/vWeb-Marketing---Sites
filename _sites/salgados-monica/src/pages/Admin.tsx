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
  Truck, ClipboardList, Filter, ShieldAlert, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'agenda' | 'products' | 'customers' | 'stats'>('agenda');
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
    if (!isLoggedIn) return;

    const fetchData = async () => {
       await db.init();
       const [p, o, c] = await Promise.all([
          db.getProducts(),
          db.getOrders(),
          db.getCustomers()
       ]);
       setProducts(p);
       setOrders(o);
       setCustomers(c.sort((a, b) => b.totalSpent - a.totalSpent));
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
       setCustomers(c.sort((a, b) => b.totalSpent - a.totalSpent));
    };

    window.addEventListener('db-updated', handleDbUpdate);
    return () => window.removeEventListener('db-updated', handleDbUpdate);
  }, [isLoggedIn]);

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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-900/90 backdrop-blur-xl flex items-center justify-center p-4 font-sans">
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden border-4 border-brand-accent">
          <div className="p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-brand-primary">
              <ShieldAlert size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-brand-dark tracking-tighter">Área do Admin</h2>
              <p className="text-stone-500 font-bold">Gestão Salgados Mônica</p>
            </div>
            <button onClick={() => setIsLoggedIn(true)} className="w-full py-5 bg-brand-primary text-white rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-brand-dark transition-all active:scale-95">
              <LogIn size={24} /> ENTRAR NO PAINEL
            </button>
            <Link to="/" className="block py-4 text-stone-400 font-black text-xs uppercase tracking-widest hover:text-stone-600 transition-colors">VOLTAR AO SITE</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      <header className="bg-white border-b-2 border-brand-accent px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10 gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">M</div>
          <div>
            <h2 className="font-black text-brand-dark tracking-tighter leading-none uppercase italic">{COMPANY_DATA.name}</h2>
            <p className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em] mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Painel de Orquestração
            </p>
          </div>
        </div>

        <nav className="flex bg-stone-100 p-1.5 rounded-[1.5rem] border border-stone-200 shadow-inner">
          {[
            { id: 'agenda', label: 'Agenda', icon: Calendar },
            { id: 'products', label: 'Cardapio', icon: Package },
            { id: 'customers', label: 'Clientes', icon: Users },
            { id: 'stats', label: 'Analise', icon: BarChart3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-brand-primary shadow-sm scale-105' : 'text-stone-500 hover:text-brand-primary opacity-60'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
           <button onClick={() => setIsLoggedIn(false)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><LogOut size={20}/></button>
           <Link to="/" className="p-3 bg-stone-100 text-stone-600 rounded-2xl hover:bg-stone-200 font-bold transition-all shadow-sm"><X size={24} /></Link>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 md:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'agenda' && (
          <div className="space-y-12">
            <h3 className="text-4xl font-black text-brand-dark tracking-tighter uppercase italic">Agenda de Producao</h3>
            {Object.entries(agenda).sort().map(([date, dateOrders]) => (
              <div key={date} className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="h-px flex-grow bg-brand-accent opacity-30" />
                   <h4 className="bg-brand-primary text-white px-8 py-2.5 rounded-full font-black text-sm shadow-xl tracking-[0.3em] italic">{date}</h4>
                   <div className="h-px flex-grow bg-brand-accent opacity-30" />
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {dateOrders.map(order => {
                    const currentStatus = statusMap[order.status] || statusMap['pending'];
                    const Icon = currentStatus.icon;
                    return (
                      <div key={order.id} className="bg-white rounded-[3rem] p-10 border-2 border-stone-50 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="flex flex-col lg:flex-row justify-between gap-10">
                          <div className="flex-grow space-y-8">
                            <div className="flex justify-between items-start">
                               <div>
                                  <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em] mb-2 block">{order.id}</span>
                                  <h5 className="text-3xl font-black text-brand-dark tracking-tighter leading-none">{order.customer.name}</h5>
                                  <p className="text-sm font-bold text-stone-400 mt-2 flex items-center gap-2"><Clock size={14}/> Previsto: {order.customer.time} | {order.customer.neighborhood}</p>
                               </div>
                               <div className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-sm ${currentStatus.color}`}>
                                  <Icon size={14} />
                                  {currentStatus.label}
                               </div>
                            </div>
                            <div className="bg-brand-cream/40 p-8 rounded-[2.5rem] border-2 border-brand-accent shadow-inner">
                               <ul className="space-y-3 mb-6">
                                 {order.items.map((it, i) => (
                                   <li key={i} className="flex justify-between text-sm font-black border-b border-brand-accent/20 pb-2">
                                      <span className="text-brand-dark">{it.quantity}x {it.product?.name || 'Item Removido'}</span>
                                      <span className="text-stone-400">R$ {((it.product?.unit === 'cento' ? it.product.price / 100 : it.product?.price || 0) * it.quantity).toFixed(2)}</span>
                                   </li>
                                 ))}
                               </ul>
                               <div className="pt-4 flex justify-between items-center font-black">
                                  <span className="text-xs text-stone-400 uppercase tracking-widest">Total do Pedido</span>
                                  <span className="text-3xl text-brand-primary tracking-tighter italic">R$ {order.subtotal.toFixed(2)}</span>
                               </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between gap-8 min-w-[250px] lg:border-l-2 border-stone-50 lg:pl-10">
                             <div className="space-y-4 text-xs font-black text-stone-500 uppercase tracking-widest">
                                <p className="flex items-center gap-3"><MapPin size={18} className="text-brand-primary"/> {order.customer.address}</p>
                                <p className="flex items-center gap-3"><Phone size={18} className="text-brand-primary"/> {order.customer.phone}</p>
                                {order.customer.observations && <p className="bg-amber-50 p-4 rounded-2xl text-amber-700 italic lowercase tracking-normal">"{order.customer.observations}"</p>}
                             </div>
                             <div className="flex flex-col gap-3">
                                {order.status === 'pending' ? (
                                  <button onClick={() => handleUpdateStatus(order.id, 'scheduled', order.customer)} className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all italic">APROVAR AGENDAMENTO</button>
                                ) : (
                                  <select value={order.status} onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus, order.customer)} className="w-full py-4 px-6 bg-white border-4 border-brand-accent rounded-2xl font-black text-xs uppercase tracking-widest outline-none focus:border-brand-primary shadow-sm appearance-none cursor-pointer">
                                     <option value="pending">Pendente</option>
                                     <option value="scheduled">Agendado</option>
                                     <option value="processing">Produção</option>
                                     <option value="separated">Separado</option>
                                     <option value="ready">Pronto/Envio</option>
                                     <option value="cancelled">Cancelado</option>
                                  </select>
                                )}
                                <button onClick={() => handleDeleteOrder(order.id)} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">EXCLUIR REGISTRO</button>
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
           <div className="space-y-10">
              <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm">
                 <h3 className="text-4xl font-black text-brand-dark tracking-tighter uppercase italic">Gestao de Cardapio</h3>
                 <button onClick={() => setIsAdding(true)} className="px-10 py-5 bg-brand-primary text-white rounded-[2rem] font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-4 text-sm tracking-widest">
                    <Plus size={24} /> NOVO PRODUTO
                 </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 {products.map(p => (
                    <div key={p.id} className="bg-white rounded-[3rem] p-8 border-2 border-stone-50 flex flex-col md:flex-row items-center gap-10 relative group hover:shadow-2xl transition-all duration-500">
                       <AnimatePresence>{saveStatus === p.id && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-4 right-10 bg-green-500 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-2xl z-20 tracking-[0.2em]">Sincronizado!</motion.div>}</AnimatePresence>
                       <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-2xl relative border-4 border-brand-accent/20">
                          <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-sm">
                             <Upload size={24} className="text-white scale-75 group-hover:scale-100 transition-transform" /><input type="file" accept="image/*" onChange={e => handleImageUpload(e, p.id)} className="hidden" />
                          </label>
                       </div>
                       <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
                          <div className="space-y-1">
                             <input defaultValue={p.name} onBlur={e => handleUpdateProduct(p.id, { name: e.target.value })} className="font-black text-2xl text-brand-dark bg-transparent outline-none w-full tracking-tighter focus:text-brand-primary transition-colors" />
                             <span className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.3em] italic opacity-60">{p.category}</span>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary font-black opacity-40">R$</span>
                                <input type="number" step="0.01" defaultValue={p.price} onBlur={e => handleUpdateProduct(p.id, { price: parseFloat(e.target.value) })} className="w-36 font-black text-2xl text-brand-primary bg-brand-cream/30 border-4 border-brand-accent rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-brand-primary shadow-inner" />
                             </div>
                             <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">/ {p.unit}</span>
                          </div>
                          <div className="flex items-center justify-end gap-4">
                             <button onClick={() => handleUpdateProduct(p.id, { available: !p.available })} className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm transition-all ${p.available ? 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white' : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white'}`}>{p.available ? 'EM ESTOQUE' : 'ESGOTADO'}</button>
                             <button onClick={() => { if(confirm('Excluir?')) db.deleteProduct(p.id); }} className="p-4 text-stone-200 hover:text-red-500 transition-colors bg-stone-50 rounded-2xl hover:bg-red-50"><Trash2 size={24}/></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </main>
      <footer className="p-8 bg-white border-t-4 border-brand-accent text-center">
         <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">Sistema de Orquestracao Monica PRO v4.0</p>
      </footer>
    </div>
  );
}
