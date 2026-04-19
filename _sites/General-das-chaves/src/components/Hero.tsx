import React from "react";
import { Link } from "react-router";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";
import { motion } from "motion/react";
import { VideoBackground } from "./VideoBackground";
import { ParticleBackground } from "./ParticleBackground";

/**
 * Hero component for the homepage with refined animations and glassmorphism.
 */
export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <VideoBackground
          src="/background.mp4"
          overlayOpacity={0.6}
        >
          {/* Particle Background */}
          <ParticleBackground />
        </VideoBackground>
      </div>

      <div className="relative z-10 w-full px-6 max-w-7xl mx-auto flex items-center justify-center mt-32 md:mt-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-0 -mt-[100px]"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-medium tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
              Tecnologia em Segurança Automotiva
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8">
              O FUTURO DAS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-500 italic">CHAVES</span>
            </h1>
            <p className="text-base md:text-lg lg:text-2xl text-white max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Especialistas em chaves codificadas, abertura de veículos e
              segurança residencial com a precisão que você merece.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/servicos"
              className="group relative px-8 py-4 bg-primary text-black font-bold text-sm uppercase tracking-widest rounded-full overflow-hidden transition-all hover:scale-105 flex items-center gap-2"
            >
              Nossos Serviços
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contato"
              className="px-8 py-4 bg-white/5 text-white font-bold text-sm uppercase tracking-widest rounded-full border border-white/10 backdrop-blur-md transition-all hover:bg-white/10"
            >
              Falar com Especialista
            </Link>
          </motion.div>

          {/* Refined Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl"
          >
            {[
              { icon: <Shield />, title: "Segurança Total", desc: "Criptografia avançada" },
              { icon: <Zap />, title: "Rapidez Extrema", desc: "Atendimento 24h" },
              { icon: <Clock />, title: "Experiência", desc: "Mais de 15 anos no mercado" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-sm">{item.title}</h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
