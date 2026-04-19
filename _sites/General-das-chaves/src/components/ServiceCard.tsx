import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { cn } from "../lib/utils";

/**
 * ServiceCard component for displaying a service with an icon and description.
 * @param icon - The icon to display.
 * @param title - The title of the service.
 * @param description - The description of the service.
 * @param path - The link to the service details.
 */
export const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
}> = ({ icon, title, description, path }) => {
  return (
    <Link
      to={path}
      className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500 flex flex-col items-start gap-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
      
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-500">
        {icon}
      </div>
      
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-black tracking-tight text-black group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
        SAIBA MAIS
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
