import React from "react";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Send, MessageCircle } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { motion } from "motion/react";

/**
 * Contact page component with form and location info.
 */
export const Contact: React.FC = () => {
  return (
    <main className="pt-32 pb-24 px-6 bg-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-16 max-w-3xl">
          <span className="text-[#000000] font-black text-xs tracking-[0.3em] uppercase">
            FALE CONOSCO
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-black leading-none tracking-tighter">
            ESTAMOS <br />
            <span className="text-primary italic">PRONTOS</span> PARA AJUDAR.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Entre em contato conosco para orçamentos, dúvidas ou emergências. 
            Nossa equipe está disponível 24 horas por dia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-32">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center mb-8">
              <h3 className="text-2xl font-black mb-4 tracking-tight">Avaliações Google</h3>
              <p className="text-gray-500 mb-8">Veja o que nossos clientes dizem:</p>
              <div className="w-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
                <span className="text-gray-400 font-medium">Widget Google (Cole seu código aqui)</span>
              </div>
            </div>
            <GlassCard className="bg-gray-50 border-none p-12">
              <form className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-black/40 ml-4">Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Ex: João Silva"
                      className="bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-black/40 ml-4">E-mail</label>
                    <input
                      type="email"
                      placeholder="Ex: joao@email.com"
                      className="bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-black/40 ml-4">Telefone</label>
                    <input
                      type="tel"
                      placeholder="Ex: (11) 99999-9999"
                      className="bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-black/40 ml-4">Assunto</label>
                    <select className="bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm appearance-none">
                      <option>Orçamento</option>
                      <option>Emergência</option>
                      <option>Dúvida Técnica</option>
                      <option>Outros</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-black/40 ml-4">Mensagem</label>
                  <textarea
                    rows={5}
                    placeholder="Como podemos te ajudar?"
                    className="bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm resize-none"
                  />
                </div>

                <button className="btn-futuristic btn-primary py-4 text-lg flex items-center justify-center gap-3">
                  ENVIAR MENSAGEM
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-12"
          >
            <div className="grid grid-cols-1 gap-8">
              {[
                { icon: <Phone />, title: "Telefone", desc: "(11) 99999-9999", link: "tel:11999999999" },
                { icon: <MessageCircle />, title: "WhatsApp", desc: "(11) 98888-8888", link: "https://wa.me/5511988888888" },
                { icon: <Mail />, title: "E-mail", desc: "contato@generaldaschaves.com.br", link: "mailto:contato@generaldaschaves.com.br" },
                { icon: <Clock />, title: "Atendimento", desc: "24 Horas / 7 Dias", link: "#" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50 hover:bg-primary hover:text-black transition-all group max-w-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary group-hover:bg-black group-hover:text-primary transition-colors shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest text-black/40 group-hover:text-black/60">
                      {item.title}
                    </span>
                    <div className="w-8 h-1 bg-primary my-1 rounded-full" />
                    <span className="text-md font-black tracking-tight">
                      {item.desc}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-black text-black tracking-tight">Redes Sociais</h3>
              <div className="flex items-center gap-4">
                {[Instagram, Facebook, Mail].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-black transition-all border border-gray-100"
                  >
                    <Icon className="w-7 h-7" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-black text-black tracking-tight">Nossa Localização</h3>
              <div className="w-full h-64 rounded-3xl overflow-hidden border border-gray-100 grayscale hover:grayscale-0 transition-all duration-700">
                <iframe
                  src="https://maps.google.com/maps?q=Rua%20Marechal%20Deodoro%2C%20295%2C%20Niter%C3%B3i%20-%20RJ%2C%2024030-060&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </main>
  );
};
