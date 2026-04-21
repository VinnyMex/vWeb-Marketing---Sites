/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Settings,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, CustomerDetails, Order } from '../types';
import { CATEGORIES, COMPANY_DATA } from '../data';
import { db } from '../lib/db';
import { Link } from 'react-router';

export default function Home({ section }: { section?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearchError, setOrderSearchError] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails & { number?: string, cep?: string }>({
    phone: '',
    name: '',
    address: '',
    number: '',
    neighborhood: '',
    reference: '',
    date: '',
    time: '',
    observations: '',
    cep: ''
  });

  const handleCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '').slice(0, 8);
    setCustomerDetails(prev => ({ ...prev, cep: cleanCEP }));
    if (cleanCEP.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setCustomerDetails(prev => ({
            ...prev,
            address: data.logradouro,
            neighborhood: data.bairro,
          }));
          // Foca no número após o CEP preencher a rua
          setTimeout(() => document.getElementById('customer-number')?.focus(), 100);
        }
      } catch (e) {
        console.error('Erro ao buscar CEP:', e);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.init();
        const p = await db.getProducts();
        setProducts(p || []);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        // Em caso de erro crítico, tenta carregar os produtos padrão diretamente se possível
        // Mas o db.getProducts já deve retornar DEFAULT_PRODUCTS agora.
      }
    };
    loadData();

    const handleDbUpdate = async () => {
      const p = await db.getProducts();
      setProducts(p);
    };

    window.addEventListener('db-updated', handleDbUpdate);
    
    // Listeners para navegação móvel
    const handleToggleCart = () => setIsCartOpen(prev => !prev);
    const handleOpenEdit = () => setIsEditModalOpen(true);
    
    window.addEventListener('toggle-cart', handleToggleCart);
    window.addEventListener('open-edit-order', handleOpenEdit);

    return () => {
      window.removeEventListener('db-updated', handleDbUpdate);
      window.removeEventListener('toggle-cart', handleToggleCart);
      window.removeEventListener('open-edit-order', handleOpenEdit);
    };
  }, []);

  useEffect(() => {
    if (section) {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [section]);

  // Auto-fill for existing customers
  useEffect(() => {
    const checkCustomer = async () => {
        if (customerDetails.phone.length >= 10) {
            const existing = await db.getCustomerByPhone(customerDetails.phone);
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
    }
    checkCustomer();
  }, [customerDetails.phone]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = products;
    
    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.category === activeCategory);
    }
    
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      result = result.filter(p => {
        const nameNormalized = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const descNormalized = p.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const catNormalized = p.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // Mapeamento de termos comuns (ex: quibe matches kibe)
        const isKibe = (term.includes('quibe') || term.includes('kibe')) && 
                        (nameNormalized.includes('kibe') || nameNormalized.includes('quibe'));

        return nameNormalized.includes(term) || 
               descNormalized.includes(term) ||
               catNormalized.includes(term) ||
               isKibe;
      });
    }
    
    return result;
  }, [activeCategory, products, searchTerm]);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: cartTotalItems } }));
  }, [cartTotalItems]);

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

  const handleEditPendingOrder = async () => {
    const order = await db.getPendingOrderByPhone(editPhone.replace(/\D/g, ''));
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
      setOrderSearchError(true);
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

    let message = `*${editingOrderId ? 'ATUALIZACAO DE PEDIDO' : 'NOVO PEDIDO'} - ${COMPANY_DATA.name.toUpperCase()}*\n\n`;
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
    message += `_Pedido gerado via vWeb Salgados Mônica_`;

    window.open(`https://wa.me/${COMPANY_DATA.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    
    setCart([]);
    setEditingOrderId(null);
    setIsCartOpen(false);
    alert('Pedido enviado com sucesso!');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900 bg-white">
      <AnimatePresence>
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

      <AnimatePresence>
        {orderSearchError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-stone-900/90 backdrop-blur-md z-[70] flex items-center justify-center p-4">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-4 border-brand-primary text-center">
                <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
                  <Info size={40} />
                </div>
                <h3 className="text-3xl font-black text-brand-dark tracking-tighter mb-4">Pedido não encontrado</h3>
                <p className="text-stone-500 font-bold mb-8 leading-relaxed">Não encontramos nenhum pedido pendente para este número. Que tal começar um novo agora?</p>
                <div className="flex flex-col gap-3">
                   <button 
                    onClick={() => {
                      setOrderSearchError(false);
                      setIsEditModalOpen(false);
                      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black shadow-xl hover:bg-brand-dark transition-all"
                  >
                    FAZER NOVO PEDIDO
                  </button>
                   <button onClick={() => setOrderSearchError(false)} className="w-full py-5 bg-stone-100 text-stone-500 rounded-2xl font-black">TENTAR NOVAMENTE</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <main className="flex-grow">
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

        {/* Nossa Essência - Second section as requested */}
        <section id="quem-somos" className="py-32 bg-brand-cream border-y-8 border-brand-accent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 border-4 border-brand-primary rounded-full" />
            <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-brand-primary rounded-full" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="relative order-2 lg:order-1">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white group"
                  >
                    <img src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Destaque Salgados Mônica" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
                  </motion.div>
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-primary/10 rounded-full blur-[60px] -z-10 animate-pulse" />
                  
                  {/* Floating Detail */}
                  <div className="absolute -top-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border-4 border-brand-accent z-20 hidden md:block">
                    <p className="text-3xl font-black text-brand-primary italic">Desde 1998</p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Tradição de família</p>
                  </div>
                </div>
                
                <div className="space-y-10 text-center lg:text-left order-1 lg:order-2">
                  <div className="space-y-4">
                    <h3 className="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">Nossa Essência</h3>
                    <h2 className="text-5xl sm:text-7xl font-black text-brand-dark tracking-tighter leading-[0.85]">Amor em <br/><span className="text-brand-primary italic text-6xl sm:text-8xl">cada detalhe.</span></h2>
                  </div>
                  
                  <div className="space-y-6 text-stone-600 font-bold leading-relaxed text-lg lg:text-xl">
                    <p>
                      A história da <span className="text-brand-dark font-black">Salgados Mônica</span> começou em uma pequena cozinha em Niterói, impulsionada pela paixão em criar momentos de alegria através do paladar.
                    </p>
                    <p>
                      O que nos move é a satisfação de ver o sorriso em cada festa, a cada mordida. Não vendemos apenas salgados; entregamos o carinho de uma produção verdadeiramente artesanal, onde a massa é leve e os recheios são sempre generosos.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    {[
                      { title: "Missão", desc: "Levar sabor e qualidade artesanal para todas as celebrações de Niterói.", icon: <ShieldCheck className="text-brand-primary" /> },
                      { title: "Valores", desc: "Tradição, ingredientes selecionados e respeito total ao cliente.", icon: <Settings className="text-brand-primary" /> }
                    ].map((item, i) => (
                      <div key={i} className="p-8 bg-white rounded-3xl shadow-lg border-2 border-brand-accent flex gap-5 items-start text-left">
                        <div className="shrink-0 pt-1">{item.icon}</div>
                        <div>
                          <h4 className="font-black text-brand-dark uppercase tracking-tighter text-lg">{item.title}</h4>
                          <p className="text-sm text-stone-400 mt-2 font-medium leading-snug">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-10 pt-6">
                     <div className="flex flex-col items-center lg:items-start">
                        <h5 className="font-black text-brand-dark text-4xl tracking-tighter">25+</h5>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Anos de História</p>
                     </div>
                     <div className="w-px h-12 bg-brand-accent hidden sm:block" />
                     <div className="flex flex-col items-center lg:items-start">
                        <h5 className="font-black text-brand-dark text-4xl tracking-tighter">100%</h5>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Feito à Mão</p>
                     </div>
                     <div className="w-px h-12 bg-brand-accent hidden sm:block" />
                     <div className="flex flex-col items-center lg:items-start">
                        <h5 className="font-black text-brand-dark text-4xl tracking-tighter">Milhares</h5>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">De Pedidos</p>
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Nossos Diferenciais */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "Ingredientes Premium", desc: "Trabalhamos apenas com marcas líderes e processos rigorosos.", icon: "💎" },
                { title: "Massa de Batata", desc: "Nossa receita exclusiva leva batata de verdade, garantindo leveza.", icon: "🥔" },
                { title: "Entrega Pontual", desc: "Sabemos que o sucesso da sua festa depende do horário.", icon: "🛵" }
              ].map((diff, i) => (
                <div key={i} className="text-center group p-10 rounded-[3rem] hover:bg-brand-cream transition-all duration-500 border-2 border-transparent hover:border-brand-accent">
                  <div className="text-6xl mb-8 group-hover:scale-125 transition-transform duration-500 inline-block">{diff.icon}</div>
                  <h4 className="text-2xl font-black text-brand-dark mb-4 tracking-tighter uppercase">{diff.title}</h4>
                  <p className="text-stone-500 font-bold leading-relaxed">{diff.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section id="catalogo" className="py-32 bg-stone-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h3 className="text-brand-primary font-black text-xs uppercase tracking-[0.5em] mb-4">Catálogo Digital</h3>
              <h2 className="text-5xl sm:text-7xl font-black text-brand-dark tracking-tighter leading-none mb-12">Faça seu Pedido</h2>
              
              {/* Real-time Search and Compact Categories */}
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-stone-300 group-focus-within:text-brand-primary transition-colors">
                    <Search size={28} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Procure por coxinha, quibe, bolinho..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-20 pr-8 py-8 bg-white border-4 border-brand-accent rounded-[3rem] font-black text-2xl outline-none focus:border-brand-primary transition-all shadow-xl placeholder:text-stone-200"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute inset-y-0 right-8 flex items-center text-stone-300 hover:text-brand-primary transition-colors"
                    >
                      <X size={24} />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button 
                    onClick={() => setActiveCategory('Todos')} 
                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activeCategory === 'Todos' ? 'bg-brand-primary border-brand-primary text-white shadow-xl' : 'bg-white border-brand-accent text-stone-500 hover:border-brand-primary'}`}
                  >
                    Todos os Produtos
                  </button>
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)} 
                      className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activeCategory === cat ? 'bg-brand-primary border-brand-primary text-white shadow-xl' : 'bg-white border-brand-accent text-stone-500 hover:border-brand-primary'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Feedback */}
                <div className="pt-4 flex justify-center items-center gap-4">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                  </p>
                  {searchTerm && (
                    <div className="h-4 w-px bg-stone-200" />
                  )}
                  {searchTerm && (
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest italic">
                      Filtro: "{searchTerm}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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
                            <div className="mt-auto space-y-4">
                              {getProductQuantity(product.id) === 0 ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(product, 1);
                                  }}
                                  className="w-full h-14 bg-brand-primary text-white rounded-2xl shadow-lg font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center gap-2 group border-2 border-transparent hover:bg-brand-dark"
                                >
                                  <Plus size={18} strokeWidth={4} className="group-hover:rotate-90 transition-transform" /> 
                                  ADICIONAR
                                </button>
                              ) : (
                                <div className="flex items-center gap-4 bg-brand-cream px-2 rounded-2xl border-2 border-brand-accent shadow-inner h-12 relative group" onClick={(e) => e.stopPropagation()}>
                                  <input 
                                    type="number" 
                                    inputMode="numeric"
                                    min="0"
                                    placeholder="0"
                                    autoFocus
                                    value={getProductQuantity(product.id) || ''}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      updateQuantity(product, isNaN(val) ? 0 : val);
                                    }}
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    onFocus={(e) => {
                                      e.stopPropagation();
                                      e.target.select();
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-grow w-full bg-transparent border-none outline-none font-black text-xl text-center text-brand-dark placeholder:opacity-20"
                                  />
                                  <div className="absolute -top-3 left-4 bg-brand-primary text-white text-[7px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-md">Quantidade</div>
                                  
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(product, 0);
                                    }}
                                    className="absolute -right-2 -top-2 w-7 h-7 bg-white border-2 border-brand-accent text-brand-dark rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-500"
                                    aria-label="Remover do pedido"
                                  >
                                    <X size={12} strokeWidth={4} />
                                  </button>
                                </div>
                              )}
                                <p className="text-[8px] font-black uppercase text-center tracking-[0.2em] opacity-30 italic">
                                  {getProductQuantity(product.id) === 0 ? 'Escolha a quantidade' : 'Toque para alterar'}
                                </p>
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
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-32 text-center">
                 <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-8 text-stone-300">
                    <Search size={60} />
                 </div>
                 <h4 className="text-3xl font-black text-brand-dark tracking-tighter mb-4">Nenhuma delícia encontrada</h4>
                 <p className="text-stone-400 font-bold mb-10">Tente buscar por outro nome ou limpe os filtros.</p>
                 <button 
                    onClick={() => {setSearchTerm(''); setActiveCategory('Todos');}}
                    className="px-10 py-5 bg-brand-primary text-white rounded-2xl font-black shadow-xl hover:bg-brand-dark transition-all uppercase tracking-widest text-[10px]"
                  >
                    LIMPAR BUSCA
                  </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* FAQ - Dúvidas */}
        <section id="duvidas" className="py-32 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h3 className="text-brand-primary font-black text-xs uppercase tracking-[0.5em] mb-4">Suporte</h3>
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

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-stone-900/80 backdrop-blur-xl z-50" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-[60] shadow-2xl flex flex-col border-l-0 md:border-l-8 border-brand-primary">
              <div className="p-5 border-b-2 border-brand-accent flex items-center justify-between bg-brand-cream flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg"><ShoppingBasket size={24}/></div>
                  <h2 className="text-2xl font-black text-brand-dark tracking-tighter">Seu Carrinho</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white hover:bg-neutral-50 rounded-xl transition-all shadow-md group"><X size={20} className="group-hover:rotate-90 transition-transform" /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-5 space-y-6">
                {/* Itens do Carrinho - Agora no topo para melhor visibilidade */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Resumo dos Itens ({cart.length})</span>
                     {cart.length > 0 && (
                       <button onClick={() => { if(confirm('Esvaziar carrinho?')) setCart([]); }} className="text-[8px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">Esvaziar</button>
                     )}
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex gap-3 p-3 border-2 border-stone-100 rounded-[1.5rem] bg-stone-50/30 group hover:border-brand-primary transition-all duration-500">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border-2 border-white flex-shrink-0">
                           <img src={item.product.image} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" alt={item.product.name} />
                        </div>
                        <div className="flex-grow flex flex-col justify-center">
                          <h4 className="font-black text-brand-dark text-[13px] tracking-tighter leading-tight">{item.product.name}</h4>
                          <div className="flex justify-between items-center text-[9px] font-black mt-1">
                            <span className="text-brand-primary">R$ {((item.product.unit === 'cento' ? item.product.price / 100 : item.product.price) * item.quantity).toFixed(2)}</span>
                            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                               <input 
                                 type="number" 
                                 className="w-8 text-center font-black text-[10px] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                 value={item.quantity} 
                                 onChange={(e) => updateQuantity(item.product, parseInt(e.target.value) || 0)} 
                                 onWheel={(e) => (e.target as HTMLElement).blur()}
                                 onFocus={(e) => e.target.select()}
                               />
                               <span className="opacity-30">UNID.</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => updateQuantity(item.product, 0)} className="self-center p-2 text-stone-200 hover:text-red-500 transition-colors"><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Identificação e Entrega - Agora abaixo dos itens */}
                {cart.length > 0 && (
                  <details className="bg-brand-cream/60 rounded-[1.5rem] border-2 border-brand-accent shadow-inner group">
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                      <h3 className="text-[9px] font-black uppercase text-brand-primary tracking-[0.4em] flex items-center gap-3">
                        <Search size={14} /> Dados para Entrega
                      </h3>
                      <ChevronRight size={16} className="text-brand-primary transition-transform group-open:rotate-90" />
                    </summary>
                    
                    <div className="px-4 pb-6 space-y-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-brand-dark uppercase tracking-widest pl-1">WhatsApp</label>
                          <input type="tel" placeholder="21 98765-4321" value={customerDetails.phone} onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value.replace(/\D/g, '')})} className="w-full h-10 px-4 bg-white border-2 border-brand-accent rounded-lg outline-none focus:border-brand-primary transition-all font-bold text-xs" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-brand-dark uppercase tracking-widest pl-1">CEP</label>
                            <input 
                              type="tel" 
                              placeholder="00000-000" 
                              value={customerDetails.cep} 
                              onChange={(e) => handleCEP(e.target.value)} 
                              className="w-full h-10 px-4 bg-white border-2 border-brand-accent rounded-lg outline-none focus:border-brand-primary transition-all font-bold text-xs" 
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-brand-dark uppercase tracking-widest pl-1">Seu Nome</label>
                            <input type="text" placeholder="Seu nome" value={customerDetails.name} onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})} className="w-full h-10 px-4 bg-white border-2 border-brand-accent rounded-lg outline-none focus:border-brand-primary transition-all font-bold text-xs" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3">
                          <div className="col-span-3 space-y-1">
                            <label className="text-[8px] font-black text-brand-dark uppercase tracking-widest pl-1">Endereço / Rua</label>
                            <input type="text" placeholder="Rua" value={customerDetails.address} onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})} className="w-full h-10 px-4 bg-white border-2 border-brand-accent rounded-lg outline-none focus:border-brand-primary transition-all font-bold text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-brand-dark uppercase tracking-widest text-center block">Nº</label>
                            <input id="customer-number" type="text" placeholder="123" value={customerDetails.number} onChange={(e) => setCustomerDetails({...customerDetails, number: e.target.value})} className="w-full h-10 px-2 bg-white border-2 border-brand-accent rounded-lg outline-none focus:border-brand-primary transition-all font-bold text-xs text-center" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-brand-dark uppercase tracking-widest pl-1">Bairro</label>
                            <input type="text" placeholder="Bairro" value={customerDetails.neighborhood} onChange={(e) => setCustomerDetails({...customerDetails, neighborhood: e.target.value})} className="w-full h-10 px-4 bg-white border-2 border-brand-accent rounded-lg outline-none focus:border-brand-primary transition-all font-bold text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-brand-dark uppercase tracking-widest pl-1">Referência</label>
                            <input type="text" placeholder="Perto de onde?" value={customerDetails.reference} onChange={(e) => setCustomerDetails({...customerDetails, reference: e.target.value})} className="w-full h-10 px-4 bg-white border-2 border-brand-accent rounded-lg outline-none focus:border-brand-primary transition-all font-bold text-xs" />
                          </div>
                        </div>

                        <div className="pt-3 border-t-2 border-brand-accent/30 flex items-center justify-around bg-white/40 p-3 rounded-2xl">
                          {/* Calendário */}
                          <div 
                            onClick={(e) => {
                              try {
                                if (dateInputRef.current) {
                                  // @ts-ignore
                                  if (dateInputRef.current.showPicker) {
                                    // @ts-ignore
                                    dateInputRef.current.showPicker();
                                  } else {
                                    dateInputRef.current.click();
                                  }
                                }
                              } catch (err) {
                                dateInputRef.current?.focus();
                                dateInputRef.current?.click();
                              }
                            }}
                            className="relative flex flex-col items-center gap-1.5 cursor-pointer p-3 min-w-[80px] active:scale-95 transition-all group"
                          >
                             <input 
                               ref={dateInputRef}
                               type="date" 
                               min={new Date().toISOString().split('T')[0]}
                               value={customerDetails.date.includes('/') ? customerDetails.date.split('/').reverse().join('-') : ''} 
                               onChange={(e) => {
                                 if (!e.target.value) return;
                                 const d = e.target.value.split('-').reverse().join('/');
                                 setCustomerDetails({...customerDetails, date: d});
                               }} 
                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                             />
                             <div className={`w-16 h-16 rounded-2xl border-2 transition-all flex items-center justify-center pointer-events-none ${customerDetails.date ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/30 scale-105' : 'bg-white border-brand-accent text-brand-primary group-hover:border-brand-primary'}`}>
                                <Calendar size={32} />
                             </div>
                             <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest text-center pointer-events-none">
                               {customerDetails.date || 'Data'}
                             </span>
                          </div>

                          <div className="w-px h-12 bg-brand-accent/30" />

                          {/* Relógio */}
                          <div 
                            onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                            className="relative flex flex-col items-center gap-1.5 cursor-pointer p-3 min-w-[80px] active:scale-95 transition-all group"
                          >
                             <div className={`w-16 h-16 rounded-2xl border-2 transition-all flex items-center justify-center ${customerDetails.time ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/30 scale-105' : 'bg-white border-brand-accent text-brand-primary group-hover:border-brand-primary'}`}>
                                <Clock size={32} />
                             </div>
                             <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest text-center">
                               {customerDetails.time ? `${customerDetails.time.split(':')[0]}h` : 'Hora'}
                             </span>

                             <AnimatePresence>
                               {isTimePickerOpen && (
                                 <motion.div 
                                   initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                   animate={{ opacity: 1, y: 0, scale: 1 }}
                                   exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                   className="absolute bottom-full mb-4 right-0 bg-white border-4 border-brand-accent rounded-3xl shadow-2xl p-4 grid grid-cols-4 gap-2 z-[100] w-64 transform origin-bottom-right"
                                 >
                                    <div className="col-span-4 text-[10px] font-black text-brand-dark/50 uppercase tracking-widest mb-2 text-center">Escolha o Horário</div>
                                    {Array.from({ length: 15 }, (_, i) => i + 8).map(h => {
                                      const hourStr = h.toString().padStart(2, '0');
                                      const isSel = customerDetails.time?.startsWith(hourStr);
                                      return (
                                        <button 
                                          key={h}
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCustomerDetails({...customerDetails, time: `${hourStr}:00`});
                                            setIsTimePickerOpen(false);
                                          }}
                                          className={`py-3 rounded-xl text-xs font-black transition-all ${isSel ? 'bg-brand-primary text-white shadow-lg scale-110' : 'bg-brand-cream text-brand-dark hover:bg-brand-accent active:scale-95'}`}
                                        >
                                          {h}h
                                        </button>
                                      );
                                    })}
                                 </motion.div>
                               )}
                             </AnimatePresence>
                          </div>
                        </div>
                    </div>
                  </details>
                )}
              </div>

              <div className="p-5 border-t-2 border-brand-accent bg-brand-cream space-y-3 flex-shrink-0 pb-safe md:pb-5">
                {cart.length > 0 && (
                  <div className="bg-white px-4 py-2 rounded-xl border border-brand-accent flex gap-3 items-center shadow-sm">
                    <input type="checkbox" id="lgpd" checked={lgpdConsent} onChange={(e) => setLgpdConsent(e.target.checked)} className="w-4 h-4 rounded accent-brand-primary" />
                    <label htmlFor="lgpd" className="text-[8px] text-stone-500 leading-tight font-black uppercase tracking-wider">
                      Autorizo o salvamento dos meus dados (LGPD).
                    </label>
                  </div>
                )}

                <div className="flex justify-between items-end px-1 mb-2">
                   <div className="flex flex-col">
                      <span className="text-stone-400 font-black uppercase text-[7px] tracking-[0.2em]">Total Geral</span>
                      <span className="text-xl font-black text-brand-primary tracking-tighter">R$ {cartSubtotal.toFixed(2)}</span>
                   </div>
                </div>
                
                <button 
                  onClick={handleFinalizeOrder} 
                  disabled={!customerDetails.phone || !customerDetails.name || !customerDetails.date || cart.length === 0 || !lgpdConsent} 
                  className="w-full py-3 bg-brand-primary text-white rounded-xl font-black shadow-lg disabled:opacity-20 flex items-center justify-center gap-2 text-[10px] active:scale-95 transition-all hover:bg-brand-dark uppercase tracking-widest"
                >
                  <MessageCircle size={14} fill="currentColor" /> {editingOrderId ? 'ATUALIZAR MEU PEDIDO' : 'ENVIAR NO WHATSAPP'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="bg-brand-dark text-stone-500 py-32 mt-40 border-t-[12px] border-brand-primary px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
           <div className="col-span-1 md:col-span-1">
              <Link 
                to="/" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-20 h-20 bg-brand-primary rounded-[2rem] text-white font-black text-4xl mb-10 flex items-center justify-center shadow-2xl hover:rotate-12 transition-transform cursor-pointer"
              >
                M
              </Link>
              <h4 className="text-white font-black text-3xl tracking-tighter mb-6 uppercase italic">{COMPANY_DATA.name}</h4>
              <p className="font-bold leading-relaxed opacity-50 text-lg">Tradição, sabor e o carinho artesanal que sua festa merece.</p>
           </div>
           <div>
              <h5 className="text-white font-black text-xs uppercase tracking-[0.5em] mb-10 opacity-30">Explorar</h5>
              <ul className="space-y-6 font-black text-sm uppercase tracking-widest">
                 <li><a href="#catalogo" className="hover:text-brand-secondary transition-colors">O Cardapio</a></li>
                 <li><a href="#quem-somos" className="hover:text-brand-secondary transition-colors">A Nossa Historia</a></li>
                 <li><a href="#duvidas" className="hover:text-brand-secondary transition-colors">Perguntas Frequentes</a></li>
              </ul>
           </div>
           <div>
              <h5 className="text-white font-black text-xs uppercase tracking-[0.5em] mb-10 opacity-30">Fale Conosco</h5>
              <ul className="space-y-6 font-black text-sm">
                 <li className="flex items-center gap-5 text-white/80 transition-all hover:translate-x-2"><Phone size={20} className="text-brand-primary"/> {COMPANY_DATA.whatsapp}</li>
                 <li className="flex items-center gap-5 text-white/80 transition-all hover:translate-x-2"><MapPin size={20} className="text-brand-primary"/> {COMPANY_DATA.location}</li>
                 <li className="flex items-center gap-5 text-white/80 transition-all hover:translate-x-2"><Clock size={20} className="text-brand-primary"/> Seg - Sab | 09h - 19h</li>
              </ul>
           </div>
           <div>
              <h5 className="text-white font-black text-xs uppercase tracking-[0.5em] mb-10 opacity-30">Seguranca</h5>
              <div className="p-10 bg-white/5 rounded-[3rem] border-2 border-white/10 flex flex-col items-center gap-6 text-center group hover:bg-white/10 transition-all">
                 <ShieldCheck size={50} className="text-brand-secondary group-hover:scale-110 transition-transform" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-relaxed">Sua privacidade e lei aqui. Dados processados com seguranca criptografada e LGPD.</p>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[11px] font-black uppercase tracking-[0.3em] opacity-30">
          <p>© {new Date().getFullYear()} {COMPANY_DATA.name} • Feito com amor em Niteroi.</p>
          <div className="flex gap-12 items-center">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
