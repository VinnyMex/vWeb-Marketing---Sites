/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBasket, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  MapPin, 
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  MessageCircle,
  Menu,
  X,
  Hash,
  Search,
  ShieldCheck,
  Info,
  Edit3,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, CustomerDetails, Order } from './types';
import { CATEGORIES, COMPANY_DATA } from './data';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { db } from './lib/db';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails & { number?: string }>({
    phone: '',
    name: '',
    address: '',
    number: '',
    neighborhood: '',
    reference: '',
    date: '',
    time: '',
    observations: ''
  });

  useEffect(() => {
    const loadData = async () => {
      await db.init();
      setProducts(db.getProducts());
    };
    loadData();

    const handleDbUpdate = () => {
      setProducts(db.getProducts());
    };

    window.addEventListener('db-updated', handleDbUpdate);
    
    // Hidden admin check
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setIsAdminOpen(true);
      setIsLoggedIn(true);
    }

    return () => window.removeEventListener('db-updated', handleDbUpdate);
  }, []);

  // Auto-fill for existing customers
  useEffect(() => {
    if (customerDetails.phone.length >= 10) {
      const existing = db.getCustomerByPhone(customerDetails.phone);
      if (existing) {
        setCustomerDetails(prev => ({
          ...prev,
          name: existing.name,
          address: existing.address.split(', Num: ')[0] || existing.address,
          number: existing.address.split(', Num: ')[1] || '',
          neighborhood: existing.neighborhood,
          reference: existing.reference
        }));
        setLgpdConsent(true);
      }
    }
  }, [customerDetails.phone]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategory === 'Todos') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  const cartTotalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (!item.product || !item.product.price) return acc;
      const unitPrice = item.product.unit === 'cento' ? (item.product.price / 100) : item.product.price;
      return acc + (unitPrice * item.quantity);
    }, 0);
  }, [cart]);

  const updateQuantity = (product: Product, quantity: number) => {
    if (!product.available) return;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (quantity <= 0) return prevCart.filter(item => item.product.id !== product.id);
      if (existingItem) {
        return prevCart.map(item => item.product.id === product.id ? { ...item, quantity } : item);
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const getProductQuantity = (productId: string) => cart.find(item => item.product.id === productId)?.quantity || 0;

  const handleEditPendingOrder = () => {
    const order = db.getPendingOrderByPhone(editPhone.replace(/\D/g, ''));
    if (order) {
      setCart(order.items);
      setCustomerDetails({
        ...order.customer,
        address: order.customer.address.split(', Num: ')[0] || order.customer.address,
        number: order.customer.address.split(', Num: ')[1] || '',
      });
      setEditingOrderId(order.id);
      setIsEditModalOpen(false);
      setIsCartOpen(true);
      setLgpdConsent(true);
    } else {
      alert('Nenhum pedido PENDENTE encontrado para este número.');
    }
  };

  const handleFinalizeOrder = async () => {
    if (cart.length === 0 || !lgpdConsent) return;

    const fullAddress = `${customerDetails.address}, Num: ${customerDetails.number}`;
    const finalizedDetails = { ...customerDetails, address: fullAddress };

    if (editingOrderId) {
      await db.updateOrderItems(editingOrderId, cart, cartSubtotal, finalizedDetails);
    } else {
      await db.addOrder({
        customer: finalizedDetails,
        items: cart,
        subtotal: cartSubtotal
      });
    }

    let message = `*${editingOrderId ? 'ATUALIZAÇÃO DE PEDIDO' : 'NOVO PEDIDO'} - ${COMPANY_DATA.name.toUpperCase()}*\n\n`;
    message += `WHATSAPP: ${customerDetails.phone}\n`;
    message += `CLIENTE: ${customerDetails.name}\n`;
    message += `ENDERECO: ${customerDetails.address}, Num: ${customerDetails.number}\n`;
    message += `BAIRRO: ${customerDetails.neighborhood}\n`;
    if (customerDetails.reference) message += `REFERENCIA: ${customerDetails.reference}\n\n`;
    message += `DATA PREVISTA: ${customerDetails.date}\n`;
    message += `HORA PREVISTA: ${customerDetails.time}\n\n`;

    message += `*ITENS DO PEDIDO*\n`;
    message += `--------------------------------\n`;
    cart.forEach(item => {
      const unitPrice = item.product.unit === 'cento' ? (item.product.price || 0) / 100 : (item.product.price || 0);
      message += `- ${item.quantity}x ${item.product.name} [R$ ${(unitPrice * item.quantity).toFixed(2)}]\n`;
    });
    message += `--------------------------------\n`;
    message += `TOTAL: R$ ${cartSubtotal.toFixed(2)}\n\n`;
    if (customerDetails.observations) message += `OBS: ${customerDetails.observations}\n\n`;
    message += `_Pedido gerado via Catalogo Digital_`;

    window.open(`https://wa.me/${COMPANY_DATA.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    
    setCart([]);
    setEditingOrderId(null);
    setIsCartOpen(false);
    alert('Pedido enviado com sucesso!');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900 bg-white">
      <AnimatePresence>
        {isAdminOpen && !isLoggedIn && (
          <Login onLogin={() => setIsLoggedIn(true)} onClose={() => setIsAdminOpen(false)} />
        )}
        {isAdminOpen && isLoggedIn && (
          <AdminPanel onClose={() => setIsAdminOpen(false)} />
        )}
        {isEditModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-stone-900/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-4 border-brand-accent">
                <h3 className="text-3xl font-black text-brand-dark tracking-tighter mb-4">Editar Pedido</h3>
                <p className="text-stone-500 font-bold mb-8 leading-relaxed">Digite seu WhatsApp para recuperar seu pedido ainda não aprovado.</p>
                <input 
                  type="tel" 
                  placeholder="21987654321" 
                  value={editPhone} 
                  onChange={e => setEditPhone(e.target.value)} 
                  className="w-full px-6 py-5 rounded-2xl border-2 border-brand-accent outline-none focus:border-brand-primary font-black mb-8 text-xl shadow-inner bg-stone-50" 
                />
                <div className="flex gap-4">
                   <button onClick={handleEditPendingOrder} className="flex-grow py-5 bg-brand-primary text-white rounded-2xl font-black shadow-xl hover:bg-brand-dark transition-all">BUSCAR AGORA</button>
                   <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-5 bg-stone-100 text-stone-500 rounded-2xl font-black">VOLTAR</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 bg-brand-primary text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center text-brand-primary font-black text-3xl shadow-inner border-4 border-brand-accent/20">M</div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black leading-none tracking-tighter uppercase italic">{COMPANY_DATA.name}</h1>
                <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-60 mt-1">O Legítimo Sabor de Niterói</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              <a href="#catalogo" className="font-black hover:text-brand-secondary transition-colors text-xs uppercase tracking-widest border-b-2 border-transparent hover:border-brand-secondary pb-1">Cardápio</a>
              <a href="#quem-somos" className="font-black hover:text-brand-secondary transition-colors text-xs uppercase tracking-widest border-b-2 border-transparent hover:border-brand-secondary pb-1">Nossa História</a>
              <button 
                onClick={() => setIsEditModalOpen(true)} 
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-white/5 transition-all shadow-sm"
              >
                <Edit3 size={16} /> Editar Pedido
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative p-4 bg-white/10 hover:bg-white/20 rounded-2xl active:scale-90 transition-all shadow-lg group"
              >
                <ShoppingBasket size={28} className="group-hover:rotate-12 transition-transform" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-7 h-7 bg-brand-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-2xl border-4 border-brand-primary animate-bounce">
                    {cartTotalItems}
                  </span>
                )}
              </button>
              <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden p-3 bg-white/10 rounded-2xl">
                {isNavOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION PREMIUM */}
        <section className="relative bg-brand-cream py-24 lg:py-48 overflow-hidden border-b-8 border-brand-accent">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/4" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center lg:text-left">
            <div className="max-w-4xl">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 px-6 py-2.5 bg-white rounded-full shadow-md border-2 border-brand-accent mb-10">
                <CheckCircle2 size={18} className="text-brand-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">Artesanal • Fresquinho • Niterói</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl sm:text-8xl lg:text-9xl font-black text-brand-dark leading-[0.85] tracking-tighter mb-10">
                Salgados <br/><span className="text-brand-primary italic">Inesquecíveis.</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl sm:text-2xl text-stone-600 mb-14 font-medium max-w-2xl leading-relaxed">
                Transforme sua festa com o sabor que Niterói ama. Massa leve de batata e recheios generosos feitos com carinho.
              </motion.p>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <a href="#catalogo" className="px-12 py-6 bg-brand-primary text-white font-black rounded-[2rem] shadow-2xl hover:bg-brand-dark hover:scale-105 active:scale-95 transition-all text-xl flex items-center justify-center gap-4">
                  <ShoppingBasket size={28} /> VER CARDÁPIO
                </a>
                <button onClick={() => setIsEditModalOpen(true)} className="px-12 py-6 bg-white text-brand-dark font-black rounded-[2rem] border-4 border-brand-accent flex items-center justify-center gap-3 text-xl hover:bg-brand-cream transition-all">
                  <Edit3 size={24}/> EDITAR PEDIDO
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CATALOG SECTION PREMIUM */}
        <section id="catalogo" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
              <div className="max-w-2xl">
                <h3 className="text-brand-primary font-black text-xs uppercase tracking-[0.5em] mb-6">Qualidade Superior</h3>
                <h2 className="text-5xl sm:text-7xl font-black text-brand-dark tracking-tighter leading-none">Nosso Cardápio</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-3 bg-brand-cream p-3 rounded-[2.5rem] border-4 border-brand-accent shadow-inner">
                <button onClick={() => setActiveCategory('Todos')} className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === 'Todos' ? 'bg-brand-primary text-white shadow-xl scale-105' : 'text-stone-500 hover:bg-white'}`}>Todos</button>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-brand-primary text-white shadow-xl scale-105' : 'text-stone-500 hover:bg-white'}`}>{cat}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <motion.div layout key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group bg-white rounded-[4rem] overflow-hidden border-2 border-stone-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col relative">
                    <div className="aspect-[4/5] relative overflow-hidden bg-stone-50">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={product.name} />
                      {product.price && product.available && (
                        <div className="absolute top-8 right-8 bg-brand-primary text-white px-6 py-3 rounded-[1.5rem] font-black text-sm shadow-2xl border-4 border-white/20">
                          R$ {product.price.toFixed(2)} <span className="text-[10px] opacity-60">/ {product.unit}</span>
                        </div>
                      )}
                      {!product.available && (
                        <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md flex items-center justify-center">
                          <span className="px-10 py-4 bg-white text-stone-900 font-black rounded-full text-xs uppercase tracking-[0.3em] shadow-2xl">ESGOTADO</span>
                        </div>
                      )}
                    </div>
                    <div className="p-10 flex-grow flex flex-col">
                      <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest mb-4 opacity-50 italic">Categoria: {product.category}</span>
                      <h4 className="text-3xl font-black text-brand-dark mb-4 tracking-tighter leading-[0.9]">{product.name}</h4>
                      <p className="text-sm text-stone-400 mb-10 flex-grow leading-relaxed font-bold">{product.description}</p>
                      
                      {product.available ? (
                        <div className="mt-auto space-y-6">
                          <div className="flex justify-between items-center text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] border-b border-stone-50 pb-2">
                            <span>Preço por Unidade</span>
                            <span className="text-brand-primary text-xs font-black">R$ {((product.unit === 'cento' ? product.price / 100 : product.price)).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-4 bg-brand-cream p-2.5 rounded-[2rem] border-2 border-brand-accent shadow-sm">
                            <input 
                              type="number" 
                              min="0"
                              placeholder="0"
                              value={getProductQuantity(product.id) || ''}
                              onChange={(e) => updateQuantity(product, parseInt(e.target.value) || 0)}
                              className="w-full pl-6 pr-3 py-4 bg-white rounded-2xl border-2 border-brand-accent outline-none font-black text-2xl text-center focus:border-brand-primary transition-all shadow-inner"
                            />
                            <div className="flex flex-col gap-1.5">
                              <button onClick={() => updateQuantity(product, getProductQuantity(product.id) + 1)} className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-dark shadow-md transition-all active:scale-90"><Plus size={20} /></button>
                              <button onClick={() => updateQuantity(product, Math.max(0, getProductQuantity(product.id) - 1))} className="w-10 h-10 border-2 border-brand-primary text-brand-primary rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all active:scale-90"><Minus size={20} /></button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-auto py-6 text-center border-t-2 border-stone-50">
                          <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest italic">Aguardando Produção</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* QUEM SOMOS SECTION PREMIUM */}
        <section id="quem-somos" className="py-32 bg-brand-cream border-y-8 border-brand-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="relative">
                  <div className="aspect-square rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] relative z-10 border-[12px] border-white rotate-2 hover:rotate-0 transition-transform duration-700">
                    <img src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1000" className="w-full h-full object-cover" alt="Salgados Mônica" />
                  </div>
                  <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-brand-primary/20 rounded-full blur-[80px] -z-10 animate-pulse" />
                  <div className="absolute -top-16 -left-16 w-64 h-64 bg-brand-secondary/20 rounded-full blur-[80px] -z-10" />
                </div>
                <div className="space-y-10 text-center lg:text-left">
                  <h3 className="text-brand-primary font-black text-sm uppercase tracking-[0.5em]">Nossa Essência</h3>
                  <h2 className="text-6xl sm:text-8xl font-black text-brand-dark tracking-tighter leading-[0.8] mb-10">Amor em <br/><span className="text-brand-primary italic">cada mordida.</span></h2>
                  <div className="space-y-8 text-stone-600 font-bold leading-relaxed text-xl">
                    <p>Salgados Mônica nasceu do desejo de levar para a sua mesa a mesma qualidade e carinho que servimos em nossa família há mais de duas décadas.</p>
                    <p>Cada coxinha é modelada manualmente. Cada recheio é refogado com temperos frescos e naturais, sem conservantes. É a tradição de Niterói na sua festa.</p>
                    <div className="grid grid-cols-2 gap-8 pt-10">
                       <div className="p-10 bg-white rounded-[3rem] shadow-xl border-2 border-brand-accent relative group overflow-hidden">
                          <div className="absolute top-0 right-0 w-2 h-full bg-brand-primary group-hover:w-full transition-all opacity-5" />
                          <h5 className="font-black text-brand-primary text-5xl mb-2 relative">25+</h5>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 relative">Anos de História</p>
                       </div>
                       <div className="p-10 bg-white rounded-[3rem] shadow-xl border-2 border-brand-accent relative group overflow-hidden">
                          <div className="absolute top-0 right-0 w-2 h-full bg-brand-primary group-hover:w-full transition-all opacity-5" />
                          <h5 className="font-black text-brand-primary text-5xl mb-2 relative">100k+</h5>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 relative">Clientes Felizes</p>
                       </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="duvidas" className="py-32 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-5xl sm:text-7xl font-black text-brand-dark tracking-tighter mb-24 uppercase italic">Tire suas <span className="text-brand-primary">Dúvidas</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                { q: "Qual o prazo mínimo?", a: "Pedidos devem ser feitos com 24h a 48h de antecedência para garantir frescor total." },
                { q: "Quais os meios de pagamento?", a: "Aceitamos PIX, Cartão de Crédito e Débito no ato da entrega ou via link." },
                { q: "Entregam em quais bairros?", a: "Toda Niterói e São Gonçalo. A taxa de entrega é calculada conforme o bairro." },
                { q: "Como funciona o agendamento?", a: "Você escolhe o dia e o horário previsto no carrinho. Confirmaremos tudo no WhatsApp!" }
              ].map((faq, i) => (
                <div key={i} className="p-10 bg-brand-cream rounded-[3rem] border-2 border-brand-accent hover:border-brand-primary transition-all duration-500 hover:-translate-y-2 group shadow-sm">
                   <h4 className="text-2xl font-black text-brand-dark mb-6 flex gap-5">
                      <span className="text-brand-primary font-black opacity-40 italic">0{i+1}</span> {faq.q}
                   </h4>
                   <p className="text-stone-500 font-bold pl-12 leading-relaxed text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* CART SIDEBAR PREMIUM */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-stone-900/80 backdrop-blur-xl z-50" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col border-l-8 border-brand-primary">
              <div className="p-10 border-b-4 border-brand-accent flex items-center justify-between bg-brand-cream">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-brand-primary text-white rounded-[2rem] flex items-center justify-center shadow-2xl animate-pulse"><ShoppingBasket size={32}/></div>
                  <h2 className="text-4xl font-black text-brand-dark tracking-tighter">Seu Carrinho</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-4 bg-white hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-md group"><X size={24} className="group-hover:rotate-90 transition-transform" /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-10 space-y-12">
                {cart.length > 0 && (
                  <div className="space-y-8 bg-brand-cream/60 p-10 rounded-[4rem] border-4 border-brand-accent shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary opacity-5 rounded-full -mr-16 -mt-16" />
                    <h3 className="text-[10px] font-black uppercase text-brand-primary tracking-[0.5em] flex items-center gap-3 mb-4">
                      <Search size={18} /> IDENTIFICAÇÃO E ENTREGA
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="relative group">
                        <label className="text-[10px] font-black text-stone-400 uppercase ml-6 absolute -top-2 left-0 bg-brand-cream px-3 z-10 transition-all group-focus-within:text-brand-primary">WhatsApp (Com DDD)</label>
                        <input type="tel" placeholder="21987654321" value={customerDetails.phone} onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value.replace(/\D/g, '')})} className="w-full px-8 py-5 rounded-[2rem] border-4 border-brand-accent outline-none focus:border-brand-primary font-black bg-white shadow-sm text-lg" />
                      </div>

                      <input type="text" placeholder="Nome Completo" value={customerDetails.name} onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] border-2 border-brand-accent outline-none focus:border-brand-primary text-sm font-black shadow-sm" />
                      
                      <div className="grid grid-cols-4 gap-4">
                         <input type="text" placeholder="Endereço / Rua" value={customerDetails.address} onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})} className="col-span-3 px-8 py-5 rounded-[2rem] border-2 border-brand-accent text-sm font-black shadow-sm" />
                         <input type="text" placeholder="Num" value={customerDetails.number} onChange={(e) => setCustomerDetails({...customerDetails, number: e.target.value})} className="px-4 py-5 rounded-[2rem] border-2 border-brand-accent text-sm font-black text-center shadow-sm" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Bairro" value={customerDetails.neighborhood} onChange={(e) => setCustomerDetails({...customerDetails, neighborhood: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] border-2 border-brand-accent text-sm font-black shadow-sm" />
                        <input type="text" placeholder="Ponto de Referência" value={customerDetails.reference} onChange={(e) => setCustomerDetails({...customerDetails, reference: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] border-2 border-brand-accent text-sm font-black shadow-sm" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-brand-accent/20 mt-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Data Prevista</label>
                           <input type="text" placeholder="dd/MM (Ex: 20/04)" value={customerDetails.date} onChange={(e) => setCustomerDetails({...customerDetails, date: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] border-4 border-brand-accent outline-none focus:border-brand-primary text-sm font-black shadow-sm bg-white" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Hora Prevista</label>
                           <input type="text" placeholder="Hh (Ex: 16h)" value={customerDetails.time} onChange={(e) => setCustomerDetails({...customerDetails, time: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] border-4 border-brand-accent outline-none focus:border-brand-primary text-sm font-black shadow-sm text-center bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-8 p-8 border-2 border-stone-50 rounded-[3.5rem] bg-white shadow-xl group hover:border-brand-primary transition-all duration-500">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-4 border-white flex-shrink-0">
                         <img src={item.product.image} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" alt={item.product.name} />
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <h4 className="font-black text-brand-dark text-xl tracking-tighter mb-2">{item.product.name}</h4>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-stone-300 uppercase">Subtotal</span>
                             <span className="font-black text-brand-primary text-xl">R$ {((item.product.unit === 'cento' ? item.product.price / 100 : item.product.price) * item.quantity).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-4 bg-brand-cream p-2 rounded-2xl border-2 border-brand-accent">
                             <input type="number" className="w-16 text-center font-black text-xl bg-white rounded-xl py-3 border-2 border-brand-accent outline-none focus:border-brand-primary" value={item.quantity} onChange={(e) => updateQuantity(item.product, parseInt(e.target.value) || 0)} />
                             <span className="text-[10px] font-black text-stone-300 uppercase pr-2">UNID.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 border-t-8 border-brand-accent bg-brand-footer space-y-8">
                {cart.length > 0 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border-4 border-blue-50 flex gap-6 items-start shadow-xl">
                    <input type="checkbox" id="lgpd" checked={lgpdConsent} onChange={(e) => setLgpdConsent(e.target.checked)} className="mt-1 w-7 h-7 rounded-xl border-4 border-brand-accent text-brand-primary focus:ring-brand-primary" />
                    <label htmlFor="lgpd" className="text-xs text-stone-500 leading-relaxed font-bold">
                      Autorizo o salvamento seguro dos meus dados para este agendamento e para agilizar meus pedidos futuros, em total conformidade com a LGPD.
                    </label>
                  </div>
                )}

                <div className="flex justify-between items-center px-4">
                  <div className="flex flex-col">
                     <span className="text-stone-400 font-black uppercase text-xs tracking-[0.3em] mb-1">Valor do Investimento</span>
                     <span className="text-6xl font-black text-brand-primary tracking-tighter">R$ {cartSubtotal.toFixed(2)}</span>
                  </div>
                  <ShoppingBasket size={50} className="text-brand-accent opacity-20" />
                </div>
                
                <button 
                  onClick={handleFinalizeOrder} 
                  disabled={!customerDetails.phone || !customerDetails.name || !customerDetails.date || cart.length === 0 || !lgpdConsent} 
                  className="w-full py-8 bg-brand-primary text-white rounded-[3rem] font-black shadow-[0_20px_50px_rgba(158,62,35,0.4)] disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-5 text-2xl active:scale-95 transition-all hover:bg-brand-dark"
                >
                  <MessageCircle size={32} fill="currentColor" /> {editingOrderId ? 'ATUALIZAR MEU PEDIDO' : 'ENVIAR NO WHATSAPP'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FOOTER PREMIUM */}
      <footer className="bg-brand-dark text-stone-500 py-32 mt-40 border-t-[12px] border-brand-primary px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
           <div className="col-span-1 md:col-span-1">
              <div className="w-20 h-20 bg-brand-primary rounded-[2rem] text-white font-black text-4xl mb-10 flex items-center justify-center shadow-2xl hover:rotate-12 transition-transform">M</div>
              <h4 className="text-white font-black text-3xl tracking-tighter mb-6 uppercase italic">{COMPANY_DATA.name}</h4>
              <p className="font-bold leading-relaxed opacity-50 text-lg">Tradição, sabor e o carinho artesanal que sua festa merece.</p>
           </div>
           <div>
              <h5 className="text-white font-black text-xs uppercase tracking-[0.5em] mb-10 opacity-30">Explorar</h5>
              <ul className="space-y-6 font-black text-sm uppercase tracking-widest">
                 <li><a href="#catalogo" className="hover:text-brand-secondary transition-colors">O Cardápio</a></li>
                 <li><a href="#quem-somos" className="hover:text-brand-secondary transition-colors">A Nossa História</a></li>
                 <li><a href="#duvidas" className="hover:text-brand-secondary transition-colors">Perguntas Frequentes</a></li>
              </ul>
           </div>
           <div>
              <h5 className="text-white font-black text-xs uppercase tracking-[0.5em] mb-10 opacity-30">Fale Conosco</h5>
              <ul className="space-y-6 font-black text-sm">
                 <li className="flex items-center gap-5 text-white/80 transition-all hover:translate-x-2"><Phone size={20} className="text-brand-primary"/> {COMPANY_DATA.whatsapp}</li>
                 <li className="flex items-center gap-5 text-white/80 transition-all hover:translate-x-2"><MapPin size={20} className="text-brand-primary"/> {COMPANY_DATA.location}</li>
                 <li className="flex items-center gap-5 text-white/80 transition-all hover:translate-x-2"><Clock size={20} className="text-brand-primary"/> Seg - Sáb | 09h - 19h</li>
              </ul>
           </div>
           <div>
              <h5 className="text-white font-black text-xs uppercase tracking-[0.5em] mb-10 opacity-30">Segurança</h5>
              <div className="p-10 bg-white/5 rounded-[3rem] border-2 border-white/10 flex flex-col items-center gap-6 text-center group hover:bg-white/10 transition-all">
                 <ShieldCheck size={50} className="text-brand-secondary group-hover:scale-110 transition-transform" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-relaxed">Sua privacidade é lei aqui. Dados processados com segurança criptografada e LGPD.</p>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[11px] font-black uppercase tracking-[0.3em] opacity-30">
          <p>© {new Date().getFullYear()} {COMPANY_DATA.name} • Feito com amor em Niterói.</p>
          <div className="flex gap-12 items-center">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <button 
              onDoubleClick={() => { setIsAdminOpen(true); setIsLoggedIn(false); }}
              className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-white/10 transition-all text-white group"
              title="Painel Gestão"
            >
              <Settings size={18} className="group-hover:rotate-180 transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </footer>

      {/* MOBILE FLOATING CART */}
      {cartTotalItems > 0 && (
        <motion.button 
          initial={{ y: 100, scale: 0.5 }} 
          animate={{ y: 0, scale: 1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)} 
          className="fixed bottom-10 right-8 md:hidden z-40 bg-brand-primary text-white px-8 py-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(158,62,35,0.5)] flex items-center gap-6 font-black border-4 border-brand-accent/20"
        >
          <ShoppingBasket size={32} />
          <div className="flex flex-col items-start">
             <span className="text-[10px] opacity-60 uppercase tracking-widest leading-none mb-1">Seu Pedido</span>
             <span className="text-lg leading-none">{cartTotalItems} Itens</span>
          </div>
        </motion.button>
      )}
    </div>
  );
}
