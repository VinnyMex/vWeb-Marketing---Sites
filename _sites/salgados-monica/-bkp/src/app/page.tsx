import React from 'react';
import { 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShoppingBag, 
  CalendarDays,
  Truck,
  HelpCircle,
  Menu,
  ChevronRight,
  ChevronDown,
  ChefHat,
  PartyPopper,
  Users
} from 'lucide-react';

export default function Home() {
  const whatsappNumber = "5521997456306";
  const whatsappMsg = "Olá, Mônica! Vi o site e gostaria de fazer uma encomenda.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="min-h-screen texture-paper">
      {/* Botão Flutuante de Conversão */}
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 animate-bounce md:animate-none"
        aria-label="Pedir pelo WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute -top-2 -right-2 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white"></span>
        </span>
      </a>

      {/* Header */}
      <nav className="fixed top-0 w-full z-40 bg-cream/95 backdrop-blur-md border-b border-brown-dark/5">
        <div className="container-custom h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-terracotta rounded-lg flex items-center justify-center text-white rotate-3 shadow-lg">
              <ChefHat className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-serif leading-none text-brown-dark tracking-tight">Salgados Mônica</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta">Niterói • RJ</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <a href="#cardapio" className="nav-link">Cardápio</a>
            <a href="#quem-somos" className="nav-link">Quem Somos</a>
            <a href="#como-pedir" className="nav-link">Como Pedir</a>
            <a href="#contato" className="nav-link">Contato</a>
          </div>

          <a href={whatsappUrl} target="_blank" className="bg-brown-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-terracotta transition-all shadow-md flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Fazer Pedido
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-toast/10 text-gold-toast text-[10px] font-black uppercase tracking-[0.3em]">
              <Star className="w-3 h-3 fill-current" />
              Sabor Artesanal Inesquecível
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-brown-dark leading-[1.05] tracking-tight">
              Alegria em cada <span className="text-terracotta italic">mordida</span> para sua festa.
            </h1>
            <p className="text-lg md:text-xl text-brown-med leading-relaxed max-w-xl mx-auto lg:mx-0">
              Transforme seus momentos especiais com os salgados mais caprichados de Niterói. Produção artesanal, tempero caseiro e entrega pontual.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a href={whatsappUrl} target="_blank" className="btn-terracotta w-full sm:w-auto text-lg px-10 py-5">
                <MessageCircle className="w-6 h-6" />
                Peça agora no WhatsApp
              </a>
              <a href="#cardapio" className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-brown-dark/10 font-bold text-lg hover:bg-brown-dark hover:text-white transition-all text-center">
                Ver Cardápio
              </a>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-60">
              <div className="flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-terracotta" /> Niterói, RJ
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-terracotta" /> Sob Encomenda
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] border-[12px] border-white -rotate-2 hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=1000" 
                alt="Salgados variados da Mônica"
                className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
              />
            </div>
            {/* Decoração Visual */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-toast/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-terracotta/10 rounded-full blur-3xl -z-10" />
            
            <div className="absolute top-1/2 -right-12 bg-white p-6 rounded-3xl shadow-2xl border border-brown-dark/5 hidden xl:block z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-brown-dark leading-none">Qualidade</div>
                  <div className="text-xs text-brown-dark/50">Premiada em Niterói</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section id="quem-somos" className="py-24 bg-white">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" 
              alt="Cozinha da Mônica"
              className="rounded-3xl shadow-xl border-4 border-cream"
            />
            <div className="absolute -bottom-8 -right-8 bg-brown-dark text-white p-8 rounded-3xl shadow-2xl hidden md:block">
              <div className="text-4xl font-bold mb-1">Mônica Silva</div>
              <div className="text-gold-toast font-bold uppercase tracking-widest text-xs">Proprietária & Chef</div>
            </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-brown-dark">Tradição, Capricho e Coração.</h2>
            <div className="w-20 h-1.5 bg-terracotta rounded-full" />
            <p className="text-lg text-brown-med leading-relaxed">
              O Salgados Mônica não é apenas uma marca, é a realização de um sonho local em Niterói. Cada coxinha, kibe e empadinha que sai da nossa cozinha carrega o segredo do tempero caseiro e a dedicação total à sua satisfação.
            </p>
            <p className="text-lg text-brown-med leading-relaxed">
              Nossa missão é simples: levar alegria e praticidade para sua festa com salgados que as pessoas realmente comentam. Usamos apenas ingredientes de primeira qualidade, garantindo que tudo chegue fresquinho e crocante na sua mesa.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="p-6 bg-cream rounded-2xl border border-brown-dark/5">
                <div className="font-bold text-2xl text-terracotta mb-1">+10.000</div>
                <div className="text-xs font-bold text-brown-dark/40 uppercase tracking-widest">Salgados/Mês</div>
              </div>
              <div className="p-6 bg-cream rounded-2xl border border-brown-dark/5">
                <div className="font-bold text-2xl text-terracotta mb-1">100%</div>
                <div className="text-xs font-bold text-brown-dark/40 uppercase tracking-widest">Aprovação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARDÁPIO SECTION */}
      <section id="cardapio" className="py-24 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-brown-dark">O que preparamos para você</h2>
            <p className="text-lg text-brown-med">Categorias pensadas para facilitar sua escolha e garantir o sucesso do seu evento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: PartyPopper, 
                title: "Cento para Festas", 
                desc: "Mini salgados fritos ou assados. Ideal para aniversários.",
                items: ["Coxinha de Frango", "Kibe Tradicional", "Bolinha de Queijo", "Empada de Palmito"]
              },
              { 
                icon: Users, 
                title: "Combos & Kits", 
                desc: "Opções práticas para reuniões de família ou lanches rápidos.",
                items: ["Kit Lanche 10 pessoas", "Combo Especial Fim de Semana", "Kit Degustação"]
              },
              { 
                icon: ShoppingBag, 
                title: "Encomendas Grandes", 
                desc: "Preços especiais para quantidades acima de 5 centos.",
                items: ["Buffet Livre", "Festa Escolar", "Confraternizações"]
              },
              { 
                icon: ChefHat, 
                title: "Especiais Mônica", 
                desc: "Receitas autorais e sazonais para surpreender seus convidados.",
                items: ["Coxinha com Requeijão", "Quibe com Recheio", "Salgados Gourmet"]
              }
            ].map((card, i) => (
              <div key={i} className="group bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-brown-dark/5 flex flex-col h-full">
                <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center text-terracotta mb-6 group-hover:bg-terracotta group-hover:text-white transition-colors">
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                <p className="text-sm text-brown-med mb-8 flex-grow">{card.desc}</p>
                <div className="space-y-3 mb-8">
                  {card.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-brown-dark/70">
                      <div className="w-1 h-1 rounded-full bg-terracotta" />
                      {item}
                    </div>
                  ))}
                </div>
                <a href={whatsappUrl} target="_blank" className="w-full py-4 rounded-xl border-2 border-terracotta text-terracotta font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-terracotta hover:text-white transition-all">
                  Consultar Preço
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO PEDIR - STEP BY STEP */}
      <section id="como-pedir" className="py-24 bg-brown-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 texture-linen" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Como garantir suas <span className="text-gold-toast italic">delícias?</span></h2>
              <p className="text-xl text-white/60">Simplificamos tudo para você não ter trabalho. Em 4 passos seu pedido estará garantido!</p>
              
              <div className="space-y-10 pt-8">
                {[
                  { icon: Menu, title: "Escolha", desc: "Selecione as opções e quantidades no nosso cardápio." },
                  { icon: MessageCircle, title: "Envie", desc: "Mande uma mensagem no WhatsApp com seu pedido." },
                  { icon: CalendarDays, title: "Agende", desc: "Defina a data e o horário para retirada ou entrega." },
                  { icon: Clock, title: "Aproveite", desc: "Receba tudo quentinho e faça sucesso na sua festa!" }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-gold-toast font-black text-xl group-hover:bg-gold-toast group-hover:text-white transition-all">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{step.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 space-y-10">
              <div className="text-center space-y-4">
                <div className="text-gold-toast font-black text-sm uppercase tracking-[0.4em]">Próxima Entrega</div>
                <div className="text-3xl font-bold italic">Niterói e Região</div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
                   <Truck className="w-6 h-6 text-gold-toast" />
                   <div className="text-sm font-bold">Consulte a taxa de entrega para seu bairro.</div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
                   <Clock className="w-6 h-6 text-gold-toast" />
                   <div className="text-sm font-bold">Pedidos com 24h a 48h de antecedência.</div>
                </div>
              </div>
              <a href={whatsappUrl} target="_blank" className="btn-terracotta w-full py-6 text-xl shadow-none hover:bg-gold-toast">
                Iniciar Pedido Agora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS & PROVA SOCIAL */}
      <section className="py-24 bg-white">
        <div className="container-custom">
           <div className="text-center mb-16 space-y-4">
            <div className="text-terracotta font-black text-xs uppercase tracking-[0.3em]">Prova Social</div>
            <h2 className="text-4xl md:text-5xl font-bold text-brown-dark">O que nossos clientes dizem</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Mariana Costa", local: "Icaraí", text: "Os salgados mais sequinhos que já comi! A coxinha é simplesmente perfeita, e o atendimento da Mônica é nota 10." },
              { name: "Ricardo Santos", local: "São Francisco", text: "Fiz a festa da minha filha toda com eles. Todos os convidados perguntaram de onde eram os salgados. Sucesso total!" },
              { name: "Beatriz Oliveira", local: "Santa Rosa", text: "Melhor custo-benefício de Niterói. Salgados grandes, bem recheados e tudo muito fresquinho. Recomendo!" }
            ].map((dep, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-cream/40 border border-brown-dark/5 relative italic">
                <div className="absolute top-8 left-8 text-gold-toast/20 text-7xl font-serif">“</div>
                <p className="text-brown-med leading-relaxed mb-8 relative z-10">
                  {dep.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brown-dark rounded-full flex items-center justify-center text-white font-bold">
                    {dep.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-brown-dark">{dep.name}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-brown-dark/40">{dep.local}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & CONTACT */}
      <section id="contato" className="py-24 relative overflow-hidden">
        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h3 className="text-3xl font-bold mb-10 flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-terracotta" />
              Dúvidas Frequentes
            </h3>
            <div className="space-y-6">
              {[
                { q: "Qual o pedido mínimo?", a: "Trabalhamos com o cento para festas e kits a partir de 50 unidades." },
                { q: "Aceitam cartões?", a: "Sim! Aceitamos Pix, crédito, débito e dinheiro no ato da entrega." },
                { q: "Entrega em Icaraí/Piratininga?", a: "Entregamos em toda Niterói! Consulte a taxa para sua região no WhatsApp." },
                { q: "Tem opção congelada?", a: "Sim, vendemos salgados congelados para você fritar quando quiser. Consulte disponibilidade." }
              ].map((faq, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-white border border-brown-dark/5 hover:border-terracotta transition-all cursor-pointer">
                  <div className="flex items-center justify-between font-bold text-brown-dark mb-2">
                    {faq.q}
                    <ChevronDown className="w-4 h-4 text-brown-dark/20 group-hover:text-terracotta transition-colors" />
                  </div>
                  <p className="text-sm text-brown-med leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
             <div>
              <h3 className="text-3xl font-bold mb-10">Fale com a Gente</h3>
              <div className="space-y-8">
                <a href={whatsappUrl} target="_blank" className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-brown-dark">WhatsApp Direto</div>
                    <div className="text-brown-med">(21) 99745-6306</div>
                    <div className="text-[10px] text-terracotta font-bold uppercase tracking-widest mt-1">Responderemos em instantes</div>
                  </div>
                </a>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-terracotta">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-brown-dark">Onde Estamos</div>
                    <div className="text-brown-med">Niterói, Rio de Janeiro - RJ</div>
                    <div className="text-[10px] text-brown-dark/40 font-bold uppercase tracking-widest mt-1">Produção Artesanal sob encomenda</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-brown-dark/10">
              <h4 className="font-bold text-brown-dark mb-6 uppercase tracking-widest text-xs">Siga nossas delícias</h4>
              <div className="flex gap-4">
                <a href="https://instagram.com/salgados_monica" target="_blank" className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brown-dark hover:bg-terracotta hover:text-white transition-all">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://facebook.com/salgados_monica" target="_blank" className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brown-dark hover:bg-terracotta hover:text-white transition-all">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 bg-cream border-t border-brown-dark/10">
        <div className="container-custom flex flex-col items-center text-center space-y-10">
          <div className="flex items-center gap-3 scale-125">
            <div className="w-10 h-10 bg-terracotta rounded-lg flex items-center justify-center text-white rotate-3">
              <ChefHat className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-serif text-brown-dark tracking-tight">Salgados Mônica</span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 font-bold text-xs uppercase tracking-[0.2em] text-brown-dark/40">
            <a href="#cardapio" className="hover:text-terracotta transition-colors">Cardápio</a>
            <a href="#quem-somos" className="hover:text-terracotta transition-colors">Quem Somos</a>
            <a href="#como-pedir" className="hover:text-terracotta transition-colors">Como Pedir</a>
            <a href="#contato" className="hover:text-terracotta transition-colors">Contato</a>
          </nav>

          <div className="max-w-md text-sm text-brown-med/60 leading-relaxed">
            Desde 2026 levando o melhor sabor artesanal para Niterói. Tudo feito com carinho, capricho e o tempero único da Mônica Silva.
          </div>

          <div className="w-full pt-10 border-t border-brown-dark/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-brown-dark/30 uppercase tracking-[0.3em]">
            <p>&copy; Salgados Mônica / Mônica Silva. Niterói, RJ.</p>
            <p>Desenvolvido pela vWeb Marketing</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
