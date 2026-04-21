import React from 'react';
import { Home, ShoppingBag, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export default function MobileNav() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glassmorphism Background with strong border */}
      <div className="absolute inset-x-0 bottom-0 top-0 bg-white/90 backdrop-blur-xl border-t-2 border-stone-100 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] pb-safe" />
      
      <div className="relative flex justify-around items-center h-24 px-4 pb-safe">
        <Link 
          to="/catalogo" 
          className={`flex flex-col items-center justify-center gap-1.5 w-full h-full transition-all active:scale-90 ${location.pathname === '/catalogo' ? 'text-brand-primary' : 'text-stone-400'}`}
        >
          <div className={`p-3 rounded-full transition-all ${location.pathname === '/catalogo' ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-110' : 'bg-transparent'}`}>
            <Home size={location.pathname === '/catalogo' ? 28 : 32} strokeWidth={location.pathname === '/catalogo' ? 3 : 1.5} />
          </div>
          <span className={`text-[11px] font-black uppercase tracking-widest ${location.pathname === '/catalogo' ? 'opacity-100' : 'opacity-40'}`}>Cardápio</span>
        </Link>

        {/* Carrinho Trigger */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
          className="flex flex-col items-center justify-center gap-1.5 w-full h-full text-stone-400 group active:scale-90 transition-all"
        >
          <div className="p-3 rounded-full group-active:bg-brand-secondary/10 group-active:text-brand-secondary transition-all relative">
            <ShoppingBag size={32} strokeWidth={1.5} />
            {/* Simple notification dot - native feel */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-brand-primary rounded-full border-2 border-white animate-pulse" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest opacity-40">Carrinho</span>
        </button>

        <Link 
           to="/"
           onClick={() => {
             window.dispatchEvent(new CustomEvent('open-edit-order'));
           }}
           className="flex flex-col items-center justify-center gap-1.5 w-full h-full text-stone-400 active:scale-90 transition-all"
        >
          <div className="p-3 rounded-full">
            <ClipboardList size={32} strokeWidth={1.5} />
          </div>
          <span className={`text-[11px] font-black uppercase tracking-widest opacity-40 text-center`}>Pedidos</span>
        </Link>
      </div>
    </nav>
  );
}
