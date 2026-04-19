import React, { useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { motion } from "motion/react";

/**
 * Products page component with catalog and filtering.
 */
export const Products: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = ["Todos", "Automotivo", "Residencial", "Segurança", "Acessórios"];

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
    {
      image: "https://images.unsplash.com/photo-1619642751034-7b55df20883c?q=80&w=400&auto=format&fit=crop",
      title: "Chave Audi A8",
      price: "R$ 1.350,00",
      category: "Automotivo",
    },
    {
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=400&auto=format&fit=crop",
      title: "Chave Lamborghini",
      price: "R$ 3.500,00",
      category: "Automotivo",
    },
    {
      image: "https://images.unsplash.com/photo-1606152421802-db860712e7a0?q=80&w=400&auto=format&fit=crop",
      title: "Chave Land Rover",
      price: "R$ 1.450,00",
      category: "Automotivo",
    },
    {
      image: "https://images.unsplash.com/photo-1591337676887-a210a696778f?q=80&w=400&auto=format&fit=crop",
      title: "Chave Maserati",
      price: "R$ 2.200,00",
      category: "Automotivo",
    },
  ];

  const filteredProducts = activeCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <main className="pt-32 pb-24 px-6 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-16 max-w-3xl">
          <span className="text-[#000000] font-black text-xs tracking-[0.3em] uppercase">
            NOSSO CATÁLOGO
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-black leading-none tracking-tighter">
            PRODUTOS DE <br />
            <span className="text-primary italic">ALTA QUALIDADE</span>.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Confira nossa seleção exclusiva de produtos para segurança 
            automotiva, residencial e comercial.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? "bg-primary text-black shadow-lg shadow-primary/20" 
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full bg-gray-50 border border-gray-100 rounded-full pl-14 pr-6 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {filteredProducts.map((product, idx) => (
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

        {/* Featured Banner */}
        <div className="bg-black rounded-[40px] p-12 md:p-24 text-white overflow-hidden relative flex flex-col lg:flex-row items-center gap-16">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://sider.ai/autoimage/futuristic-circuit-pattern')] opacity-5 pointer-events-none" />
          
          <div className="flex flex-col gap-8 flex-1 relative z-10">
            <span className="text-primary font-black text-xs tracking-[0.3em] uppercase">
              OFERTA EXCLUSIVA
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter">
              FECHADURAS <br />
              <span className="text-primary italic">DIGITAIS</span> COM 20% OFF.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              Garanta a segurança da sua casa com a tecnologia mais moderna do 
              mercado. Oferta válida por tempo limitado ou enquanto durarem os estoques.
            </p>
            <a 
              href="https://wa.me/5511999999999?text=Olá! Tenho interesse na oferta de fechaduras digitais com 20% OFF."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-futuristic btn-primary w-[225px] h-[80px] pt-[13px] pb-[10px] pl-[48px] text-center text-lg"
            >
              APROVEITAR AGORA
            </a>
          </div>

          <div className="relative flex-1">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden p-2 border border-white/10 glass-dark">
              <img
                src="https://sider.ai/autoimage/digital-door-lock-smart-luxury"
                alt="Fechadura Digital"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
