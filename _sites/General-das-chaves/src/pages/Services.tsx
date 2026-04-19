import React from "react";
import { Link } from "react-router";
import { Car, Home, Shield, Smartphone, Key, Zap, Clock, Star, ArrowRight } from "lucide-react";
import { ServiceCard } from "../components/ServiceCard";
import { GlassCard } from "../components/GlassCard";
import { motion } from "motion/react";

/**
 * Services page component with detailed service list and interactive cards.
 */
export const Services: React.FC = () => {
  const services = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Chaves Automotivas",
      description: "Cópias de chaves codificadas, reparo de telecomandos e abertura de veículos de todas as marcas.",
      path: "/contato",
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Residencial & Comercial",
      description: "Abertura de portas, troca de segredos, instalação de fechaduras digitais e convencionais.",
      path: "/contato",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Cofres & Segurança",
      description: "Abertura técnica de cofres, manutenção preventiva e instalação de sistemas de alta segurança.",
      path: "/contato",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Fechaduras Digitais",
      description: "Venda e instalação das melhores marcas de fechaduras inteligentes com biometria e senha.",
      path: "/contato",
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: "Cópia de Chaves",
      description: "Cópias precisas de chaves residenciais, comerciais e automotivas com garantia de funcionamento.",
      path: "/contato",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Aberturas Técnicas",
      description: "Abertura de portas e veículos sem danos, utilizando ferramentas e técnicas especializadas.",
      path: "/contato",
    },
  ];

  return (
    <main className="pt-32 pb-24 px-6 bg-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-24 max-w-3xl">
          <span className="text-[#000000] font-black text-xs tracking-[0.3em] uppercase">
            NOSSOS SERVIÇOS
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-black leading-none tracking-tighter">
            SOLUÇÕES DE <br />
            <span className="text-primary italic">ALTA PRECISÃO</span>.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Oferecemos uma gama completa de serviços de chaveiro com tecnologia 
            de ponta e atendimento especializado para garantir a sua segurança.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
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

        {/* Features Section */}
        <div className="bg-black rounded-[40px] p-12 md:p-24 text-white overflow-hidden relative mb-32">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="flex flex-col gap-8">
              <span className="text-primary font-black text-xs tracking-[0.3em] uppercase">
                DIFERENCIAIS
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter">
                POR QUE <span className="text-primary italic">ESCOLHER</span> A GENERAL?
              </h2>
              <div className="flex flex-col gap-8">
                {[
                  { title: "Atendimento 24h", desc: "Estamos prontos para te atender a qualquer hora do dia ou da noite." },
                  { title: "Tecnologia de Ponta", desc: "Utilizamos os equipamentos mais modernos do mercado para codificação." },
                  { title: "Garantia Total", desc: "Todos os nossos serviços possuem garantia e suporte especializado." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-black text-white tracking-tight">{item.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden p-2 border border-white/10 glass-dark">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22521dd763?q=80&w=800&auto=format&fit=crop"
                  alt="Trabalho Técnico"
                  referrerPolicy="no-referrer"
                  className="w-full h-[500px] object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-black text-black leading-none tracking-tighter">
            PRECISA DE UM <span className="text-primary italic">ORÇAMENTO</span>?
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Fale com um de nossos especialistas agora mesmo e receba um orçamento 
            personalizado para o seu problema.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
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
              className="btn-futuristic btn-outline px-12 py-4 text-lg text-black"
            >
              FALAR POR E-MAIL
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
