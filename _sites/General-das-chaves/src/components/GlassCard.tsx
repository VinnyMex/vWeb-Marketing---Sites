import React from "react";
import { cn } from "../lib/utils";

/**
 * GlassCard component for content with glassmorphism.
 * @param children - The content to render inside the card.
 * @param className - Optional additional CSS classes.
 * @param dark - Whether to use the dark glass variant.
 */
export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}> = ({ children, className, dark = false }) => {
  return (
    <div
      className={cn(
        "p-8 rounded-3xl transition-all duration-500 hover:shadow-2xl",
        dark ? "glass-dark" : "glass",
        className
      )}
    >
      {children}
    </div>
  );
};
