import React from "react";
import { Link } from "react-router";
import { ArrowRight, Search, Tag } from "lucide-react";
import { motion } from "motion/react";

/**
 * Blog page component with post listing and categories.
 */
export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = React.useState<null | typeof posts[0]>(null);

  const posts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
      title: "Como escolher a melhor fechadura digital para sua casa",
      excerpt: "Descubra as principais tecnologias e o que levar em conta na hora de automatizar a segurança da sua residência.",
      content: `
        As fechaduras digitais representam o que há de mais moderno em segurança residencial. Elas oferecem praticidade, eliminando a necessidade de chaves físicas e permitindo o controle de acesso de forma remota ou por biometria.

        ### Principais Tecnologias
        1. **Biometria:** Acesso através da impressão digital. É o método mais seguro e prático.
        2. **Senha Numérica:** Permite criar códigos temporários para visitantes ou prestadores de serviço.
        3. **Tags RFID:** Chaveiros de aproximação que facilitam o acesso rápido.
        4. **Aplicativo:** Controle total pelo smartphone, com histórico de acessos e abertura remota.

        ### O que considerar na escolha?
        Ao escolher sua fechadura, verifique o tipo de porta (madeira, metal ou vidro), a espessura e se a fechadura é resistente a intempéries caso fique exposta ao sol ou chuva. Na General das Chaves, oferecemos consultoria completa para ajudar você a escolher o modelo ideal.
      `,
      date: "24 Mar, 2026",
      author: "Admin",
      category: "Segurança",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1614162692292-7ac66d7f7f1e?q=80&w=800&auto=format&fit=crop",
      title: "Chaves codificadas: o que fazer em caso de perda?",
      excerpt: "Perdeu a chave do carro? Saiba como funciona o processo de recuperação e codificação de novas chaves.",
      content: `
        Perder a chave do carro é uma situação estressante, especialmente com as tecnologias modernas de codificação. No entanto, com os profissionais certos, o processo de recuperação é rápido e seguro.

        ### Como funciona a codificação?
        As chaves modernas possuem um chip (transponder) que se comunica com o computador de bordo do veículo. Sem o código correto, o motor não liga, prevenindo furtos.

        ### Passos em caso de perda:
        1. **Mantenha a calma:** Verifique se realmente não há uma chave reserva.
        2. **Chame um especialista:** Evite tentar abrir o carro por conta própria, pois pode danificar o sistema elétrico ou a lataria.
        3. **Codificação:** O chaveiro especializado utilizará scanners de última geração para programar uma nova chave diretamente no sistema do seu carro.

        Nós da General das Chaves possuímos equipamentos de ponta para atender veículos nacionais e importados com agilidade.
      `,
      date: "20 Mar, 2026",
      author: "Admin",
      category: "Automotivo",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1581092160607-ee22521dd763?q=80&w=800&auto=format&fit=crop",
      title: "A importância da manutenção preventiva em cofres",
      excerpt: "Evite surpresas desagradáveis e garanta que seus bens mais valiosos estejam sempre protegidos com dicas simples.",
      content: `
        Um cofre é um investimento em segurança, mas como qualquer mecanismo de precisão, ele exige manutenção para garantir que funcione perfeitamente quando você mais precisar.

        ### Por que fazer manutenção?
        Com o tempo, mecanismos internos podem acumular poeira ou sofrer desgaste natural. Em cofres eletrônicos, as baterias podem vazar e danificar o circuito.

        ### Dicas de Manutenção:
        - **Troca de Baterias:** Substitua as baterias anualmente, mesmo que ainda estejam funcionando.
        - **Lubrificação:** Apenas profissionais devem lubrificar as engrenagens internas com produtos específicos.
        - **Teste de Senha:** Verifique periodicamente se o teclado responde corretamente a todos os comandos.

        Se o seu cofre apresentar qualquer dificuldade na abertura, não force. Chame nossa equipe técnica para uma revisão preventiva.
      `,
      date: "15 Mar, 2026",
      author: "Admin",
      category: "Cofres",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop",
      title: "Novas tecnologias em telecomandos automotivos",
      excerpt: "Conheça as inovações que estão tornando os controles de alarme mais seguros e funcionais.",
      content: `
        O mercado de telecomandos automotivos evoluiu drasticamente nos últimos anos. Hoje, o controle remoto faz muito mais do que apenas abrir e fechar portas.

        ### Inovações Recentes
        - **Rolling Code:** Tecnologia que altera o código de frequência a cada clique, impedindo que criminosos clonem o sinal.
        - **Keyless Entry:** Abertura por aproximação, onde o carro destrava automaticamente quando você chega perto.
        - **Start/Stop Remoto:** Permite ligar o motor e o ar-condicionado à distância.

        ### Cuidados com seu Telecomando
        Evite quedas e contato com umidade. Se os botões estiverem falhando, pode ser apenas a necessidade de limpeza interna ou troca da carcaça, serviços que realizamos rapidamente em nossa loja.
      `,
      date: "10 Mar, 2026",
      author: "Admin",
      category: "Tecnologia",
    },
  ];

  if (selectedPost) {
    return (
      <main className="pt-32 pb-24 px-6 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-black font-bold mb-8 hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            VOLTAR PARA O BLOG
          </button>

          <div className="w-full aspect-video rounded-[40px] overflow-hidden mb-12 shadow-2xl">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-black/40 mb-6">
            <span className="text-primary bg-primary/10 px-4 py-1 rounded-full">{selectedPost.category}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-black leading-tight tracking-tighter mb-8">
            {selectedPost.title}
          </h1>

          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
            {selectedPost.content.split('\n').map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith('###')) {
                return <h3 key={i} className="text-2xl font-black text-black pt-4">{trimmed.replace('###', '')}</h3>;
              }
              if (trimmed.startsWith('-') || trimmed.match(/^\d\./)) {
                return <li key={i} className="ml-4">{trimmed.replace(/^- |\d\. /, '')}</li>;
              }
              return <p key={i}>{trimmed}</p>;
            })}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-6 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-16 max-w-3xl">
          <span className="text-[#000000] font-black text-xs tracking-[0.3em] uppercase">
            BLOG & NOVIDADES
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-black leading-none tracking-tighter">
            FIQUE POR DENTRO DO <br />
            <span className="text-primary italic">MUNDO</span> DA SEGURANÇA.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Dicas, notícias e as últimas tecnologias do mercado de chaveiros 
            e segurança eletrônica.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          {/* Posts List */}
          <div className="lg:col-span-2 flex flex-col gap-16">
            {posts.map((post, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group flex flex-col md:flex-row gap-8 items-center"
              >
                <div className="w-full md:w-80 aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-black/40">
                    <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">{post.category}</span>
                  </div>
                  <h2 className="text-3xl font-black text-black leading-tight tracking-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-black font-bold text-xs flex items-center gap-2 group/btn hover:text-primary transition-colors uppercase tracking-widest w-fit"
                  >
                    LER MAIS
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-12 sticky top-32">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar no blog..."
                className="w-full bg-gray-50 border border-gray-100 rounded-full pl-14 pr-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-black text-black tracking-tight flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Categorias
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Automotivo", "Residencial", "Cofres", "Tecnologia", "Dicas", "Novidades"].map((cat) => (
                  <button
                    key={cat}
                    className="px-4 py-2 rounded-xl bg-gray-50 text-gray-500 text-xs font-bold hover:bg-primary hover:text-black transition-all border border-gray-100"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              <h3 className="text-xl font-black text-white tracking-tight mb-4 relative z-10">
                Newsletter
              </h3>
              <p className="text-white/50 text-xs leading-relaxed mb-6 relative z-10">
                Receba as últimas novidades do mundo da segurança no seu e-mail.
              </p>
              <form className="flex flex-col gap-3 relative z-10">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                />
                <button className="btn-futuristic btn-primary py-3 text-xs">
                  INSCREVER
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};
