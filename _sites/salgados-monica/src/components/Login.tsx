import React from 'react';
import { X, LogIn, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
  onClose: () => void;
}

export default function Login({ onLogin, onClose }: LoginProps) {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-stone-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden border-4 border-brand-accent"
      >
        <div className="p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-brand-primary">
            <ShieldAlert size={40} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-brand-dark tracking-tighter">Área do Admin</h2>
            <p className="text-stone-500 font-bold">Acesso exclusivo para gestão do site.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
             <button 
                type="submit"
                className="w-full py-5 bg-brand-primary text-white rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-brand-dark transition-all active:scale-95"
              >
                <LogIn size={24} />
                ENTRAR AGORA
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="w-full py-4 text-stone-400 font-black text-xs uppercase tracking-widest hover:text-stone-600 transition-colors"
              >
                CANCELAR ACESSO
              </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
