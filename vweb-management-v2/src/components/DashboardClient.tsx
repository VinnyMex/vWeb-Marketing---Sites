"use client";

import { useState } from 'react';
import { Plus, Wand2, X, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DashboardClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const res = await fetch('/api/sites/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: siteName }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro ao criar site');

      // Fechar modal e recarregar a página para ver o novo site
      setIsModalOpen(false);
      setSiteName('');
      router.refresh();
      
      // Mostrar feedback de sucesso (opcional, pode ser um toast)
      alert("Site criado com sucesso! Iniciando deploy em background...");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* Botão Novo Projeto */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-white hover:bg-zinc-200 text-black p-6 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Plus className="w-6 h-6 mb-1" />
        <span className="text-lg font-bold">Novo Projeto</span>
        <span className="text-[10px] items-center flex gap-1 font-bold uppercase text-zinc-500 group-hover:text-black transition-colors">
          Prompt IA <Wand2 className="w-3 h-3" />
        </span>
      </button>

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isCreating && setIsModalOpen(false)} />
          
          <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              disabled={isCreating}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Criar Novo Site</h2>
                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">Gerador de Instância IA</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Nome do Cliente ou Projeto</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Ex: Clinica Sorriso, Oficina do Ze..."
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={isCreating}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isCreating}
                className="bg-white text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    Gerar Site com IA &rarr;
                  </>
                )}
              </button>
              
              <p className="text-[9px] text-zinc-600 text-center uppercase tracking-tighter leading-relaxed">
                Ao clicar em gerar, o sistema irá criar uma estrutura isolada no Vercel, 
                configurar portas locais e preparar o ambiente de marketing IA.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
