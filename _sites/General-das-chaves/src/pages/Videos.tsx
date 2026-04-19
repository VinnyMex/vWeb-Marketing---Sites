import React, { useState } from "react";
import { Play, X, ChevronLeft, ChevronRight, Video as VideoIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Videos page component with institutional videos and demonstrations.
 */
export const Videos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const videos = [
    {
      url: "https://cdn.dribbble.com/userupload/18425928/file/original-77d3d2248b25dda4d60babdbade64bd4.mp4",
      title: "Programação Chave Porsche",
      thumbnail: "https://images.unsplash.com/photo-1614162692292-7ac66d7f7f1e?q=80&w=400&auto=format&fit=crop",
      duration: "02:45",
    },
    {
      url: "https://cdn.dribbble.com/userupload/18425928/file/original-77d3d2248b25dda4d60babdbade64bd4.mp4",
      title: "Demonstração BMW Display Key",
      thumbnail: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=400&auto=format&fit=crop",
      duration: "01:30",
    },
    {
      url: "https://cdn.dribbble.com/userupload/18425928/file/original-77d3d2248b25dda4d60babdbade64bd4.mp4",
      title: "Instalação Chave Ferrari",
      thumbnail: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=400&auto=format&fit=crop",
      duration: "03:15",
    },
    {
      url: "https://cdn.dribbble.com/userupload/18425928/file/original-77d3d2248b25dda4d60babdbade64bd4.mp4",
      title: "Segurança Mercedes-Benz AMG",
      thumbnail: "https://images.unsplash.com/photo-1603584173870-7f23fdae1872?q=80&w=400&auto=format&fit=crop",
      duration: "05:00",
    },
    {
      url: "https://cdn.dribbble.com/userupload/18425928/file/original-77d3d2248b25dda4d60babdbade64bd4.mp4",
      title: "Abertura Audi A8: Passo a Passo",
      thumbnail: "https://images.unsplash.com/photo-1619642751034-7b55df20883c?q=80&w=400&auto=format&fit=crop",
      duration: "02:10",
    },
    {
      url: "https://cdn.dribbble.com/userupload/18425928/file/original-77d3d2248b25dda4d60babdbade64bd4.mp4",
      title: "Detalhes Lamborghini",
      thumbnail: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=400&auto=format&fit=crop",
      duration: "01:45",
    },
  ];

  return (
    <main className="pt-32 pb-24 px-6 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-16 max-w-3xl">
          <span className="text-[#000000] font-black text-xs tracking-[0.3em] uppercase">
            CONTEÚDO EM VÍDEO
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-black leading-none tracking-tighter">
            VEJA NOSSA <br />
            <span className="text-primary italic">TECNOLOGIA</span> EM AÇÃO.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Assista aos nossos vídeos institucionais, demonstrações de 
            trabalho e dicas de segurança para o seu dia a dia.
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative aspect-video rounded-3xl overflow-hidden bg-gray-50 cursor-pointer"
              onClick={() => setSelectedVideo(idx)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-black scale-90 group-hover:scale-110 transition-transform duration-500">
                  <Play className="w-8 h-8 fill-current" />
                </div>
                <div className="flex flex-col items-center gap-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                  <span className="text-white font-black text-lg tracking-tight">
                    {video.title}
                  </span>
                  <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
                    Duração: {video.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Player Lightbox */}
        <AnimatePresence>
          {selectedVideo !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
            >
              <button
                className="absolute top-10 right-10 text-white hover:text-primary transition-colors"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="w-10 h-10" />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black"
              >
                <video
                  autoPlay
                  controls
                  className="w-full h-full object-contain"
                >
                  <source src={videos[selectedVideo].url} type="video/mp4" />
                </video>
                <div className="absolute bottom-10 left-10 p-8 glass-dark rounded-2xl border border-white/10 hidden md:block">
                  <h3 className="text-3xl font-black text-white tracking-tight">
                    {videos[selectedVideo].title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-primary font-bold text-xs uppercase tracking-widest">
                      General das Chaves - Vídeos
                    </span>
                    <div className="w-1 h-1 bg-white/30 rounded-full" />
                    <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
                      {videos[selectedVideo].duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Instagram Widget Section */}
        <div className="mt-24">
          <h2 className="text-4xl font-black text-black mb-12 tracking-tighter">
            Acompanhe nossos <span className="text-primary italic">Reels & Stories</span>
          </h2>
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            {/* 
              INSTRUÇÕES:
              1. Vá ao Instagram no seu computador.
              2. Abra o post (Reel ou foto) que deseja exibir.
              3. Clique nos três pontinhos (...) e selecione "Incorporar" (Embed).
              4. Copie o código fornecido e cole abaixo, substituindo este comentário.
            */}
            <div className="instagram-embed-container flex justify-center">
              {/* Cole o código de incorporação do Instagram aqui */}
              <p className="text-gray-500">Cole o código de incorporação do Instagram aqui.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
