import React from "react";
import { Link } from "react-router";
import { Shield, Zap, Clock, Key, Car, Home as HomeIcon, Smartphone, ArrowRight, Star } from "lucide-react";
import { Hero } from "../components/Hero";
import { ServiceCard } from "../components/ServiceCard";
import { ProductCard } from "../components/ProductCard";
import { GlassCard } from "../components/GlassCard";
import { motion } from "motion/react";

/**
 * Home page component with Hero and key sections.
 */
export const Home: React.FC = () => {
  const services = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Chaves Automotivas",
      description: "Cópias de chaves codificadas, reparo de telecomandos e abertura de veículos de todas as marcas.",
      path: "/servicos",
    },
    {
      icon: <HomeIcon className="w-8 h-8" />,
      title: "Residencial & Comercial",
      description: "Abertura de portas, troca de segredos, instalação de fechaduras digitais e convencionais.",
      path: "/servicos",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Cofres & Segurança",
      description: "Abertura técnica de cofres, manutenção preventiva e instalação de sistemas de alta segurança.",
      path: "/servicos",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Fechaduras Digitais",
      description: "Venda e instalação das melhores marcas de fechaduras inteligentes com biometria e senha.",
      path: "/servicos",
    },
  ];

  const products = [
    {
      image: "https://images.unsplash.com/photo-1614162692292-7ac66d7f7f1e?q=80&w=400&auto=format&fit=crop",
      title: "Chave Porsche Original",
      price: "R$ 1.890,00",
      category: "Automotivo",
    },
    {
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=400&auto=format&fit=crop",
      title: "Chave BMW Display Key",
      price: "R$ 2.450,00",
      category: "Automotivo",
    },
    {
      image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=400&auto=format&fit=crop",
      title: "Chave Ferrari Exclusiva",
      price: "R$ 3.100,00",
      category: "Automotivo",
    },
    {
      image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1872?q=80&w=400&auto=format&fit=crop",
      title: "Chave Mercedes-Benz AMG",
      price: "R$ 1.550,00",
      category: "Automotivo",
    },
  ];

  return (
    <main className="w-full">
      <Hero />

      {/* Services Section */}
      <section className="py-24 px-6 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="flex flex-col gap-4 max-w-2xl -mt-[100px]">
              <span className="px-4 pl-0 pt-[6px] mt-[20px] mb-[0px] text-black font-black text-xs tracking-[0.3em] uppercase">
                O QUE FAZEMOS
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-black leading-none tracking-tighter">
                SOLUÇÕES COMPLETAS EM <br />
                <span className="text-primary italic">SEGURANÇA</span>
              </h2>
            </div>
            <Link
              to="/servicos"
              className="text-black font-bold flex items-center gap-2 group hover:text-primary transition-colors"
            >
              VER TODOS OS SERVIÇOS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 px-6 bg-black text-white overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden glass-dark p-2 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1591337676887-a210a696778f?q=80&w=800&auto=format&fit=crop"
                alt="Workshop"
                referrerPolicy="no-referrer"
                className="w-full h-[500px] object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-10 left-10 p-8 glass-dark rounded-2xl border border-white/10 flex items-center gap-6 w-[270px] h-[135px] pl-[32px] pr-[32px] mr-0 -mb-[20px] mt-0 -ml-[20px]">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-primary">15+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Anos de Mercado</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-primary">10k+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Clientes Felizes</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8 -mt-[20px]"
          >
            <span className="text-primary font-black text-xs tracking-[0.3em] uppercase">
              QUEM SOMOS
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter">
              A GENERAL DAS CHAVES <br />
              <span className="text-primary italic">LIDERANDO</span> O FUTURO.
            </h2>
            <p className="text-white/60 leading-relaxed text-lg">
              Nascemos com o propósito de transformar o mercado de chaveiros, 
              trazendo tecnologia de ponta e atendimento especializado para 
              garantir a sua tranquilidade.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Atendimento 24 horas em toda a região",
                "Equipamentos de última geração para codificação",
                "Profissionais certificados e treinados",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="w-6 h-6 mt-1 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-125 transition-transform">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-white/80 font-medium leading-tight">{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/sobre"
              className="btn-futuristic btn-primary w-fit mt-[15px] mb-0 mr-0 ml-[18px]"
            >
              CONHEÇA NOSSA HISTÓRIA
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 px-6 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center gap-4 mb-16 ml-0 -mt-[50px]">
            <span className="text-black font-black text-xs tracking-[0.3em] uppercase">
              NOSSOS PRODUTOS
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-black leading-none tracking-tighter">
              PRODUTOS EM <span className="text-primary italic">DESTAQUE</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="bg-black text-white overflow-hidden relative flex flex-col items-center text-center gap-8 py-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop')] opacity-5 pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
            
            <span className="text-primary font-black text-base tracking-[0.3em] uppercase relative z-10">
              ESTÁ PRECISANDO DE AJUDA?
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter relative z-10">
              ATENDIMENTO <span className="text-primary italic">IMEDIATO</span> <br />
              24 HORAS POR DIA.
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto relative z-10">
              Não importa a hora ou o lugar, nossa equipe está pronta para te atender. 
              Chame agora no WhatsApp e resolva seu problema em minutos.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-futuristic btn-primary px-12 py-4 text-lg"
              >
                CHAMAR NO WHATSAPP
              </a>
              <Link
                to="/contato"
                className="btn-futuristic btn-outline px-12 py-4 text-lg"
              >
                VER LOCALIZAÇÃO
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
};
