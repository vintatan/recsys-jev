import React, { useState, useEffect } from 'react';
import { soundSynth } from '../utils/audioEffects';

interface AnimatedOtterLogoProps {
  size?: number | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AnimatedOtterLogo: React.FC<AnimatedOtterLogoProps> = ({
  size = 36,
  interactive = true,
  className = '',
  onClick,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dimension =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 28
      : size === 'md'
      ? 36
      : 44;

  useEffect(() => {
    const timer = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (interactive) {
      soundSynth.playMascotChirp();
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: `${dimension}px`, height: `${dimension}px` }}
      className={`relative select-none flex items-center justify-center rounded-xl bg-slate-950 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 group ${className}`}
      title="Jevvy the Cyber Otter &bull; RecSys Mascot"
    >
      {/* Background cyber radial glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-cyan-500/30 animate-pulse pointer-events-none" />

      {/* SVG Animated Otter Face Logo */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      >
        <defs>
          <linearGradient id="logoFur" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8c5839" />
            <stop offset="100%" stopColor="#54301d" />
          </linearGradient>
          <linearGradient id="logoMuzzle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f3dec9" />
            <stop offset="100%" stopColor="#dfbe9f" />
          </linearGradient>
          <linearGradient id="logoVisor" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Ears */}
        {/* Left Ear */}
        <g className={isHovered ? 'rotate-[-6deg] origin-[25px_30px] transition-transform' : ''}>
          <circle cx="26" cy="30" r="11" fill="url(#logoFur)" />
          <circle cx="26" cy="30" r="6" fill="#d98282" />
        </g>
        {/* Right Ear */}
        <g className={isHovered ? 'rotate-[6deg] origin-[74px_30px] transition-transform' : ''}>
          <circle cx="74" cy="30" r="11" fill="url(#logoFur)" />
          <circle cx="74" cy="30" r="6" fill="#d98282" />
        </g>

        {/* Head */}
        <ellipse cx="50" cy="52" rx="38" ry="34" fill="url(#logoFur)" />

        {/* Muzzle / Cheeks */}
        <ellipse cx="50" cy="65" rx="27" ry="17" fill="url(#logoMuzzle)" />

        {/* Whiskers */}
        <g stroke="#334155" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
          <line x1="32" y1="64" x2="14" y2="61" />
          <line x1="32" y1="68" x2="12" y2="69" />
          <line x1="68" y1="64" x2="86" y2="61" />
          <line x1="68" y1="68" x2="88" y2="69" />
        </g>

        {/* Nose */}
        <polygon points="45,58 55,58 50,65" fill="#1e1e24" />
        <ellipse cx="48" cy="60" rx="1.5" ry="0.8" fill="#ffffff" opacity="0.8" />

        {/* Mouth */}
        <path
          d={isHovered ? 'M44,68 Q50,75 56,68' : 'M45,67 Q50,71 55,67'}
          fill={isHovered ? '#be185d' : 'none'}
          stroke="#1e1e24"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Eyes / Blinking */}
        {isBlinking ? (
          <g stroke="#1e1e24" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M33,48 Q39,43 45,48" />
            <path d="M55,48 Q61,43 67,48" />
          </g>
        ) : (
          <g>
            <ellipse cx="38" cy="47" rx="6" ry="7" fill="#0f172a" />
            <circle cx="36.5" cy="44.5" r="2.2" fill="#ffffff" />
            <circle cx="39.5" cy="48.5" r="1.1" fill="#ffffff" />

            <ellipse cx="62" cy="47" rx="6" ry="7" fill="#0f172a" />
            <circle cx="60.5" cy="44.5" r="2.2" fill="#ffffff" />
            <circle cx="63.5" cy="48.5" r="1.1" fill="#ffffff" />
          </g>
        )}

        {/* Cyber Visor Headband */}
        <path
          d="M18,40 Q50,30 82,40 L79,48 Q50,38 21,48 Z"
          fill="url(#logoVisor)"
          opacity="0.9"
          stroke="#38bdf8"
          strokeWidth="1"
          className="filter drop-shadow-[0_0_4px_#06b6d4]"
        />

        {/* Visor Scan Laser */}
        <line
          x1="22"
          y1="42"
          x2="78"
          y2="42"
          stroke="#ffffff"
          strokeWidth="1"
          strokeOpacity="0.85"
          className="animate-pulse"
        />
        <circle cx="26" cy="42" r="1.5" fill="#ffffff" />
        <circle cx="74" cy="42" r="1.5" fill="#10b981" />
      </svg>

      {/* Online Ping Beacon */}
      <div className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
      <div className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
    </div>
  );
};
