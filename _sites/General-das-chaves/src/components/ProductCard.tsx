import React from "react";
import { MessageCircle, Heart } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * ProductCard component for displaying a product in a grid.
 * @param image - The product image URL.
 * @param title - The product title.
 * @param price - The product price.
 * @param category - The product category.
 */
export const ProductCard: React.FC<{
  image: string;
  title: string;
  price: string;
  category: string;
}> = ({ image, title, price, category }) => {
  const whatsappUrl = `https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o produto: ${title}`;

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn-futuristic btn-primary flex items-center justify-center gap-2 py-3"
          >
            <MessageCircle className="w-5 h-5" />
            SOLICITAR ORÇAMENTO
          </a>
        </div>
      </div>
      
      <div className="p-6 flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black bg-primary/10 px-3 py-1 rounded-full w-fit">
          {category}
        </span>
        <h3 className="text-xl font-black text-black tracking-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-2xl font-black text-black">
          {price}
        </p>
      </div>
    </div>
  );
};
