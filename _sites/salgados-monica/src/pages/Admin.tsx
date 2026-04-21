import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/db';
import { supabase } from '../lib/supabase';
import { Product, Order, Customer, OrderStatus, CustomerDetails } from '../types';
import { CATEGORIES, COMPANY_DATA } from '../data';
import { 
  X, LogOut, Package, Tag, 
  CheckCircle2, XCircle, Plus, Trash2,
  Upload, Users, Receipt, BarChart3, 
  Calendar, MapPin, Phone, DollarSign,
  TrendingUp, ShoppingBag, UserCheck, Check,
  Clock, ChevronRight, Edit3, MessageCircle,
  Truck, ClipboardList, Filter, ShieldAlert, LogIn,
  Eye, TrendingDown, Target, UserPlus, Save
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  
  // Customer Details State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editCustomerForm, setEditCustomerForm] = useState<Customer | null>(null);
  
  // Order Summary State
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  
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

  const handleUpdateCustomer = async () => {
    if (!editCustomerForm || !selectedCustomer) return;
    await db.updateCustomer(selectedCustomer.phone, {
      name: editCustomerForm.name,
      phone: editCustomerForm.phone
    });
    setSelectedCustomer({ ...selectedCustomer, ...editCustomerForm });
    setIsEditingCustomer(false);
    alert('Dados do cliente atualizados! ✅');
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
    const groups: Record<string, { orders: Order[], production: Record<string, number> }> = {};
    if (!orders) return groups;

    const filtered = orders.filter(o => {
      const matchesSearch = o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             o.customer.phone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.forEach(o => {
      const date = o.customer.date || 'Sem Data';
      if (!groups[date]) {
        groups[date] = { orders: [], production: {} };
      }
      groups[date].orders.push(o);
      
      // Somar produção para este dia
      if (o.status !== 'cancelled') {
        o.items.forEach(item => {
          const name = item.product?.name || 'Desconhecido';
          groups[date].production[name] = (groups[date].production[name] || 0) + item.quantity;
        });
      }
    });

    // Ordenar pedidos dentro de cada grupo por horário
    Object.keys(groups).forEach(date => {
      groups[date].orders.sort((a, b) => (a.customer.time || '').localeCompare(b.customer.time || ''));
    });

    return groups;
  }, [orders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    if (!orders) return { totalRevenue: 0, totalOrders: 0, activeCustomers: 0, pendingCount: 0, scheduledToday: 0 };
    
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    const totalRevenue = orders.filter(o => o.status === 'completed').reduce((acc, o) => acc + o.subtotal, 0);
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const scheduledToday = orders.filter(o => o.customer.date === today && o.status !== 'cancelled').length;
    
    return { 
      totalRevenue, 
      totalOrders: orders.length, 
      activeCustomers: customers.length,
      pendingCount,
      scheduledToday
    };
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
      <div className="sticky top-20 bg-stone-100/80 backdrop-blur-md z-40 px-4 py-4 md:px-10 border-b border-stone-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <nav className="flex bg-white p-1.5 rounded-[2rem] shadow-xl border border-stone-100 flex-grow max-w-2xl w-full">
            {[
              { id: 'agenda', label: 'Agenda', icon: Calendar },
              { id: 'products', label: 'Cardápio', icon: Package },
              { id: 'customers', label: 'Clientes', icon: Users },
              { id: 'stats', label: 'Análise', icon: BarChart3 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-grow flex items-center justify-center gap-2 px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-lg' : 'text-stone-400 hover:text-brand-primary'}`}
              >
                <tab.icon size={18} strokeWidth={3} /> <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
          
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 px-6 py-4 bg-white text-red-500 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-red-50 transition-all active:scale-95 border border-red-100">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>

      <main className="flex-grow overflow-y-auto p-4 md:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'agenda' && (
          <div className="space-y-12">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-brand-primary text-white p-8 rounded-[3rem] shadow-xl flex flex-col justify-between h-48 relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Aguardando Aprovação</span>
                <span className="text-6xl font-black tracking-tighter">{stats.pendingCount}</span>
                <p className="text-xs font-bold opacity-80">Novos pedidos pendentes</p>
              </div>
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border-2 border-stone-100 flex flex-col justify-between h-48">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Para Hoje</span>
                <span className="text-6xl font-black text-brand-dark tracking-tighter">{stats.scheduledToday}</span>
                <p className="text-xs font-bold text-stone-500">Agendados para produção</p>
              </div>
              <div className="bg-brand-cream p-8 rounded-[3rem] border-4 border-brand-accent flex flex-col justify-between h-48">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Faturamento Est.</span>
                <span className="text-5xl font-black text-brand-dark tracking-tighter">R$ {stats.totalRevenue.toFixed(2)}</span>
                <p className="text-xs font-bold text-stone-500 italic">Conversão em pedidos concluídos</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-8 rounded-[3rem] shadow-sm border-2 border-stone-50">
              <div className="flex-grow space-y-4 w-full md:w-auto">
                <h3 className="text-4xl font-black text-brand-dark tracking-tighter uppercase italic text-center md:text-left">Agenda de Producao</h3>
                <div className="relative group max-w-md mx-auto md:mx-0">
                   <Filter size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-primary transition-colors" />
                   <input 
                     type="text" 
                     placeholder="Buscar por cliente ou telefone..." 
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     className="w-full pl-16 pr-6 py-5 bg-stone-50 rounded-2xl border-2 border-stone-100 outline-none focus:border-brand-primary font-bold text-base transition-all shadow-inner"
                   />
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 bg-stone-100 p-2 rounded-2xl w-full md:w-auto">
                  {['all', 'pending', 'scheduled', 'processing', 'ready', 'completed', 'cancelled'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setStatusFilter(s as any)}
                      className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${statusFilter === s ? 'bg-brand-primary text-white border-brand-primary shadow-lg scale-105' : 'bg-white text-stone-400 border-stone-100 hover:border-brand-primary opacity-80'}`}
                    >
                      {s === 'all' ? 'Ver Tudo' : statusMap[s]?.label || s}
                    </button>
                  ))}
              </div>
            </div>

            {Object.entries(agenda).sort().map(([date, group]) => (
              <div key={date} className="space-y-8">
                <div className="flex items-center gap-6">
                   <h4 className="bg-brand-primary text-white px-10 py-3 rounded-full font-black text-lg shadow-xl tracking-[0.2em] italic shrink-0">{date}</h4>
                   <div className="h-px w-full bg-brand-accent opacity-20" />
                   <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{group.orders.length} pedidos</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Production Summary for the day */}
                  <div className="lg:col-span-1 bg-brand-dark text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden h-fit sticky lg:top-28">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16" />
                    <div className="flex items-center gap-4 mb-8">
                       <ClipboardList className="text-brand-primary" size={28} />
                       <h5 className="text-xl font-black uppercase italic tracking-tighter">Resumo de Produção</h5>
                    </div>
                    <ul className="space-y-4">
                      {Object.keys(group.production).length === 0 ? (
                        <p className="text-stone-500 font-bold italic text-sm">Nenhuma produção ativa.</p>
                      ) : (
                        Object.entries(group.production).map(([product, total]) => (
                          <li key={product} className="flex justify-between items-center bg-white/10 p-6 rounded-[2rem] border border-white/10 group transition-all hover:bg-white/20">
                            <span className="text-lg font-black opacity-90">{product}</span>
                            <span className="text-4xl font-black text-brand-primary italic shadow-sm">{total}</span>
                          </li>
                        ))
                      )}
                    </ul>
                    <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                       <button 
                         onClick={() => {
                           const text = `📋 PRODUÇÃO - ${date}\n\n` + 
                             Object.entries(group.production)
                               .map(([p, t]) => `• ${t}x ${p}`)
                               .join('\n');
                           navigator.clipboard.writeText(text);
                           alert('Lista copiada para o WhatsApp da Cozinha! ✅');
                         }}
                         className="w-full py-6 bg-brand-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95"
                       >
                         <ClipboardList size={24} /> COPIAR LISTA P/ COZINHA
                       </button>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-center">Dica: Prepare a massa e recheios com base neste total.</p>
                    </div>
                  </div>

                  {/* Orders list for the day */}
                  <div className="lg:col-span-2 space-y-6">
                    {group.orders.map(order => {
                      const currentStatus = statusMap[order.status] || statusMap['pending'];
                      const StatusIcon = currentStatus.icon;
                      return (
                        <div key={order.id} className="bg-white rounded-[3rem] p-8 md:p-10 border-2 border-stone-50 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                          <div className="flex flex-col xl:flex-row justify-between gap-10">
                            <div 
                              className="flex-grow space-y-6 cursor-pointer hover:bg-stone-50/40 rounded-3xl p-2 -m-2 transition-all"
                              onClick={() => setViewingOrder(order)}
                            >
                              <div className="flex justify-between items-start">
                                 <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-brand-primary font-black text-xl shadow-inner border border-stone-100">
                                       {order.customer.time}
                                    </div>
                                    <div>
                                       <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em]">{order.id}</span>
                                       <h5 className="text-3xl font-black text-brand-dark tracking-tighter leading-none">{order.customer.name}</h5>
                                       <p className="text-xs font-bold text-stone-400 mt-1 flex items-center gap-2"><MapPin size={12}/> {order.customer.neighborhood}</p>
                                    </div>
                                 </div>
                                 <div className={`px-5 py-2 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-sm shrink-0 ${currentStatus.color}`}>
                                    <StatusIcon size={12} />
                                    {currentStatus.label}
                                 </div>
                              </div>
                              <div className="bg-brand-cream/40 p-6 rounded-[2rem] border border-brand-accent/30">
                                 <ul className="space-y-2">
                                   {order.items.map((it, i) => (
                                     <li key={i} className="flex justify-between text-xs font-black">
                                        <span className="text-brand-dark">{it.quantity}x {it.product?.name || 'Item Removido'}</span>
                                        <span className="text-stone-400">R$ {((it.product?.unit === 'cento' ? it.product.price / 100 : it.product?.price || 0) * it.quantity).toFixed(2)}</span>
                                     </li>
                                   ))}
                                 </ul>
                                 <div className="mt-4 pt-4 border-t border-brand-accent/20 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-stone-400 uppercase">Subtotal</span>
                                    <span className="text-2xl font-black text-brand-primary tracking-tighter italic text-shadow-sm">R$ {order.subtotal.toFixed(2)}</span>
                                 </div>
                              </div>
                              {order.customer.observations && (
                                <div className="bg-amber-50 p-4 rounded-2xl border-l-4 border-amber-400 text-amber-800 text-xs font-medium italic">
                                  "{order.customer.observations}"
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col justify-between gap-8 min-w-[250px] xl:border-l-4 border-stone-100 xl:pl-10">
                                <div className="space-y-4">
                                   <a href={`tel:${order.customer.phone}`} className="flex items-center justify-center gap-4 py-5 bg-stone-50 rounded-[2rem] text-sm font-black text-stone-600 hover:text-brand-primary transition-colors border-2 border-transparent hover:border-brand-primary"><Phone size={20} className="text-brand-primary"/> {order.customer.phone}</a>
                                   <button 
                                     onClick={() => window.open(`https://wa.me/${order.customer.phone}`, '_blank')}
                                     className="flex items-center justify-center gap-4 py-6 bg-green-500 text-white rounded-[2rem] text-sm font-black shadow-xl hover:bg-green-600 transition-all active:scale-95 w-full"
                                   >
                                     <MessageCircle size={24} fill="white" /> WHATSAPP DO CLIENTE
                                   </button>
                                </div>
                                <div className="flex flex-col gap-4">
                                   <label className="elderly-label text-[10px] ml-4 opacity-50">MUDAR STATUS DO PEDIDO</label>
                                   <div className="flex flex-wrap gap-3">
                                     {(Object.entries(statusMap) as [OrderStatus, any][]).map(([status, config]) => {
                                       const Icon = config.icon;
                                       const isActive = order.status === status;
                                       return (
                                         <button
                                           key={status}
                                           onClick={() => handleUpdateStatus(order.id, status, order.customer)}
                                           className={`flex-grow py-5 px-4 rounded-2xl font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 border-4 ${
                                             isActive 
                                               ? `${config.color.replace('bg-', 'bg-').replace('text-', 'text-')} border-brand-primary shadow-lg scale-105` 
                                               : 'bg-white text-stone-400 border-brand-accent hover:border-brand-primary'
                                           }`}
                                         >
                                           <Icon size={16} strokeWidth={isActive ? 3 : 1.5} />
                                           {config.label}
                                         </button>
                                       );
                                     })}
                                   </div>
                                   <button onClick={() => handleDeleteOrder(order.id)} className="w-full py-4 text-stone-300 hover:text-red-500 font-extrabold text-[10px] uppercase tracking-widest transition-all">Excluir Registro</button>
                                </div>
                             </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {Object.keys(agenda).length === 0 && (
              <div className="py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-stone-100 shadow-inner">
                 <Calendar size={80} className="mx-auto text-stone-100 mb-8" />
                 <h4 className="text-2xl font-black text-stone-300 tracking-tighter uppercase italic">Opa, nada por aqui!</h4>
                 <p className="text-stone-400 font-bold max-w-xs mx-auto">Tente ajustar seus filtros ou buscar por outro cliente.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-12 pb-20">
             <div className="bg-white p-10 rounded-[4rem] shadow-sm border-2 border-stone-50">
               <h3 className="text-4xl font-black text-brand-dark tracking-tighter uppercase italic mb-10">Analise de Performance</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="bg-stone-50 p-8 rounded-[3rem] border-2 border-stone-100 flex flex-col justify-between">
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total de Pedidos</span>
                     <span className="text-5xl font-black text-brand-dark tracking-tighter">{stats.totalOrders}</span>
                     <div className="h-2 w-full bg-stone-200 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-brand-primary" style={{ width: '100%' }} />
                     </div>
                  </div>
                  <div className="bg-stone-50 p-8 rounded-[3rem] border-2 border-stone-100 flex flex-col justify-between">
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Ticket Medio</span>
                     <span className="text-5xl font-black text-green-600 tracking-tighter">R$ {(stats.totalRevenue / (orders.filter(o => o.status === 'completed').length || 1)).toFixed(2)}</span>
                     <p className="text-[9px] font-bold text-stone-400 mt-2 italic">Media por pedido finalizado</p>
                  </div>
                  <div className="bg-stone-50 p-8 rounded-[3rem] border-2 border-stone-100 flex flex-col justify-between">
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Faturamento Real</span>
                     <span className="text-5xl font-black text-brand-primary tracking-tighter">R$ {stats.totalRevenue.toFixed(2)}</span>
                     <p className="text-[9px] font-bold text-stone-400 mt-2">Apenas pedidos concluidos</p>
                  </div>
                  <div className="bg-stone-50 p-8 rounded-[3rem] border-2 border-stone-100 flex flex-col justify-between">
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Clientes Base</span>
                     <span className="text-5xl font-black text-brand-dark tracking-tighter">{stats.activeCustomers}</span>
                     <p className="text-[9px] font-bold text-stone-400 mt-2">Cadastros recorrentes</p>
                  </div>
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[4rem] border-2 border-stone-50 shadow-sm">
                   <h4 className="text-xl font-black text-brand-dark uppercase tracking-tighter mb-8 italic">Produtos mais Vendidos</h4>
                   <div className="space-y-4">
                      {products.slice(0, 5).map((p, i) => (
                        <div key={p.id} className="flex items-center gap-6 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                           <span className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-black italic">{i+1}</span>
                           <div className="flex-grow">
                              <p className="font-black text-brand-dark text-sm">{p.name}</p>
                              <p className="text-[10px] font-bold text-stone-400 uppercase">{p.category}</p>
                           </div>
                           <div className="text-right">
                              <p className="font-black text-brand-primary">Destaque</p>
                              <p className="text-[9px] font-black text-stone-300 uppercase italic">Favorito do Pub.</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-brand-dark text-white p-10 rounded-[4rem] shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full -mr-32 -mt-32" />
                   <h4 className="text-xl font-black uppercase tracking-tighter mb-8 italic relative">Distribuicao por Status</h4>
                   <div className="space-y-4 relative">
                      {Object.entries(statusMap).map(([key, data]) => {
                        const count = orders.filter(o => o.status === key).length;
                        const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                        return (
                          <div key={key} className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span>{data.label}</span>
                                <span>{count} ({percentage.toFixed(0)}%)</span>
                             </div>
                             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full opacity-60 ${data.color.replace('text-', 'bg-')}`} style={{ width: `${percentage}%` }} />
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'customers' && (
           <div className="space-y-10">
              <div className="bg-white p-8 rounded-[3rem] shadow-sm flex justify-between items-center">
                 <h3 className="text-4xl font-black text-brand-dark tracking-tighter uppercase italic">Base de Clientes</h3>
                 <div className="flex items-center gap-4 text-[10px] font-black text-stone-300 uppercase tracking-widest">
                    <UserCheck size={16} /> Total: {customers.length} fidelizados
                 </div>
              </div>

              <div className="bg-white rounded-[3rem] overflow-hidden border-2 border-stone-50 shadow-sm">
                 <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b-2 border-stone-100">
                       <tr>
                          <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Cliente</th>
                          <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">WhatsApp</th>
                          <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Gasto</th>
                          <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Acoes</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                       {customers.map(c => (
                          <tr key={c.phone} className="hover:bg-brand-cream/20 transition-colors group">
                             <td className="px-8 py-6">
                                <p className="font-black text-brand-dark">{c.name}</p>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Fiel desde {(c as any).created_at ? new Date((c as any).created_at).toLocaleDateString() : 'sempre'}</p>
                             </td>
                             <td className="px-8 py-6">
                                <a href={`https://wa.me/${c.phone}`} target="_blank" className="flex items-center gap-2 text-green-600 font-black text-sm hover:underline"><MessageCircle size={14}/> {c.phone}</a>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                   <DollarSign size={14} className="text-brand-primary" />
                                   <span className="font-black text-brand-dark text-lg italic">R$ {c.total_spent.toFixed(2)}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-2 text-stone-200">
                                   <button 
                                     onClick={() => setSelectedCustomer(c)}
                                     className="p-3 hover:text-brand-primary hover:bg-brand-cream/50 rounded-xl transition-all"
                                     title="Ver detalhes e histórico"
                                   >
                                      <Eye size={20}/>
                                   </button>
                                   <button 
                                     onClick={() => { if(confirm('Excluir este cliente e todo seu histórico?')) db.deleteCustomer(c.phone); }} 
                                     className="p-3 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                     title="Excluir cliente"
                                   >
                                      <Trash2 size={20}/>
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {customers.length === 0 && (
                   <div className="py-20 text-center space-y-4">
                      <Users size={48} className="mx-auto text-stone-100" />
                      <p className="text-stone-400 font-bold">Nenhum cliente cadastrado ainda.</p>
                   </div>
                 )}
              </div>
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

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => { if(!isEditingCustomer) setSelectedCustomer(null); }}
              className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-4xl bg-stone-50 rounded-[4rem] shadow-2xl overflow-hidden border-8 border-white flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-8 right-8 p-3 bg-white text-stone-400 hover:text-brand-primary rounded-2xl shadow-xl z-20"
              >
                <X size={24} />
              </button>

              {/* Sidebar: Stats & Info */}
              <div className="w-full md:w-80 bg-white p-10 border-r-2 border-stone-100 flex flex-col gap-8 shrink-0">
                <div className="space-y-2">
                  <div className="w-20 h-20 bg-brand-cream rounded-[2rem] flex items-center justify-center text-brand-primary mb-4 shadow-inner border-2 border-brand-accent/20">
                    <Users size={40} />
                  </div>
                  {isEditingCustomer ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Nome</label>
                        <input 
                          value={editCustomerForm?.name || ''} 
                          onChange={e => setEditCustomerForm(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="w-full p-4 bg-stone-50 border-2 border-brand-accent rounded-2xl font-black text-brand-dark outline-none focus:border-brand-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">WhatsApp</label>
                        <input 
                          value={editCustomerForm?.phone || ''} 
                          onChange={e => setEditCustomerForm(prev => prev ? {...prev, phone: e.target.value} : null)}
                          className="w-full p-4 bg-stone-50 border-2 border-brand-accent rounded-2xl font-black text-brand-dark outline-none focus:border-brand-primary"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                         <button onClick={handleUpdateCustomer} className="flex-grow py-4 bg-brand-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95">Salvar</button>
                         <button onClick={() => setIsEditingCustomer(false)} className="px-4 py-4 bg-stone-100 text-stone-400 rounded-xl font-black text-[10px] uppercase tracking-widest">X</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-3xl font-black text-brand-dark tracking-tighter italic">{selectedCustomer.name}</h3>
                      <p className="flex items-center gap-2 font-black text-brand-primary text-sm tracking-widest"><MessageCircle size={14}/> {selectedCustomer.phone}</p>
                      <button 
                        onClick={() => {
                          setEditCustomerForm(selectedCustomer);
                          setIsEditingCustomer(true);
                        }}
                        className="flex items-center gap-2 text-[10px] font-black text-stone-300 uppercase tracking-widest hover:text-brand-primary transition-colors"
                      >
                         <Edit3 size={14} /> Editar Perfil
                      </button>
                    </>
                  )}
                </div>

                <div className="h-px bg-stone-100 w-full" />

                <div className="space-y-6">
                   <div className="bg-brand-cream p-6 rounded-[2rem] border-2 border-brand-accent/30 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                      <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest block mb-1">Total Gasto</span>
                      <span className="text-4xl font-black text-brand-dark tracking-tighter italic block">R$ {selectedCustomer.total_spent.toFixed(2)}</span>
                   </div>
                   <div className="bg-stone-50 p-6 rounded-[2rem] border-2 border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Pedidos</span>
                        <span className="text-4xl font-black text-brand-dark tracking-tighter italic block">{selectedCustomer.total_orders}</span>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm border border-stone-100">
                        <ShoppingBag size={24} />
                      </div>
                   </div>
                   <div className="bg-stone-50 p-6 rounded-[2rem] border-2 border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Ticket Médio</span>
                        <span className="text-xl font-black text-brand-primary tracking-tighter block italic">R$ {(selectedCustomer.total_spent / (selectedCustomer.total_orders || 1)).toFixed(2)}</span>
                      </div>
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-300 shadow-sm">
                        <TrendingUp size={18} />
                      </div>
                   </div>
                </div>
              </div>

              {/* Main: History & Charts */}
              <div className="flex-grow p-10 overflow-y-auto bg-stone-50/50">
                 <div className="space-y-10">
                    <div>
                       <h4 className="text-2xl font-black text-brand-dark uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                          <ClipboardList className="text-brand-primary" /> Histórico de Pedidos
                       </h4>
                       
                       <div className="space-y-4">
                          {orders.filter(o => o.customer.phone === selectedCustomer.phone).length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-stone-100 border-dashed">
                               <p className="text-stone-400 font-bold">Nenhum pedido encontrado no banco de dados.</p>
                            </div>
                          ) : (
                            orders
                              .filter(o => o.customer.phone === selectedCustomer.phone)
                              .sort((a, b) => {
                                const parseDate = (d?: string) => {
                                  if (!d) return 0;
                                  const [day, month] = d.split('/').map(Number);
                                  return month * 100 + day;
                                };
                                return parseDate(b.customer.date) - parseDate(a.customer.date);
                              })
                              .map(o => (
                                <div 
                                  key={o.id} 
                                  onClick={() => setViewingOrder(o)}
                                  className="bg-white p-6 rounded-[2rem] border-2 border-stone-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-brand-primary transition-all group cursor-pointer"
                                >
                                   <div className="flex items-center gap-6">
                                      <div className="w-14 h-14 bg-stone-50 rounded-2xl flex flex-col items-center justify-center shadow-inner border border-stone-100 shrink-0">
                                         <span className="text-[10px] font-black text-stone-300 uppercase leading-none">{o.customer.date?.split('/')[0]}</span>
                                         <span className="text-lg font-black text-brand-dark leading-none italic">{o.id.slice(-4).toUpperCase()}</span>
                                      </div>
                                      <div>
                                         <div className="flex items-center gap-3 mb-1">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${statusMap[o.status]?.color || 'bg-stone-100'}`}>
                                               {statusMap[o.status]?.label || o.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-stone-400">{o.customer.date} • {o.customer.time}</span>
                                         </div>
                                         <p className="text-xs font-bold text-stone-500 truncate max-w-[200px]">
                                            {o.items.map(it => `${it.quantity}x ${it.product?.name}`).join(', ')}
                                         </p>
                                      </div>
                                   </div>
                                   <div className="text-right shrink-0">
                                      <span className="text-2xl font-black text-brand-dark tracking-tighter italic group-hover:text-brand-primary transition-colors">R$ {o.subtotal.toFixed(2)}</span>
                                   </div>
                                </div>
                              ))
                          )}
                       </div>
                    </div>

                    {/* Simple Custom Bar Chart for "Spending Intensity" */}
                    <div className="bg-brand-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/10 rounded-full -mr-20 -mt-20" />
                       <h4 className="text-xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3 relative">
                          <BarChart3 className="text-brand-primary" /> Intensidade de Consumo
                       </h4>
                       <div className="flex items-end justify-between gap-2 h-40 px-4">
                          {orders
                            .filter(o => o.customer.phone === selectedCustomer.phone && o.status === 'completed')
                            .slice(-8)
                            .map((o, i) => {
                              const maxVal = Math.max(...orders.filter(o => o.customer.phone === selectedCustomer.phone).map(x => x.subtotal), 1);
                              const height = (o.subtotal / maxVal) * 100;
                              return (
                                <div key={i} className="flex-grow flex flex-col items-center gap-3 group relative">
                                  <div className="absolute bottom-full mb-2 bg-white text-brand-dark p-2 rounded-lg text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-20 pointer-events-none">
                                    R$ {o.subtotal.toFixed(2)}
                                  </div>
                                  <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    className="w-full bg-brand-primary rounded-t-xl group-hover:bg-brand-cream transition-colors shadow-[0_0_20px_rgba(255,204,0,0.2)]"
                                  />
                                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{o.customer.date?.split('/')[0]}</span>
                                </div>
                              );
                            })}
                       </div>
                       <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 text-center mt-8">Mostrando os últimos 8 pedidos concluídos</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Summary Modal */}
      <AnimatePresence>
        {viewingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setViewingOrder(null)}
              className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-lg bg-white rounded-[4rem] shadow-2xl overflow-hidden border-8 border-brand-accent/20 flex flex-col"
            >
              <div className="p-10 space-y-8">
                 <div className="flex justify-between items-start">
                    <div>
                       <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest block mb-1">Pedido ID: {viewingOrder.id.slice(0, 8)}</span>
                       <h3 className="text-4xl font-black text-brand-dark tracking-tighter uppercase italic">Resumo do Pedido</h3>
                    </div>
                    <button onClick={() => setViewingOrder(null)} className="p-3 bg-stone-50 text-stone-400 hover:text-brand-primary rounded-2xl transition-colors">
                       <X size={24} />
                    </button>
                 </div>

                 <div className="bg-stone-50 p-6 rounded-[2rem] border-2 border-stone-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <Calendar className="text-brand-primary" size={24} />
                       <div>
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Entrega Programada</p>
                          <p className="text-lg font-black text-brand-dark italic">{viewingOrder.customer.date} às {viewingOrder.customer.time}</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Itens do Pedido</h4>
                    <div className="bg-brand-cream/30 p-8 rounded-[3rem] border-2 border-brand-accent/20">
                       <ul className="space-y-4">
                          {viewingOrder.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                               <div className="flex items-center gap-4">
                                  <span className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center font-black italic scale-90">{it.quantity}x</span>
                                  <span className="font-black text-brand-dark">{it.product?.name || 'Item'}</span>
                               </div>
                               <span className="font-black text-stone-400 text-sm italic">R$ {((it.product?.unit === 'cento' ? it.product.price / 100 : it.product?.price || 0) * it.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                       </ul>
                       <div className="mt-8 pt-8 border-t-2 border-brand-accent/20 flex justify-between items-end">
                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Valor Total</span>
                          <span className="text-4xl font-black text-brand-primary tracking-tighter italic">R$ {viewingOrder.subtotal.toFixed(2)}</span>
                       </div>
                    </div>
                 </div>

                 {viewingOrder.customer.observations && (
                   <div className="bg-amber-50 p-6 rounded-[2rem] border-2 border-amber-100 text-amber-800 text-sm font-bold italic leading-relaxed">
                      <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-60">Observações do Cliente:</p>
                      "{viewingOrder.customer.observations}"
                   </div>
                 )}

                 <div className="pt-4 flex gap-4">
                    <button 
                      onClick={() => {
                        window.open(`https://wa.me/${viewingOrder.customer.phone}`, '_blank');
                      }}
                      className="flex-grow py-6 bg-green-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-green-600 transition-all flex items-center justify-center gap-3"
                    >
                      <MessageCircle size={20} fill="white" /> Falar com Cliente
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <footer className="p-8 bg-white border-t-4 border-brand-accent text-center">
         <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">Sistema de Orquestracao Monica PRO v4.0</p>
      </footer>
    </div>
  );
}
