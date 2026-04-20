import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "Salgados Mônica | Salgados Artesanais em Niterói para sua Festa",
  description: "Faça sua encomenda de salgados artesanais em Niterói com a Mônica Silva. O melhor sabor caseiro para festas, eventos e lanches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
