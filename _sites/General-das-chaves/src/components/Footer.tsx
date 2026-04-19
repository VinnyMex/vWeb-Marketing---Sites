import React from "react";
import { Link } from "react-router";
import { Key, Instagram, Facebook, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

/**
 * Footer component with dark, futuristic look and useful links.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 border-t border-white/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 -mt-[50px] mb-[10px]">
        {/* Brand Section */}
        <div className="flex flex-col gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="General das Chaves" className="w-32 h-auto group-hover:scale-105 transition-transform" />
          </Link>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Líder em tecnologia de segurança automotiva e residencial. 
            Soluções inovadoras para proteger o que é mais importante para você.
          </p>
          <div className="flex items-center gap-4">
            {[Instagram, Facebook, Mail].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-primary hover:bg-white/10 transition-all border border-white/5"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-8">
          <h3 className="text-lg font-black tracking-widest text-primary uppercase">
            NAVEGAÇÃO
          </h3>
          <nav className="flex flex-col gap-4">
            {["Sobre", "Serviços", "Produtos", "Galeria", "Vídeos", "Blog"].map((link) => (
              <Link
                key={link}
                to={`/${link.toLowerCase()}`}
                className="text-white/50 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                {link}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-8">
          <h3 className="text-lg font-black tracking-widest text-primary uppercase">
            CONTATO
          </h3>
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold">Telefone</span>
                <span className="text-white/50 text-sm">(11) 99999-9999</span>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="w-[60px] h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold">Endereço</span>
                <span className="text-white/50 text-sm">Cep 24030-060, Rua Marechal Deodoro, 295 - Loja 102 Niterói-RJ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-white/30 text-xs font-medium uppercase tracking-widest">
        <span className="text-[10px] text-center">© 2026 GENERAL DAS CHAVES. TODOS OS DIREITOS RESERVADOS - vMex Web Marketing.</span>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-white transition-colors text-[10px]">POLÍTICA DE PRIVACIDADE</a>
          <a href="#" className="hover:text-white transition-colors text-[10px]">TERMOS DE USO</a>
        </div>
      </div>
    </footer>
  );
};
