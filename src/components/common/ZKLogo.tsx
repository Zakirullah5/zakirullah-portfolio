import React from 'react';

interface ZKLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  animated?: boolean;
}

export const ZKLogo: React.FC<ZKLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  animated = false
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-base', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-2xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Golden/Purple Emblem Icon */}
      <div className={`relative ${current.icon} flex items-center justify-center flex-shrink-0 group`}>
        {/* Glow backdrop */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-amber-500/30 via-purple-600/30 to-blue-500/30 rounded-xl blur-md ${animated ? 'animate-pulse' : ''}`} />
        
        {/* Emblem Shield */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#18181b] border border-amber-400/40 p-0.5 shadow-[0_0_15px_rgba(234,179,8,0.25)] flex items-center justify-center overflow-hidden">
          {/* Subtle inner grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:6px_6px] opacity-25" />
          
          {/* ZK Monogram */}
          <div className="relative font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="text-amber-400">Z</span>
            <span className="text-amber-200 -ml-0.5">K</span>
          </div>

          {/* Tiny Crown accent */}
          <div className="absolute top-0.5 text-[8px] text-amber-300">👑</div>
        </div>
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col leading-none">
        <span className={`font-display font-black tracking-wider text-white ${current.text} flex items-center gap-1`}>
          ZAKIRULLAH
        </span>
        {showSubtitle && (
          <span className={`font-sans tracking-[0.25em] text-amber-400/90 uppercase font-semibold mt-0.5 ${current.sub}`}>
            Creative Studio
          </span>
        )}
      </div>
    </div>
  );
};
