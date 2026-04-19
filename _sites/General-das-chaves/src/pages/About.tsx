import React from "react";
import { Shield, Target, Eye, Users, Star, Award, CheckCircle, Zap, Key } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { motion } from "motion/react";

/**
 * About page component with history, mission, vision, and values.
 */
export const About: React.FC = () => {
  const values = [
    { icon: <Shield />, title: "Segurança", desc: "Sua proteção é nossa prioridade absoluta." },
    { icon: <Zap className="text-primary" />, title: "Agilidade", desc: "Respostas rápidas para situações críticas." },
    { icon: <Star />, title: "Qualidade", desc: "Excelência em cada serviço prestado." },
    { icon: <Users />, title: "Confiança", desc: "Relacionamentos sólidos e transparentes." },
  ];

  return (
    <main className="pt-32 pb-24 px-6 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-24 max-w-3xl">
          <span className="text-[#000000] font-black text-xs tracking-[0.3em] uppercase">
            NOSSA HISTÓRIA
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-black leading-none tracking-tighter">
            TRADIÇÃO QUE <br />
            <span className="text-primary italic">INOVA</span> O MERCADO.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Há mais de 15 anos, a General das Chaves vem sendo referência em 
            soluções de segurança. O que começou como um pequeno negócio familiar 
            evoluiu para uma empresa líder em tecnologia automotiva e residencial.
          </p>
        </div>

        {/* Mission/Vision/Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <GlassCard className="flex flex-col gap-6 bg-gray-50 border-none">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-black">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-black tracking-tight">Missão</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Proporcionar segurança e tranquilidade aos nossos clientes através 
              de soluções tecnológicas inovadoras e atendimento de excelência.
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col gap-6 bg-gray-50 border-none">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-black">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-black tracking-tight">Visão</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Ser reconhecida como a melhor e mais tecnológica empresa de 
              segurança e chaves do país, liderando a inovação no setor.
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col gap-6 bg-gray-50 border-none">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-black">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-black tracking-tight">Valores</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Ética, transparência, inovação constante, foco no cliente e 
              compromisso com a segurança total.
            </p>
          </GlassCard>
        </div>

        {/* Team/Culture Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden p-2 border border-gray-100 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22521dd763?q=80&w=800&auto=format&fit=crop"
                alt="Nossa Equipe"
                referrerPolicy="no-referrer"
                className="w-full h-[500px] object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <span className="text-[#000000] font-black text-xs tracking-[0.3em] uppercase">
              NOSSA EQUIPE
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-black leading-none tracking-tighter">
              PROFISSIONAIS <br />
              <span className="text-primary italic">CERTIFICADOS</span> E TREINADOS.
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Nossa equipe é composta por especialistas altamente qualificados, 
              constantemente atualizados com as novas tecnologias de chaves 
              codificadas e sistemas de segurança.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                "Treinamento Contínuo",
                "Certificações Internacionais",
                "Equipamentos de Ponta",
                "Atendimento Humanizado",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-125 transition-transform">
                    <Key className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-black font-bold text-sm tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-black rounded-[40px] p-12 md:p-24 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop')] opacity-5 pointer-events-none" />
          
          <div className="flex flex-col items-center text-center gap-4 mb-16 relative z-10">
            <span className="text-primary font-black text-xs tracking-[0.3em] uppercase">
              CULTURA ORGANIZACIONAL
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter">
              NOSSOS <span className="text-primary italic">VALORES</span> FUNDAMENTAIS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center gap-6 p-8 rounded-3xl glass-dark border border-white/5 hover:border-primary/30 transition-all group"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-black text-white tracking-tight">{value.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
