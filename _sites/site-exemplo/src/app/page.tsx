import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-20 px-8 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl mx-4 my-10 sm:items-start">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#D32F2F] rounded-lg flex items-center justify-center text-white font-bold text-xl">V</div>
          <span className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase">Academia Vigor</span>
        </div>

        <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left">
          <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50 uppercase italic">
            Supere seus limites. <br/>
            <span className="text-[#D32F2F]">Desperte seu vigor.</span>
          </h1>
          
          <p className="max-w-xl text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            A única academia da região com <span className="font-semibold text-zinc-900 dark:text-white">acompanhamento nutricional incluso</span>. 
            Junte-se à nossa comunidade e alcance sua melhor versão.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-10 w-full sm:flex-row">
          <a
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#D32F2F] px-8 text-white font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20 md:w-auto"
            href="#matricula"
          >
            Quero Minha Matrícula
          </a>
          <a
            className="flex h-14 w-full items-center justify-center rounded-xl border-2 border-zinc-200 px-8 font-bold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800 md:w-auto"
            href="#planos"
          >
            Conhecer Planos
          </a>
        </div>

        <footer className="mt-20 pt-8 border-t border-zinc-100 dark:border-zinc-800 w-full text-zinc-500 dark:text-zinc-400 text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Academia Vigor - Saúde e Comunidade</p>
          <p className="font-medium bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-700 dark:text-zinc-300">
            🕗 Seg à Sex: 06h - 22h | Sáb: 08h - 14h
          </p>
        </footer>
      </main>
    </div>
  );
}
