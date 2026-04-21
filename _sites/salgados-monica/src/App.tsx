import React, { useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate, Link } from 'react-router';
import { ShoppingBasket } from 'lucide-react';
import Home from './pages/Home';
import Admin from './pages/Admin';
import MobileNav from './components/MobileNav';

/**
 * ScrollToTop component that scrolls the window to the top on route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppContent() {
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const [cartCount, setCartCount] = React.useState(0);

  useEffect(() => {
    const handleUpdate = (e: any) => setCartCount(e.detail?.count || 0);
    window.addEventListener('cart-updated', handleUpdate);
    return () => window.removeEventListener('cart-updated', handleUpdate);
  }, []);

  const handleStartPress = () => {
    const isAtAdmin = window.location.hash.includes('/admin');
    // 3 seconds long press
    timerRef.current = window.setTimeout(() => {
      navigate(isAtAdmin ? '/' : '/admin');
    }, 3000);
  };

  const handleEndPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-32 md:pb-0 font-sans">
      <ScrollToTop />
      
      {/* Fixed Native Header - Global for all pages */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-brand-primary text-white z-50 flex items-center justify-between px-6 shadow-xl border-b-2 border-white/5">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-primary font-black text-2xl shadow-lg hover:rotate-12 transition-transform cursor-pointer">
            M
          </Link>
          <div className="flex flex-col">
            <h1 className="text-lg font-black text-white tracking-tighter leading-none uppercase italic">Salgados Mônica</h1>
            <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Artesanal & Tradicional</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/catalogo" className="font-black hover:text-brand-secondary transition-colors text-[10px] uppercase tracking-widest border-b-2 border-transparent hover:border-brand-secondary pb-1">Cardápio</Link>
          <Link to="/nossa-historia" className="font-black hover:text-brand-secondary transition-colors text-[10px] uppercase tracking-widest border-b-2 border-transparent hover:border-brand-secondary pb-1">Nossa História</Link>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-edit-order'))}
            className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[9px] uppercase tracking-widest border-2 border-white/5 transition-all"
          >
            Editar Pedido
          </button>
        </nav>

        <div className="flex items-center gap-3">
           <button 
             onMouseDown={handleStartPress}
             onMouseUp={handleEndPress}
             onMouseLeave={handleEndPress}
             onTouchStart={handleStartPress}
             onTouchEnd={handleEndPress}
             className="w-12 h-12 bg-white/10 rounded-full border-2 border-white/20 flex items-center justify-center transition-all active:scale-110 active:bg-white/20 group cursor-pointer touch-none"
             aria-label="Admin Access (Long Press)"
             title="Online (Toque e segure para gerenciar)"
           >
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse group-hover:scale-125 transition-transform" />
           </button>
           
           <button 
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))} 
                className="relative p-3 bg-white/10 rounded-xl active:scale-90 transition-all font-black text-[10px] flex items-center justify-center"
              >
                <ShoppingBasket size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-brand-primary text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg">
                    {cartCount}
                  </span>
                )}
           </button>
        </div>
      </header>

      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Home section="catalogo" />} />
          <Route path="/nossa-historia" element={<Home section="quem-somos" />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
