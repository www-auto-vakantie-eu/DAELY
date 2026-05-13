import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; noPadding?: boolean }> = ({ children, className, onClick, noPadding }) => (
  <div 
    onClick={onClick}
    className={`daely-card rounded-[2.5rem] overflow-hidden transition-all duration-300 active:scale-[0.97] ${noPadding ? '' : 'p-6'} ${className || ''}`}
  >
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'gold' | 'silver' | 'logo';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const styles = {
    primary: 'accent-gradient text-white shadow-lg',
    secondary: 'bg-zinc-900 text-white',
    glass: 'bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20',
    outline: 'bg-transparent border border-zinc-200 text-zinc-600',
    gold: 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-zinc-900 shadow-[0_4px_20px_rgba(251,191,36,0.3)] font-black',
    silver: 'bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-500 text-zinc-900 shadow-md font-black',
    logo: 'bg-gradient-to-br from-[#80DFFF] via-[#22D3EE] to-[#3B82F6] text-white shadow-lg shadow-blue-500/30'
  };
  return (
    <button
      className={`px-6 py-4 rounded-2xl font-bold text-sm tracking-tight transition-all active:scale-95 flex items-center justify-center gap-2 ${styles[variant]} ${className || ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const CustomBadge: React.FC<{ level: string; color?: string }> = ({ level, color }) => {
  const defaultColor = level === 'Elite' || level === 'Advanced' || level === 'Verified' ? 'from-amber-400 to-amber-600' : level === 'Pro' || level === 'Intermediate' ? 'from-zinc-400 to-zinc-600' : 'from-blue-400 to-blue-600';
  return (
    <span className={`bg-gradient-to-br ${color || defaultColor} text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm`}>
      {level}
    </span>
  );
};

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-1">{title}</h3>
    {subtitle && <p className="text-2xl font-black tracking-tight leading-none text-zinc-900">{subtitle}</p>}
  </div>
);
