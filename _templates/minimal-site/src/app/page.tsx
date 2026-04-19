import { MessageCircle, ArrowRight, Shield, Zap, Star } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">BRAND.SITE</div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-60">
            <a href="#features" className="hover:opacity-100 transition-opacity">Serviços</a>
            <a href="#about" className="hover:opacity-100 transition-opacity">Sobre</a>
            <a href="#contact" className="hover:opacity-100 transition-opacity">Contato</a>
          </div>
          <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all">
            Falar Conosco
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-xs font-bold tracking-widest uppercase mb-8">
            <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
            Qualidade Premium
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
            Elevando a sua marca para o <br />
            <span className="text-black/40 italic">próximo nível digital.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-black/60 mb-12 leading-relaxed">
            Soluções minimalistas, eficientes e focadas em conversão. Desenvolvemos interfaces que inspiram confiança e geram resultados reais para o seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-black/20 transition-all">
              Começar Agora <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto border border-black/10 bg-white px-8 py-4 rounded-2xl font-bold hover:bg-black/5 transition-all">
              Ver Portfólio
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Shield, title: "Segurança Total", desc: "Sistemas robustos e protegidos para garantir a integridade dos seus dados." },
              { icon: Zap, title: "Velocidade Extrema", desc: "Carregamento instantâneo em qualquer dispositivo e conexão." },
              { icon: Star, title: "Design Exclusivo", desc: "Cada detalhe pensado para transmitir a essência da sua marca." }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-black/5 hover:border-black/10 hover:bg-[#fafafa] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-black/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Floating */}
      <a 
        href="https://wa.me/5521999999999" 
        target="_blank"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* Footer */}
      <footer className="py-12 border-t border-black/5 text-center text-sm text-black/40">
        <p>&copy; 2026 BRAND.SITE - Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
