import { readdirSync, existsSync, readFileSync } from "fs";
import path from "path";
import Link from "next/link";

interface SiteMetadata {
  name?: string;
  description?: string;
}

export default function Home() {
  const sitesPath = path.join(process.cwd(), "..", "_sites");
  let sites: { id: string; name: string; description: string }[] = [];

  try {
    if (existsSync(sitesPath)) {
      const dirs = readdirSync(sitesPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      sites = dirs.map((id) => {
        const metadataPath = path.join(sitesPath, id, "metadata.json");
        let name = id;
        let description = "Nenhuma descrição disponível.";

        if (existsSync(metadataPath)) {
          const metadata: SiteMetadata = JSON.parse(readFileSync(metadataPath, "utf-8"));
          name = metadata.name || id;
          description = metadata.description || description;
        }

        return { id, name, description };
      });
    }
  } catch (error) {
    console.error("Erro ao carregar sites:", error);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto py-16 px-8 flex flex-col gap-12">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-2xl font-black">V</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase">
              vWeb Marketing <span className="text-blue-500">Hub</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Gerenciamento centralizado de sites de marketing de alta performance. 
            Controle implantações, identidades visuais e pedidos de edição via IA.
          </p>
        </header>

        {/* Stats / Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
            <p className="text-zinc-500 text-sm font-medium uppercase mb-1">Sites Ativos</p>
            <p className="text-3xl font-bold">{sites.length}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
            <p className="text-zinc-500 text-sm font-medium uppercase mb-1">Infraestrutura</p>
            <p className="text-3xl font-bold text-green-400">Online</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 transition-colors p-6 rounded-2xl flex flex-col justify-center items-center gap-2 group">
             <span className="text-xl font-bold">Criar Novo Site</span>
             <span className="text-sm text-blue-200 group-hover:translate-x-1 transition-transform">Inicie um projeto de cliente &rarr;</span>
          </button>
        </div>

        {/* Sites Grid */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold border-b border-zinc-800 pb-2">Projetos em Produção</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <div 
                key={site.id} 
                className="group bg-zinc-950 border border-zinc-900 hover:border-blue-500/50 p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                   <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center font-bold text-zinc-400 group-hover:text-blue-400 transition-colors">
                     {site.id.substring(0, 2).toUpperCase()}
                   </div>
                   <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-1 rounded uppercase tracking-wider">Dev Port: {site.id === 'General-das-chaves' ? '3007' : 'Auto'}</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-zinc-200 group-hover:text-white transition-colors">{site.name}</h3>
                  <p className="text-zinc-500 text-sm line-clamp-2 mt-2">{site.description}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold py-2 rounded-lg transition-colors">
                    Gerenciar via IA
                  </button>
                  <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold py-2 rounded-lg transition-colors">
                    Visualizar Site
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-8 text-center text-zinc-600 text-xs tracking-widest uppercase">
        vWeb Marketing Systems &copy; 2026 | Antigravity AI Engine
      </footer>
    </div>
  );
}
