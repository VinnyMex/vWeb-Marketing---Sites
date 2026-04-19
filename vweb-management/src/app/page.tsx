import { readdirSync, existsSync, readFileSync, statSync } from "fs";
import path from "path";

interface SiteMetadata {
  name?: string;
  description?: string;
}

interface SiteInfo {
  id: string;
  name: string;
  description: string;
  framework: string;
  filesCount: number;
  port: number;
  status: 'online' | 'offline';
}

function countFiles(dir: string): number {
  let count = 0;
  if (!existsSync(dir)) return 0;
  const files = readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === 'dist' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      count += countFiles(fullPath);
    } else {
      count++;
    }
  }
  return count;
}

export default function Home() {
  const sitesPath = path.join(process.cwd(), "..", "_sites");
  let sites: SiteInfo[] = [];

  try {
    if (existsSync(sitesPath)) {
      const dirs = readdirSync(sitesPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      sites = dirs.map((id) => {
        const fullSitePath = path.join(sitesPath, id);
        const metadataPath = path.join(fullSitePath, "metadata.json");
        const packageJsonPath = path.join(fullSitePath, "package.json");
        
        let name = id;
        let description = "Site gerenciado pela plataforma marketing.";
        let framework = "Desconhecido";
        let port = 0;
        
        // Nome e Descrição do metadata.json
        if (existsSync(metadataPath)) {
          const metadata: SiteMetadata = JSON.parse(readFileSync(metadataPath, "utf-8"));
          name = metadata.name || id;
          description = metadata.description || description;
        }

        // Framework e Porta do package.json
        if (existsSync(packageJsonPath)) {
          const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
          const deps = { ...pkg.dependencies, ...pkg.devDependencies };
          if (deps.next) framework = "Next.js";
          else if (deps.vite) framework = "Vite/React";

          const devScript = pkg.scripts?.dev || "";
          const portMatch = devScript.match(/--port=(\d+)/) || devScript.match(/-p (\d+)/);
          port = portMatch ? parseInt(portMatch[1]) : (framework === 'Next.js' ? 3000 : 5173);
        }

        const filesCount = countFiles(fullSitePath);

        return { 
          id, 
          name, 
          description, 
          framework, 
          filesCount, 
          port,
          status: 'online' // Assumimos online se carregar
        };
      });
    }
  } catch (error) {
    console.error("Erro ao carregar sites:", error);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto py-16 px-8 flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-2xl font-black">V</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase">
              vWeb Marketing <span className="text-blue-500">Hub</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl font-light">
            Painel de controle centralizado para orquestração de sites e ativos digitais.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Projetos</p>
            <p className="text-3xl font-bold">{sites.length}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Sistema</p>
            <p className="text-3xl font-bold text-green-400">Ativo</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Arquivos Totais</p>
            <p className="text-3xl font-bold">{sites.reduce((acc, s) => acc + s.filesCount, 0)}</p>
          </div>
          <button className="bg-white hover:bg-zinc-200 text-black p-6 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all">
             <span className="text-lg font-bold">Novo Projeto</span>
             <span className="text-[10px] items-center flex gap-1 font-bold uppercase">Prompt IA &rarr;</span>
          </button>
        </div>

        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
             <h2 className="text-2xl font-bold tracking-tight">Sites do Ecossistema</h2>
             <span className="text-zinc-500 text-sm font-medium">Sincronizado com GitHub</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sites.map((site) => (
              <div 
                key={site.id} 
                className="group bg-zinc-950 border border-zinc-900 hover:border-blue-500/50 rounded-2xl transition-all duration-500 flex flex-col overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                   <img 
                      src={`/thumbnails/${site.id}.png`} 
                      alt={site.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100 bg-zinc-800"
                   />
                   <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold border border-white/10 uppercase tracking-tighter">
                     {site.framework}
                   </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-zinc-100 group-hover:text-white transition-colors">{site.name}</h3>
                    <p className="text-zinc-500 text-sm mt-3 leading-relaxed min-h-[40px] line-clamp-2">{site.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 uppercase border-y border-zinc-900 py-3 mt-2 tracking-widest">
                    <span>{site.filesCount} Arquivos</span>
                    <span className="flex items-center gap-1.5 font-black text-white">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Porta: {site.port}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <a 
                      href={`#`} 
                      className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-[11px] font-black uppercase tracking-widest py-3 rounded-lg text-center transition-all border border-transparent hover:border-zinc-700"
                    >
                      Editar IA
                    </a>
                    <a 
                      href={`http://localhost:${site.port}`} 
                      target="_blank" 
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-[11px] font-black uppercase tracking-widest py-3 rounded-lg text-center transition-all shadow-lg shadow-blue-500/10"
                    >
                      Visualizar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-16 px-8 text-center">
        <p className="text-zinc-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-4">vWeb Marketing Systems &copy; 2026</p>
        <div className="w-10 h-[1px] bg-zinc-800 mx-auto" />
      </footer>
    </div>
  );
}
