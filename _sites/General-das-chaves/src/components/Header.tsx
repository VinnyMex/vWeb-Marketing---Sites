import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Key } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

/**
 * Header component with transparent-to-solid scroll effect and glassmorphism.
 */
export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Sobre", path: "/sobre" },
    { name: "Serviços", path: "/servicos" },
    { name: "Produtos", path: "/produtos" },
    { name: "Galeria", path: "/galeria" },
    { name: "Vídeos", path: "/videos" },
    { name: "Blog", path: "/blog" },
    { name: "Contato", path: "/contato" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4",
        isScrolled
          ? "bg-black border-b border-white/10 py-3"
          : "bg-black"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="General das Chaves" className="w-32 h-auto group-hover:scale-105 transition-transform" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.path ? "text-primary" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contato"
            className="btn-futuristic btn-primary text-sm py-2 px-6"
          >
            ORÇAMENTO
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <motion.div
        initial={false}
        animate={{ x: isMenuOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed inset-0 bg-black/70 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 md:hidden",
          !isMenuOpen && "pointer-events-none"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className={cn(
              "text-2xl font-bold transition-colors",
              location.pathname === link.path ? "text-primary" : "text-white"
            )}
          >
            {link.name}
          </Link>
        ))}
        <Link
          to="/contato"
          onClick={() => setIsMenuOpen(false)}
          className="btn-futuristic btn-primary text-xl"
        >
          ORÇAMENTO
        </Link>
      </motion.div>
    </header>
  );
};
