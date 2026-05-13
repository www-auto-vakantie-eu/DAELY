import React from 'react';
import { THEMES } from '../../data/appData';

const ThemeCardVisual: React.FC<{ theme: typeof THEMES[0]; isActive: boolean }> = ({ theme, isActive }) => {
  if (theme.id === 'classic') {
    return (
      <div className={`absolute inset-0 bg-white flex flex-col justify-between p-8 overflow-hidden transition-all duration-500 ${isActive ? 'border-2 border-blue-400/30' : 'border border-blue-100/50'}`}>
        {/* Wave background at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-80 pointer-events-none">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
            <path fill="url(#classic-wave-grad)" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,234.7C672,245,768,235,864,213.3C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <defs>
              <linearGradient id="classic-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F0F9FF" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#E0F2FE" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="flex justify-between items-start relative z-10 w-full">
          {/* Top left lines */}
          <div className="space-y-2 mt-1">
            <div className="w-10 h-[3px] bg-slate-100 rounded-full" />
            <div className="w-6 h-[3px] bg-slate-100 rounded-full" />
          </div>
          {/* Concentric circles icon */}
          <div className="w-14 h-14 rounded-full p-[3px] bg-gradient-to-tr from-cyan-300 to-blue-500 shadow-sm">
            <div className="w-full h-full bg-white rounded-full p-[3px]">
              <div className="w-full h-full rounded-full border-[4px] border-cyan-400" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center relative z-10 mt-2">
          <h3 className="text-2xl font-black text-slate-700 tracking-wide">DAELY CLASSIC</h3>
        </div>
        
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative z-10 mt-6">
          <div className="absolute top-0 left-0 h-full w-[70%] bg-blue-500 rounded-full" />
        </div>
      </div>
    );
  }

  if (theme.id === 'pulse') {
    return (
      <div className="absolute inset-0 bg-[#0A0A0A] flex flex-col p-6 overflow-hidden border border-white/5">
        {/* Background glowing swooshes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[40%] bg-[#A3E635]/20 blur-[50px] rounded-full" />
          <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M-50,120 Q150,180 250,100 T450,80" fill="none" stroke="#A3E635" strokeWidth="3" filter="url(#glow-pulse)" />
            <path d="M-50,130 Q100,190 200,110 T450,90" fill="none" stroke="#A3E635" strokeWidth="1" opacity="0.6" filter="url(#glow-pulse)" />
            <defs>
              <filter id="glow-pulse" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
        
        {/* Top left lines */}
        <div className="relative z-10 space-y-1.5 mt-1">
          <div className="w-8 h-[2px] bg-[#A3E635]/40 rounded-full" />
          <div className="w-5 h-[2px] bg-[#A3E635]/40 rounded-full" />
        </div>
        
        {/* Center content */}
        <div className="flex-1 flex items-center justify-between relative z-10 mt-2">
          {/* Left heartbeat icon */}
          <div className="w-14 h-14 rounded-full border-[3px] border-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.5),inset_0_0_15px_rgba(163,230,53,0.3)] flex items-center justify-center bg-black/40 backdrop-blur-sm relative overflow-visible">
            <svg className="absolute inset-0 w-[140%] h-full -left-[20%] overflow-visible" viewBox="0 0 140 100" preserveAspectRatio="none">
              <path d="M0,50 L35,50 L45,20 L60,80 L75,50 L140,50" fill="none" stroke="#A3E635" strokeWidth="4" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(163,230,53,0.9)]" />
            </svg>
          </div>
          
          <h3 className="text-4xl font-black text-white tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">PULSE</h3>
          
          {/* Right glowing circle */}
          <div className="w-14 h-14 rounded-full border-[4px] border-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.6),inset_0_0_15px_rgba(163,230,53,0.4)] flex items-center justify-center bg-black/40 backdrop-blur-sm relative">
            <div className="w-8 h-8 rounded-full border-[3px] border-[#A3E635] border-r-transparent -rotate-45 shadow-[0_0_10px_rgba(163,230,53,0.8)]" />
          </div>
        </div>
        
        {/* Bottom progress bar */}
        <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden relative z-10 mt-6 shadow-[0_0_10px_rgba(163,230,53,0.2)]">
          <div className="absolute top-0 left-0 h-full w-[85%] bg-[#A3E635] rounded-full shadow-[0_0_15px_rgba(163,230,53,1)]" />
        </div>
        
        {isActive && (
          <div className="absolute inset-0 border-4 border-[#A3E635]/40 rounded-[2.5rem] pointer-events-none" />
        )}
      </div>
    );
  }

  if (theme.id === 'sand') {
    return (
      <div className="absolute inset-0 bg-[#FFF8F0] flex flex-col p-6 overflow-hidden">
        {/* Dune background waves */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
          <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full h-full">
            {/* Back dune */}
            <path d="M0,80 Q100,40 200,70 T400,50 L400,150 L0,150 Z" fill="#FDE6D5" opacity="0.8" />
            {/* Middle dune */}
            <path d="M0,100 Q150,130 250,80 T400,90 L400,150 L0,150 Z" fill="#F5D6B9" opacity="0.8" />
            {/* Front dune */}
            <path d="M0,120 Q100,90 200,130 T400,110 L400,150 L0,150 Z" fill="#EAC29A" opacity="0.8" />
          </svg>
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          {/* Top left lines */}
          <div className="space-y-1.5 mt-1">
            <div className="w-8 h-[2px] bg-[#EAC29A]/50 rounded-full" />
            <div className="w-5 h-[2px] bg-[#EAC29A]/50 rounded-full" />
          </div>
          
          {/* Concentric circles icon */}
          <div className="w-12 h-12 rounded-full p-[3px] bg-[#C89B72]/20">
            <div className="w-full h-full bg-[#FFF8F0] rounded-full p-[2px]">
              <div className="w-full h-full rounded-full border-[3px] border-[#C89B72]" />
            </div>
          </div>
        </div>
        
        {/* Center content */}
        <div className="flex-1 flex items-center relative z-10 mt-2">
          <h3 className="text-xl font-black text-[#C89B72] tracking-wide">SAHARA DUNE</h3>
        </div>
        
        {/* Bottom progress bar */}
        <div className="w-full h-1.5 bg-[#F5D6B9]/50 rounded-full overflow-hidden relative z-10 mt-6">
          <div className="absolute top-0 left-0 h-full w-[65%] bg-[#C89B72] rounded-full" />
        </div>
        
        {isActive && (
          <div className="absolute inset-0 border-4 border-[#C89B72]/20 rounded-[2.5rem] pointer-events-none" />
        )}
      </div>
    );
  }

  if (theme.id === 'forest') {
    return (
      <div className="absolute inset-0 bg-[#EAF5EC] flex flex-col p-6 overflow-hidden">
        {/* Forest background waves and trees */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
          <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full h-full">
            {/* Faint trees in background */}
            <path d="M120,90 L125,70 L130,90 Z M135,100 L140,80 L145,100 Z M150,95 L155,75 L160,95 Z" fill="#A5D6A7" opacity="0.5" />
            {/* Back wave */}
            <path d="M0,100 Q100,60 200,90 T400,70 L400,150 L0,150 Z" fill="#C8E6C9" opacity="0.6" />
            {/* Middle wave */}
            <path d="M0,120 Q150,150 250,100 T400,110 L400,150 L0,150 Z" fill="#A5D6A7" opacity="0.6" />
            {/* Front wave */}
            <path d="M0,140 Q100,110 200,150 T400,130 L400,150 L0,150 Z" fill="#81C784" opacity="0.6" />
            
            {/* Flowing thin lines */}
            <path d="M-50,100 Q150,160 250,80 T450,60" fill="none" stroke="#81C784" strokeWidth="1" opacity="0.8" />
            <path d="M-50,110 Q100,170 200,90 T450,70" fill="none" stroke="#A5D6A7" strokeWidth="0.5" opacity="0.8" />
          </svg>
        </div>
        
        {/* Floating elements on the left */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-[#81C784] to-[#4CAF50] rounded-full opacity-80 shadow-lg" />
        <div className="absolute left-8 top-[60%] w-4 h-4 bg-[#81C784] rounded-full opacity-90 shadow-sm" />
        
        {/* Large Leaf SVG */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-20 h-20 drop-shadow-xl z-10 rotate-12">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#81C784" />
                <stop offset="50%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#1B5E20" />
              </linearGradient>
            </defs>
            <path d="M10,90 Q10,40 50,10 Q90,10 90,50 Q90,90 10,90 Z" fill="url(#leaf-grad)" />
            <path d="M10,90 Q50,50 90,10" fill="none" stroke="#1B5E20" strokeWidth="2" opacity="0.5" />
            <path d="M30,70 Q40,50 60,30" fill="none" stroke="#1B5E20" strokeWidth="1" opacity="0.4" />
            <path d="M50,80 Q60,60 80,40" fill="none" stroke="#1B5E20" strokeWidth="1" opacity="0.4" />
            {/* Dew drops */}
            <circle cx="60" cy="30" r="2" fill="#FFFFFF" opacity="0.6" />
            <circle cx="40" cy="50" r="1.5" fill="#FFFFFF" opacity="0.6" />
          </svg>
        </div>
        
        {/* Floating small leaves on the right */}
        <div className="absolute right-24 top-[40%] w-3 h-3 bg-[#4CAF50] rounded-tl-full rounded-br-full rotate-45 opacity-80" />
        <div className="absolute right-16 top-[60%] w-4 h-4 bg-[#2E7D32] rounded-tl-full rounded-br-full -rotate-12 opacity-90" />
        <div className="absolute right-32 top-[70%] w-2 h-2 bg-[#81C784] rounded-tl-full rounded-br-full rotate-12 opacity-70" />
        
        <div className="flex justify-between items-start relative z-10">
          {/* Top left lines */}
          <div className="space-y-1.5 mt-1">
            <div className="w-8 h-[3px] bg-[#81C784] rounded-full" />
            <div className="w-5 h-[3px] bg-[#81C784] rounded-full" />
          </div>
          
          {/* Concentric circles icon */}
          <div className="w-12 h-12 rounded-full p-[3px] bg-gradient-to-tr from-[#A5D6A7] to-[#2E7D32] shadow-[0_0_15px_rgba(76,175,80,0.4)]">
            <div className="w-full h-full bg-[#EAF5EC] rounded-full p-[2px]">
              <div className="w-full h-full rounded-full border-[3px] border-[#2E7D32]" />
            </div>
          </div>
        </div>
        
        {/* Center content */}
        <div className="flex-1 flex items-center justify-center relative z-10 mt-2">
          <h3 className="text-2xl font-black text-[#1B5E20] tracking-wide drop-shadow-sm">FOREST</h3>
        </div>
        
        {/* Bottom progress bar */}
        <div className="w-full h-1.5 bg-[#C8E6C9] rounded-full overflow-hidden relative z-10 mt-6 shadow-inner">
          <div className="absolute top-0 left-0 h-full w-[75%] bg-[#2E7D32] rounded-full shadow-[0_0_8px_rgba(46,125,50,0.6)]" />
        </div>
        
        {isActive && (
          <div className="absolute inset-0 border-4 border-[#4CAF50]/30 rounded-[2.5rem] pointer-events-none" />
        )}
      </div>
    );
  }

  if (theme.id === 'lab') {
    return (
      <div className="absolute inset-0 bg-[#0B0C10] flex flex-col p-6 overflow-hidden border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
        {/* Background glow */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-[#00F2FF]/10 blur-[40px] rounded-full pointer-events-none" />
        
        {/* Top right dot grid */}
        <div className="absolute right-6 top-6 grid grid-cols-6 gap-2 opacity-20 pointer-events-none">
           {Array.from({ length: 18 }).map((_, i) => (
             <div key={i} className="w-1 h-1 bg-white rounded-full" />
           ))}
        </div>
        
        {/* Left side 3D Platform & Charts */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none">
           <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Faint background bar charts */}
              <rect x="40" y="90" width="6" height="30" fill="#00F2FF" opacity="0.2" />
              <rect x="55" y="70" width="6" height="50" fill="#00F2FF" opacity="0.3" />
              <rect x="70" y="80" width="6" height="40" fill="#00F2FF" opacity="0.2" />
              <rect x="85" y="60" width="6" height="60" fill="#00F2FF" opacity="0.4" />
              <rect x="100" y="90" width="6" height="30" fill="#00F2FF" opacity="0.2" />
              
              {/* 3D Platform Base */}
              <path d="M20,120 L80,90 L140,120 L80,150 Z" fill="rgba(0, 242, 255, 0.1)" stroke="#00F2FF" strokeWidth="1" />
              <path d="M20,120 L80,150 L80,160 L20,130 Z" fill="rgba(0, 242, 255, 0.3)" stroke="#00F2FF" strokeWidth="1" />
              <path d="M80,150 L140,120 L140,130 L80,160 Z" fill="rgba(190, 242, 100, 0.3)" stroke="#BEF264" strokeWidth="1" />
              
              {/* Platform Grid */}
              <path d="M40,110 L100,140 M60,100 L120,130 M40,130 L100,100 M60,140 L120,110" stroke="#BEF264" strokeWidth="0.5" opacity="0.5" />
              
              {/* Glowing platform top */}
              <path d="M20,120 L80,90 L140,120 L80,150 Z" fill="url(#platform-glow)" opacity="0.6" />
              <defs>
                <radialGradient id="platform-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#BEF264" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00F2FF" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Line Chart */}
              <path d="M30,90 L50,100 L70,60 L90,70 L110,40 L140,55" fill="none" stroke="#00F2FF" strokeWidth="2" className="drop-shadow-[0_0_5px_rgba(0,242,255,0.8)]" />
              
              {/* Chart Nodes */}
              <circle cx="30" cy="90" r="2" fill="#00F2FF" />
              <circle cx="50" cy="100" r="2" fill="#00F2FF" />
              <circle cx="70" cy="60" r="4" fill="#FFFFFF" className="drop-shadow-[0_0_8px_rgba(255,255,255,1)]" />
              <circle cx="90" cy="70" r="2" fill="#00F2FF" />
              <circle cx="110" cy="40" r="3" fill="#00F2FF" className="drop-shadow-[0_0_5px_rgba(0,242,255,0.8)]" />
              <circle cx="140" cy="55" r="2" fill="#00F2FF" />
              
              {/* Floating Target Icons */}
              <g transform="translate(40, 40) scale(0.6)">
                <circle cx="10" cy="10" r="8" fill="none" stroke="#3B82F6" strokeWidth="2" />
                <circle cx="10" cy="10" r="3" fill="#3B82F6" />
                <path d="M10,2 L10,-4 M18,10 L24,10 M10,18 L10,24 M2,10 L-4,10" stroke="#3B82F6" strokeWidth="2" />
              </g>
              <g transform="translate(60, 55) scale(0.5)">
                <circle cx="10" cy="10" r="8" fill="none" stroke="#BEF264" strokeWidth="2" />
                <circle cx="10" cy="10" r="3" fill="#BEF264" />
                <path d="M10,2 L10,-4 M18,10 L24,10 M10,18 L10,24 M2,10 L-4,10" stroke="#BEF264" strokeWidth="2" />
              </g>
           </svg>
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="w-8 h-8" /> {/* Spacer */}
          
          {/* Concentric circles icon */}
          <div className="w-12 h-12 rounded-full p-[3px] bg-gradient-to-tr from-[#00F2FF] to-[#BEF264] shadow-[0_0_15px_rgba(0,242,255,0.3)]">
            <div className="w-full h-full bg-[#0B0C10] rounded-full p-[2px]">
              <div className="w-full h-full rounded-full border-[3px] border-transparent" style={{ background: 'linear-gradient(#0B0C10, #0B0C10) padding-box, linear-gradient(to top right, #00F2FF, #BEF264) border-box' }} />
            </div>
          </div>
        </div>
        
        {/* Center content */}
        <div className="flex-1 flex items-center justify-center relative z-10 mt-2">
           <h3 className="text-2xl font-black text-white tracking-wide drop-shadow-md">SPORT LAB</h3>
        </div>
        
        {/* Bottom progress bar */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden relative z-10 mt-6 shadow-inner">
          <div className="absolute top-0 left-0 h-full w-[70%] bg-[#BEF264] rounded-full shadow-[0_0_15px_rgba(190,242,100,1)]" />
        </div>
        
        {isActive && (
          <div className="absolute inset-0 border-4 border-[#00F2FF]/20 rounded-[2.5rem] pointer-events-none" />
        )}
      </div>
    );
  }

  if (theme.id === 'pastel') {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-[#EADDFF] via-[#F3E8FF] to-[#E0F2FE] flex flex-col p-6 overflow-hidden">
        {/* Soft glowing background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[140%] bg-[#D8B4FE]/20 blur-[60px] rounded-full" />
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[140%] bg-[#BAE6FD]/20 blur-[60px] rounded-full" />
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="w-8 h-8" /> {/* Spacer for layout balance */}
          
          {/* Concentric circles icon */}
          <div className="w-12 h-12 rounded-full p-[3px] bg-[#A78BFA]/30">
            <div className="w-full h-full bg-gradient-to-br from-[#F5F3FF] to-[#F0F9FF] rounded-full p-[2px]">
              <div className="w-full h-full rounded-full border-[3px] border-[#A78BFA]/50" />
            </div>
          </div>
        </div>
        
        {/* Center content */}
        <div className="flex-1 flex items-center justify-center relative z-10 mt-2">
          <h3 className="text-2xl font-black text-[#A78BFA] tracking-wide drop-shadow-sm">PASTEL CALM</h3>
        </div>
        
        {/* Bottom progress bar */}
        <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden relative z-10 mt-6 backdrop-blur-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="absolute top-0 left-0 h-full w-[50%] bg-gradient-to-r from-[#C4B5FD] to-[#BAE6FD] rounded-full" />
        </div>
        
        {isActive && (
          <div className="absolute inset-0 border-4 border-[#A78BFA]/20 rounded-[2.5rem] pointer-events-none" />
        )}
      </div>
    );
  }

  if (theme.id === 'luxury') {
    return (
      <div className="absolute inset-0 bg-[#0A0A0A] flex flex-col p-6 overflow-hidden border border-[#D4AF37]/20 shadow-[inset_0_0_30px_rgba(212,175,55,0.05)]">
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        
        {/* Left Gold 3D Element */}
        <div className="absolute left-[-2rem] top-1/2 -translate-y-1/2 w-48 h-48 z-0 pointer-events-none">
           <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_25px_rgba(212,175,55,0.3)]">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#F5E6C8', stopOpacity: 1 }} />
                  <stop offset="30%" style={{ stopColor: '#D4AF37', stopOpacity: 1 }} />
                  <stop offset="70%" style={{ stopColor: '#856404', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#3A2A00', stopOpacity: 1 }} />
                </linearGradient>
                <radialGradient id="goldShine" cx="70%" cy="30%" r="50%" fx="80%" fy="20%">
                  <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.9 }} />
                  <stop offset="30%" style={{ stopColor: '#F5E6C8', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: '#D4AF37', stopOpacity: 0 }} />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Abstract Gold Shape */}
              <path d="M40,140 C20,100 30,50 80,40 C130,30 160,70 150,110 C140,150 90,170 40,140 Z" fill="url(#goldGrad)" transform="rotate(-30 100 100) translate(-40, 20)" />
              <path d="M40,140 C20,100 30,50 80,40 C130,30 160,70 150,110 C140,150 90,170 40,140 Z" fill="url(#goldShine)" transform="rotate(-30 100 100) translate(-40, 20)" />
              
              {/* Intense highlight point */}
              <circle cx="110" cy="70" r="15" fill="url(#goldShine)" filter="url(#glow)" opacity="0.8" />
           </svg>
        </div>

        <div className="flex justify-between items-start relative z-10">
          {/* Top left lines */}
          <div className="space-y-1.5 mt-1 ml-4">
            <div className="w-10 h-[2px] bg-[#D4AF37]/40 rounded-full shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
            <div className="w-6 h-[2px] bg-[#D4AF37]/40 rounded-full shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
          </div>
          
          {/* Concentric circles icon */}
          <div className="w-12 h-12 rounded-full p-[3px] bg-gradient-to-tr from-[#856404] via-[#D4AF37] to-[#F5E6C8] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <div className="w-full h-full bg-[#0A0A0A] rounded-full p-[2px]">
              <div className="w-full h-full rounded-full border-[3px] border-transparent" style={{ background: 'linear-gradient(#0A0A0A, #0A0A0A) padding-box, linear-gradient(to top right, #856404, #F5E6C8) border-box' }} />
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex items-center justify-center relative z-10 mt-2">
           <h3 className="text-2xl font-black text-[#F5E6C8] tracking-widest drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">PURE LUXURY</h3>
        </div>

        {/* Bottom Section: Glowing Gold Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full relative z-10 mt-6 overflow-visible shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 h-full w-[75%] bg-gradient-to-r from-[#856404] via-[#D4AF37] to-[#F5E6C8] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
          
          {/* Intense flare on the progress bar */}
          <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-20 h-[2px] bg-white blur-[2px] opacity-90 z-20" />
          <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-8 h-[4px] bg-white blur-[4px] opacity-80 z-20" />
        </div>

        {isActive && (
          <div className="absolute inset-0 border-4 border-[#D4AF37]/30 rounded-[2.5rem] pointer-events-none shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]" />
        )}
      </div>
    );
  }

  if (theme.id === 'force') {
    return (
      <div className="absolute inset-0 bg-[#E62E31] flex flex-col p-6 overflow-hidden">
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        
        {/* Background Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-[65%] pointer-events-none">
          <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,60 C150,50 250,130 400,90 L400,150 L0,150 Z" fill="#C7171A" opacity="0.9" />
          </svg>
        </div>

        <div className="flex justify-between items-start relative z-10">
          {/* Top left lines */}
          <div className="space-y-1.5 mt-1 ml-2">
            <div className="w-12 h-[3px] bg-white/80 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            <div className="w-8 h-[3px] bg-white/80 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          </div>
          
          {/* Concentric circles icon */}
          <div className="w-14 h-14 rounded-full border-[3px] border-white shadow-[0_0_20px_rgba(255,255,255,0.6),inset_0_0_10px_rgba(255,255,255,0.4)] flex items-center justify-center bg-transparent">
            <div className="w-8 h-8 rounded-full border-[2px] border-white opacity-90 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex items-center justify-start relative z-10 mt-2 ml-2">
           <h3 className="text-2xl font-black text-white tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">FORCE</h3>
        </div>

        {/* Bottom Section: Glowing Line */}
        <div className="w-[95%] mx-auto h-[2px] relative z-10 mt-6 mb-2">
          {/* Base line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-60" />
          {/* Core glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent blur-[1px]" />
          {/* Intense center flare */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[3px] bg-gradient-to-r from-transparent via-[#FFFFFF] to-transparent blur-[2px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[4px] bg-[#FFFFFF] blur-[4px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[5%] h-[6px] bg-[#FFFFFF] blur-[6px]" />
        </div>

        {isActive && (
          <div className="absolute inset-0 border-4 border-white/30 rounded-[2.5rem] pointer-events-none shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]" />
        )}
      </div>
    );
  }

  if (theme.id === 'ember') {
    return (
      <div className="absolute inset-0 bg-[#050200] flex flex-col p-6 overflow-hidden border-[1.5px] border-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.6),inset_0_0_20px_rgba(255,107,0,0.3)]">
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        
        {/* Fiery Explosion / Flare Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Main sweeping curve */}
          <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="absolute w-[120%] h-[150%] -left-[10%] -top-[10%] mix-blend-screen">
            <defs>
              <linearGradient id="fireSweep" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#FF6B00" stopOpacity="1" />
                <stop offset="15%" stopColor="#FF4500" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#D32F2F" stopOpacity="0.6" />
                <stop offset="80%" stopColor="#8B0000" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
              <filter id="fireGlow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="fireTurbulence" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.015 0.04" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation="2" result="blurred" />
                <feMerge>
                  <feMergeNode in="blurred" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Background dark red wave */}
            <path d="M-20,90 Q150,140 400,60 L400,150 L-20,150 Z" fill="#3A0000" opacity="0.6" filter="url(#fireGlow)" />
            {/* Bright sweeping line with realistic fire turbulence */}
            <path d="M-20,80 Q150,120 380,50" fill="none" stroke="url(#fireSweep)" strokeWidth="20" filter="url(#fireTurbulence)" opacity="0.85" />
            <path d="M-20,80 Q150,120 380,50" fill="none" stroke="#FF6B00" strokeWidth="3" filter="url(#fireGlow)" opacity="1" />
          </svg>
          
          {/* Intense flare point on the left */}
          <div className="absolute top-[55%] left-[12%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[radial-gradient(circle,rgba(255,107,0,0.9)_0%,rgba(255,69,0,0.6)_15%,rgba(211,47,47,0.3)_40%,rgba(0,0,0,0)_70%)] blur-md mix-blend-screen" />
          
          {/* Light rays from the flare */}
          <div className="absolute top-[55%] left-[12%] -translate-x-1/2 -translate-y-1/2 w-64 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent rotate-[15deg] blur-[1px] opacity-90 mix-blend-screen" />
          <div className="absolute top-[55%] left-[12%] -translate-x-1/2 -translate-y-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-[#FF4500] to-transparent -rotate-[35deg] blur-[1px] opacity-70 mix-blend-screen" />
          <div className="absolute top-[55%] left-[12%] -translate-x-1/2 -translate-y-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent rotate-[65deg] blur-[2px] opacity-60 mix-blend-screen" />
          
          {/* Embers/Sparks */}
          <div className="absolute top-[25%] left-[22%] w-1 h-1 bg-[#FF6B00] rounded-full blur-[0.5px] shadow-[0_0_6px_#FF6B00] mix-blend-screen" />
          <div className="absolute top-[35%] left-[15%] w-1.5 h-1.5 bg-[#FF6B00] rounded-full blur-[1px] shadow-[0_0_8px_#FF6B00] mix-blend-screen" />
          <div className="absolute top-[65%] left-[25%] w-1 h-1 bg-[#FF4500] rounded-full blur-[0.5px] shadow-[0_0_4px_#FF4500] mix-blend-screen" />
          <div className="absolute top-[45%] left-[35%] w-2 h-2 bg-[#D32F2F] rounded-full blur-[1.5px] shadow-[0_0_10px_#D32F2F] mix-blend-screen" />
          <div className="absolute top-[75%] left-[45%] w-1 h-1 bg-[#FF6B00] rounded-full blur-[1px] shadow-[0_0_5px_#FF6B00] mix-blend-screen" />
        </div>

        <div className="flex justify-between items-start relative z-10">
          {/* Top left lines */}
          <div className="space-y-1.5 mt-1 ml-4">
            <div className="w-10 h-[2px] bg-[#888888] rounded-full opacity-80" />
            <div className="w-6 h-[2px] bg-[#888888] rounded-full opacity-80" />
          </div>
          
          {/* Concentric circles icon */}
          <div className="w-14 h-14 rounded-full border-[3px] border-[#D32F2F] shadow-[0_0_25px_rgba(211,47,47,0.9),inset_0_0_15px_rgba(211,47,47,0.6)] flex items-center justify-center bg-[#0A0500]">
            <div className="w-8 h-8 rounded-full border-[3px] border-[#FF6B00] opacity-100 shadow-[0_0_15px_rgba(255,107,0,0.9),inset_0_0_5px_rgba(255,107,0,0.5)]" />
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex items-center justify-center relative z-10 mt-2">
           <h3 className="text-2xl font-black text-[#FFCDD2] tracking-widest drop-shadow-[0_2px_15px_rgba(255,69,0,0.8)]">EMBER</h3>
        </div>

        {/* Bottom Section: Glowing Line */}
        <div className="w-[90%] mx-auto h-[3px] relative z-10 mt-6 mb-2">
          {/* Base line */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000] via-[#FF4500] to-[#8B0000] opacity-60 rounded-full blur-[1px]" />
          {/* Core glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent blur-[1px]" />
          {/* Intense center flare (shifted left) */}
          <div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[40%] h-[3px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent blur-[2px]" />
          <div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[15%] h-[5px] bg-[#FF6B00] blur-[3px]" />
        </div>

        {isActive && (
          <div className="absolute inset-0 border-4 border-[#FF8C00]/50 rounded-[2.5rem] pointer-events-none shadow-[inset_0_0_40px_rgba(255,140,0,0.4)]" />
        )}
      </div>
    );
  }

  if (theme.id === 'retro') {
    return (
      <div className="absolute inset-0 bg-[#FAF3E0] flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/felt.png")' }} />
        
        {/* Retro Logo Background Element */}
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] opacity-10 pointer-events-none">
           <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" stroke="#2B3E50" strokeWidth="10" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="#E67E22" strokeWidth="10" fill="none" />
           </svg>
        </div>

        {/* Main Content: Centered Vintage Typography */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center">
          <div className="w-16 h-16 mb-4">
             <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" stroke="#2B3E50" strokeWidth="12" fill="none" />
                <circle cx="50" cy="50" r="25" stroke="#E67E22" strokeWidth="8" fill="none" />
             </svg>
          </div>
          <h3 className="text-4xl font-black text-[#2B3E50] tracking-tighter mb-1 uppercase">RETRO SPORT</h3>
          <p className="text-[11px] font-bold text-[#E67E22] uppercase tracking-[0.3em]">VINTAGE INSPIRED & SPORTY</p>
        </div>

        {/* Bottom Section: Three signature racing lines acting as progress bar */}
        <div className="absolute bottom-6 left-0 right-0 px-8 flex flex-col gap-1.5 z-10">
           {/* Line 1: Navy */}
           <div className="w-full h-1 bg-[#2B3E50]/10 rounded-full overflow-hidden">
              <div className="h-full w-full bg-[#2B3E50]" />
           </div>
           {/* Line 2: Cream gap line */}
           <div className="w-full h-1 bg-[#2B3E50]/5 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-[#E67E22]" />
           </div>
           {/* Line 3: Progress Line (Red/Orange) */}
           <div className="w-full h-1.5 bg-[#E67E22]/10 rounded-full overflow-hidden">
              <div className="h-full w-[60%] bg-[#E67E22] shadow-[0_0_10px_rgba(230,126,34,0.3)]" />
           </div>
        </div>

        {isActive && (
          <div className="absolute inset-0 border-4 border-[#2B3E50]/10 rounded-[2.5rem] pointer-events-none" />
        )}
      </div>
    );
  }

  if (theme.id === 'zen') {
    return (
      <div className={`absolute inset-0 bg-[#F9F8F6] flex items-center justify-center overflow-hidden transition-all duration-500 ${isActive ? 'border-2 border-zinc-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)]' : 'border border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'}`}>
        
        {/* Subtle paper texture */}
        <div className="absolute inset-0 opacity-[0.5] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />

        {/* Left Post (Sword hilt / Torii post) */}
        <div className="absolute left-[-1rem] top-0 bottom-0 w-56 pointer-events-none z-10">
          <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="metal" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#0a0a0a"/>
                <stop offset="20%" stopColor="#333333"/>
                <stop offset="40%" stopColor="#666666"/>
                <stop offset="60%" stopColor="#333333"/>
                <stop offset="100%" stopColor="#0a0a0a"/>
              </linearGradient>
              <linearGradient id="metalH" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0a0a0a"/>
                <stop offset="20%" stopColor="#333333"/>
                <stop offset="40%" stopColor="#666666"/>
                <stop offset="60%" stopColor="#333333"/>
                <stop offset="100%" stopColor="#0a0a0a"/>
              </linearGradient>
              <linearGradient id="fadeB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="40%" stopColor="#fff" stopOpacity="1"/>
                <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="fadeLR" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fff" stopOpacity="0"/>
                <stop offset="25%" stopColor="#fff" stopOpacity="1"/>
                <stop offset="75%" stopColor="#fff" stopOpacity="1"/>
                <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
              </linearGradient>
              <mask id="maskB"><rect width="200" height="200" fill="url(#fadeB)"/></mask>
              <mask id="maskLR"><rect width="200" height="200" fill="url(#fadeLR)"/></mask>
              <filter id="blur"><feGaussianBlur stdDeviation="3"/></filter>
            </defs>

            {/* Smudges */}
            <rect x="10" y="62" width="180" height="12" fill="#000" opacity="0.5" filter="url(#blur)" mask="url(#maskLR)"/>
            <rect x="85" y="20" width="30" height="180" fill="#000" opacity="0.4" filter="url(#blur)" mask="url(#maskB)"/>

            <g mask="url(#maskB)">
              {/* Horizontal Bar */}
              <rect x="10" y="64" width="180" height="8" fill="url(#metalH)" mask="url(#maskLR)"/>
              
              {/* Vertical Post Main */}
              <rect x="92" y="45" width="16" height="155" fill="url(#metal)"/>
              
              {/* Top Details */}
              {/* Spike */}
              <path d="M 98 16 L 102 16 L 100 10 Z" fill="#222"/>
              {/* Bead */}
              <circle cx="100" cy="20" r="4" fill="url(#metal)"/>
              {/* Flare 1 */}
              <path d="M 96 24 L 104 24 L 108 30 L 92 30 Z" fill="url(#metal)"/>
              {/* Cylinder */}
              <rect x="94" y="30" width="12" height="10" fill="url(#metal)"/>
              {/* Flare 2 */}
              <path d="M 94 40 L 106 40 L 110 46 L 90 46 Z" fill="url(#metal)"/>
              
              {/* Intersection Collar */}
              <rect x="88" y="60" width="24" height="16" fill="url(#metal)" rx="2"/>
              {/* Center Hole */}
              <circle cx="100" cy="68" r="2.5" fill="#000"/>
            </g>
          </svg>
        </div>

        {/* Right Ink Wash */}
        <div className="absolute right-[-2rem] bottom-[-2rem] w-80 h-80 pointer-events-none opacity-[0.85] mix-blend-multiply z-0">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <filter id="watercolor" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
                <feGaussianBlur stdDeviation="5" />
              </filter>
              <filter id="watercolor-detail" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
            
            {/* Broad light wash */}
            <g filter="url(#watercolor)" opacity="0.3">
              <path d="M 20 200 Q 120 140 200 60 L 200 200 Z" fill="#000" />
              <circle cx="150" cy="150" r="70" fill="#000" />
            </g>
            
            {/* Darker detailed core */}
            <g filter="url(#watercolor-detail)" opacity="0.9">
              <path d="M 60 200 Q 150 150 200 100 L 200 200 Z" fill="#111" />
              <circle cx="170" cy="170" r="50" fill="#000" />
              <circle cx="130" cy="180" r="30" fill="#000" />
              <circle cx="180" cy="130" r="25" fill="#1a1a1a" />
              {/* Extra splatters */}
              <circle cx="100" cy="170" r="8" fill="#000" />
              <circle cx="150" cy="120" r="10" fill="#111" />
              <circle cx="120" cy="140" r="5" fill="#000" />
              <circle cx="180" cy="90" r="6" fill="#111" />
            </g>
          </svg>
        </div>

        {/* Red Line */}
        <div className="absolute bottom-[28%] left-[8rem] right-[4.5rem] h-[2px] bg-[#8B0000] opacity-90 z-10" />

        {/* Text */}
        <div className="relative z-20 flex items-center justify-center w-full h-full">
          <h3 className="text-[3.8rem] font-black text-black tracking-widest" style={{ fontFamily: "'Ma Shan Zheng', cursive", transform: 'translateY(-15px)' }}>ZEN INK</h3>
        </div>

        {/* Right Metal Ring */}
        <div className="absolute right-3 top-3 w-[4.5rem] h-[4.5rem] z-20 rounded-full bg-[#111] p-[1.5px] shadow-[0_5px_8px_rgba(0,0,0,0.4)]">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#fff] via-[#aaa] to-[#444] p-[4px]">
            <div className="w-full h-full rounded-full bg-[#000] p-[1.5px]">
              <div className="w-full h-full rounded-full bg-[#F9F8F6] shadow-[inset_0_4px_6px_rgba(0,0,0,0.7)]"></div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ backgroundColor: theme.bg }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
        <h3 className="text-2xl font-black tracking-tight mb-1 text-center" style={{ color: theme.text }}>{theme.name}</h3>
        <p className="text-[9px] font-bold tracking-[0.3em] opacity-40 uppercase text-center" style={{ color: theme.text }}>{theme.mood}</p>
      </div>
    </div>
  );
};

export default ThemeCardVisual;
