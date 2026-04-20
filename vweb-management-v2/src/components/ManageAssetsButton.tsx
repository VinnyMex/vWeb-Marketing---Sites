"use client";

import { useState } from 'react';
import { Bot, X, Sparkles, Wand2, MessageSquare, Image as ImageIcon, Type } from 'lucide-react';

interface ManageAssetsButtonProps {
  siteId: string;
  siteName: string;
}

export function ManageAssetsButton({ siteId, siteName }: ManageAssetsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-zinc-950 hover:bg-white hover:text-black border border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] py-2 rounded-md transition-all group flex items-center justify-center gap-2"
      >
        <Bot className="w-3 h-3 group-hover:animate-bounce" />
        Gerenciar Ativos via IA &rarr;
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[2rem] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tighter">Gerenciado por <span className="text-blue-500">Antigravity IA</span></h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Conectado ao: {siteName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold">Imagens & Logos</h3>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed mb-4">Mude cores, troque imagens de fundo ou gere novos logos usando seu agente.</p>
                <div className="text-[10px] bg-blue-500/10 text-blue-400 p-3 rounded-lg border border-blue-500/20 italic">
                  "Mude a cor do tema para azul escuro e gere um logo minimalista."
                </div>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Type className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold">Textos & SEO</h3>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed mb-4">Reescreva chamadas (CTA) ou melhore o ranking do Google automaticamente.</p>
                <div className="text-[10px] bg-purple-500/10 text-purple-400 p-3 rounded-lg border border-purple-500/20 italic">
                  "Melhore o SEO para busca local de academias no Rio de Janeiro."
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col gap-6">
              <div className="flex items-center gap-2 text-zinc-100">
                <MessageSquare className="w-5 h-5" />
                <span className="font-bold">Como dar ordens para a IA:</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Eu sou o seu **Agente Antigravity**. Para modificar os ativos deste site, 
                basta me enviar uma mensagem aqui no chat com o comando: <br />
                <code className="bg-black text-blue-400 px-2 py-1 rounded mt-2 block font-mono text-center border border-white/5 py-4">
                  "Antigravity, altere o site **{siteId}**: [Sua instrução aqui]"
                </code>
              </p>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Eu entendi, vou enviar o comando!
              </button>
            </div>

            <div className="mt-8 flex justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
               <span>Isolamento Ativo</span>
               <span>•</span>
               <span>Multi-Site Security</span>
               <span>•</span>
               <span>vWeb Agent</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
