import { Product } from './types';

export const PRODUCTS: Product[] = [
  // Fritos
  {
    id: 'f1',
    name: 'Coxinha de Frango',
    description: 'Massa de batata artesanal com recheio de frango desfiado temperado com ervas.',
    price: 80.00,
    category: 'Fritos',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop',
    available: true,
    unit: 'cento'
  },
  {
    id: 'f2',
    name: 'Kibe Tradicional',
    description: 'Carne bovina selecionada com hortelã fresca e tempero árabe especial.',
    price: 80.00,
    category: 'Fritos',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&auto=format&fit=crop',
    available: true,
    unit: 'cento'
  },
  {
    id: 'f3',
    name: 'Bolinha de Queijo',
    description: 'Recheio generoso de mussarela que derrete na boca com massa crocante.',
    price: 80.00,
    category: 'Fritos',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop',
    available: true,
    unit: 'cento'
  },
  {
    id: 'f4',
    name: 'Enroladinho de Salsicha',
    description: 'Salsicha de qualidade envolta em nossa massa leve e frita na hora.',
    price: 75.00,
    category: 'Fritos',
    image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800&auto=format&fit=crop',
    available: true,
    unit: 'cento'
  },
  {
    id: 'f5',
    name: 'Risole de Presunto e Queijo',
    description: 'Combinação clássica de presunto e queijo com tempero da casa.',
    price: 80.00,
    category: 'Fritos',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?w=800&auto=format&fit=crop',
    available: true,
    unit: 'cento'
  },

  // Assados
  {
    id: 'a1',
    name: 'Empadinha de Frango',
    description: 'Massa podre que derrete na boca com recheio cremoso de frango.',
    price: 95.00,
    category: 'Assados',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=800&auto=format&fit=crop',
    available: true,
    unit: 'cento'
  },
  {
    id: 'a2',
    name: 'Esfiha de Carne',
    description: 'Massa fofinha e leve com recheio de carne bem temperada com limão.',
    price: 95.00,
    category: 'Assados',
    image: 'https://images.unsplash.com/photo-1628191010210-a5977159966b?w=800&auto=format&fit=crop',
    available: true,
    unit: 'cento'
  },
  {
    id: 'a3',
    name: 'Pão de Queijo Mineiro',
    description: 'O verdadeiro sabor de Minas com mix de queijos canastra e curado.',
    price: 70.00,
    category: 'Assados',
    image: 'https://images.unsplash.com/photo-1598114187515-779836967005?w=800&auto=format&fit=crop',
    available: true,
    unit: 'cento'
  },

  // Combos
  {
    id: 'c1',
    name: 'Combo Festa 100',
    description: '100 salgados variados (fritos) + 1 refrigerante 2L.',
    price: 110.00,
    category: 'Combos',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
    available: true,
    unit: 'combo'
  },
  {
    id: 'c2',
    name: 'Combo Família G',
    description: '200 salgados variados + 50 docinhos + 2 refrigerantes 2L.',
    price: 250.00,
    category: 'Combos',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
    available: true,
    unit: 'combo'
  },

  // Especiais
  {
    id: 's1',
    name: 'Bolo Salgado Festivo',
    description: 'Bolo estruturado de pão de forma com camadas de frango, maionese e batata palha.',
    price: 120.00,
    category: 'Especiais',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
    available: true,
    unit: 'unidade'
  }
];

export const CATEGORIES = ['Fritos', 'Assados', 'Combos', 'Especiais'];

export const COMPANY_DATA = {
  name: 'Salgados Mônica',
  owner: 'Mônica Silva',
  whatsapp: '5521997456306',
  instagram: '@salgados_monica',
  facebook: 'Salgados Mônica',
  location: 'Niterói, RJ'
};
