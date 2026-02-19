import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-gradient-to-br from-white/5 to-white/[0.02]
        backdrop-blur-xl
        rounded-2xl
        p-6
        border border-white/10
        shadow-xl
        ${hover ? 'transition-all duration-300 hover:border-[#B11226]/50 hover:shadow-[#B11226]/20 hover:scale-105' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
