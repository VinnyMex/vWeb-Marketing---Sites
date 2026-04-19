import React, { useState } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Gallery page component with grid and lightbox.
 */
export const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    { url: "https://images.unsplash.com/photo-1614162692292-7ac66d7f7f1e?q=80&w=800&auto=format&fit=crop", title: "Chave Porsche Original" },
    { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop", title: "Chave BMW Display Key" },
    { url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop", title: "Chave Ferrari Exclusiva" },
    { url: "https://images.unsplash.com/photo-1603584173870-7f23fdae1872?q=80&w=800&auto=format&fit=crop", title: "Chave Mercedes-Benz AMG" },
    { url: "https://images.unsplash.com/photo-1619642751034-7b55df20883c?q=80&w=800&auto=format&fit=crop", title: "Chave Audi A8" },
    { url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800&auto=format&fit=crop", title: "Chave Lamborghini" },
    { url: "https://images.unsplash.com/photo-1606152421802-db860712e7a0?q=80&w=800&auto=format&fit=crop", title: "Chave Land Rover" },
    { url: "https://images.unsplash.com/photo-1591337676887-a210a696778f?q=80&w=800&auto=format&fit=crop", title: "Chave Maserati" },
    { url: "https://images.unsplash.com/photo-1581092160607-ee22521dd763?q=80&w=800&auto=format&fit=crop", title: "Ferramentas Profissionais" },
  ];

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  return (
    <main className="pt-32 pb-24 px-6 bg-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-16 max-w-3xl">
          <span className="text-[#000000] font-black text-xs tracking-[0.3em] uppercase">
            NOSSA GALERIA
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-black leading-none tracking-tighter">
            NOSSO TRABALHO EM <br />
            <span className="text-primary italic">DETALHES</span>.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Confira fotos reais de nossos serviços, bastidores e resultados 
            que garantem a satisfação de nossos clientes.
          </p>
        </div>

        {/* Placeholder para Widget do Instagram */}
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-16 text-center">
          <h2 className="text-2xl font-black mb-4 tracking-tight">Siga nosso Instagram</h2>
          <p className="text-gray-500 mb-8">Confira nossas atualizações em tempo real:</p>
          <div className="w-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
            <span className="text-gray-400 font-medium">Widget do Instagram (Cole seu código aqui)</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-gray-50 cursor-pointer"
              onClick={() => setSelectedImage(idx)}
            >
              <img
                src={img.url}
                alt={img.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                  <Maximize2 className="w-6 h-6" />
                </div>
                <span className="text-white font-black text-lg tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                  {img.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
            >
              <button
                className="absolute top-10 right-10 text-white hover:text-primary transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-10 h-10" />
              </button>

              <button
                className="absolute left-10 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors hidden md:block"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-16 h-16" />
              </button>

              <button
                className="absolute right-10 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors hidden md:block"
                onClick={handleNext}
              >
                <ChevronRight className="w-16 h-16" />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src={images[selectedImage].url}
                  alt={images[selectedImage].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-10 left-10 p-8 glass-dark rounded-2xl border border-white/10">
                  <h3 className="text-3xl font-black text-white tracking-tight">
                    {images[selectedImage].title}
                  </h3>
                  <p className="text-white/50 text-sm uppercase tracking-widest font-bold mt-2">
                    General das Chaves - Portfólio
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};
