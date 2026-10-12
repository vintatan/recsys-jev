import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Zap,
  Heart,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  Fish,
  RotateCcw,
  MessageSquare,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundSynth } from '../utils/audioEffects';

export type OtterMood = 'idle' | 'turbo' | 'star' | 'snack' | 'celebrate';

interface AnimatedOtterMascotProps {
  initialMood?: OtterMood;
  showControls?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  onLaunchVideo?: () => void;
  className?: string;
}

const QUOTES = [
  "Hi! I'm Jevvy! 🦦 I make sure your recommendations arrive in <900ms, not 15 seconds!",
  "Decision-Oriented RecSys treats user history as State S_u and retrieved items as Discrete Choice Alternatives C_u!",
  "Gorse distributed worker nodes scale candidate retrieval effortlessly while Jev scores choice probabilities!",
  "Confidence gating with P(i | S_u, C_u) > 0.85 saves 94% on LLM explanation token bills!",
  "Pointwise LLM latency blows up exponentially to 14.8s at K=200. We keep it sub-second!",
  "Verified on Amazon Reviews 2023 & GitHub GitRec — dominating the Pareto frontier!",
];

export const AnimatedOtterMascot: React.FC<AnimatedOtterMascotProps> = ({
  initialMood = 'idle',
  showControls = true,
  size = 'md',
  onLaunchVideo,
  className = '',
}) => {
  const [mood, setMood] = useState<OtterMood>(initialMood);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPetting, setIsPetting] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [floatingOffset, setFloatingOffset] = useState(0);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // Natural blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  // Smooth floating bobbing motion
  useEffect(() => {
    let frameId: number;
    let startTime = performance.now();

    const animateFloat = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const speed = mood === 'turbo' ? 4.5 : 1.8;
      const amplitude = mood === 'turbo' ? 8 : 5;
      setFloatingOffset(Math.sin(elapsed * speed) * amplitude);
      frameId = requestAnimationFrame(animateFloat);
    };

    frameId = requestAnimationFrame(animateFloat);
    return () => cancelAnimationFrame(frameId);
  }, [mood]);

  // Mouse tracking for pupils
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    setPupilOffset({
      x: Math.max(-3, Math.min(3, deltaX * 3)),
      y: Math.max(-2, Math.min(2, deltaY * 2)),
    });
  };

  const handleMouseLeave = () => {
    setPupilOffset({ x: 0, y: 0 });
  };

  // Petting interaction
  const handlePet = (e?: React.MouseEvent) => {
    setIsPetting(true);
    if (!isMuted) soundSynth.playPurr();

    // Generate floating hearts
    const newHeart = {
      id: Date.now() + Math.random(),
      x: e ? e.nativeEvent.offsetX : 100 + Math.random() * 40,
      y: e ? e.nativeEvent.offsetY : 60 + Math.random() * 20,
    };
    setHearts((prev) => [...prev.slice(-5), newHeart]);

    setTimeout(() => setIsPetting(false), 600);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
  };

  // Change mood with sound and visual flair
  const handleSetMood = (nextMood: OtterMood) => {
    setMood(nextMood);
    if (isMuted) return;

    if (nextMood === 'turbo') {
      soundSynth.playLaserScan();
      soundSynth.playWhoosh();
    } else if (nextMood === 'star') {
      soundSynth.playMascotChirp();
    } else if (nextMood === 'snack') {
      soundSynth.playCrunch();
    } else if (nextMood === 'celebrate') {
      soundSynth.playCheer();
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899'],
      });
    } else {
      soundSynth.playPop();
    }
  };

  const handleNextQuote = () => {
    if (!isMuted) soundSynth.playMascotChirp();
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundSynth.setMuted(next);
  };

  // Dimensions based on size prop
  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    hero: 'max-w-xl w-full',
  }[size];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none flex flex-col items-center ${sizeClasses} ${className}`}
    >
      {/* Speech Bubble */}
      <div className="relative mb-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div
          onClick={handleNextQuote}
          className="group relative cursor-pointer rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-3.5 shadow-xl shadow-emerald-950/30 backdrop-blur-md transition-all hover:border-emerald-400 hover:bg-slate-900"
        >
          <div className="flex items-start gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <MessageSquare className="h-3.5 w-3.5" />
            </span>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Jevvy&apos;s RecSys Wisdom
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-emerald-300 transition-colors">
                  Tap for next tip &rarr;
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed font-sans">
                {QUOTES[quoteIndex]}
              </p>
            </div>
          </div>
          {/* Speech bubble tail pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-emerald-500/40" />
        </div>
      </div>

      {/* Mascot Stage Container */}
      <div className="relative flex flex-col items-center justify-center p-4">
        {/* Ambient Halo & Energy Rings */}
        <div
          className={`absolute h-48 w-48 sm:h-56 sm:w-56 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            mood === 'turbo'
              ? 'bg-gradient-to-tr from-cyan-500/35 via-emerald-400/30 to-blue-500/35 scale-125'
              : mood === 'celebrate'
              ? 'bg-gradient-to-tr from-amber-400/35 via-pink-500/30 to-emerald-400/35 scale-115'
              : 'bg-gradient-to-tr from-emerald-500/25 via-teal-400/20 to-indigo-500/25 scale-100'
          }`}
        />

        {/* Floating Heart Particles */}
        {hearts.map((h) => (
          <div
            key={h.id}
            style={{ left: `${h.x}px`, top: `${h.y}px` }}
            className="pointer-events-none absolute z-30 animate-out fade-out slide-out-to-top-8 duration-1000 flex items-center gap-1 text-pink-400 text-xs font-bold"
          >
            <Heart className="h-4 w-4 fill-pink-500 text-pink-400" />
            <span className="text-[10px]">+100 Purr</span>
          </div>
        ))}

        {/* Vector Animated Otter Mascot (SVG) */}
        <div
          onClick={handlePet}
          style={{ transform: `translateY(${floatingOffset}px)` }}
          className="relative cursor-pointer transition-transform duration-150"
          title="Click to pet Jevvy!"
        >
          {/* Speed Streaks in Turbo Mode */}
          {mood === 'turbo' && (
            <div className="absolute inset-0 -inset-x-8 pointer-events-none flex flex-col justify-around opacity-75">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
              <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse delay-75" />
              <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse delay-150" />
            </div>
          )}

          {/* Core SVG Mascot Illustration */}
          <svg
            viewBox="0 0 240 240"
            className="w-48 h-48 sm:w-56 sm:h-56 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
          >
            <defs>
              {/* Fur Gradients */}
              <linearGradient id="otterFur" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8c5839" />
                <stop offset="100%" stopColor="#54301d" />
              </linearGradient>
              <linearGradient id="otterBelly" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f3dec9" />
                <stop offset="100%" stopColor="#dfbe9f" />
              </linearGradient>
              {/* Cyber Visor Gradient */}
              <linearGradient id="cyberVisor" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              {/* Star Gold Gradient */}
              <linearGradient id="goldStar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              {/* Laser Scan Gradient */}
              <linearGradient id="laserBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
                <stop offset="50%" stopColor="rgba(16, 185, 129, 0.9)" />
                <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
              </linearGradient>
            </defs>

            {/* Float Pod / Energy Ripple Beneath Otter */}
            <ellipse
              cx="120"
              cy="215"
              rx="65"
              ry="14"
              fill="rgba(16, 185, 129, 0.15)"
              className="animate-pulse"
            />
            <ellipse
              cx="120"
              cy="215"
              rx="42"
              ry="9"
              fill="rgba(6, 182, 212, 0.25)"
            />
            <ellipse
              cx="120"
              cy="215"
              rx="20"
              ry="4"
              fill="rgba(255, 255, 255, 0.4)"
            />

            {/* Otter Swimming Tail */}
            <path
              d={
                mood === 'turbo'
                  ? 'M155,165 Q205,185 210,150 Q195,140 160,152 Z'
                  : 'M155,165 Q195,190 190,165 Q175,145 155,152 Z'
              }
              fill="url(#otterFur)"
              className="transition-all duration-300"
            />

            {/* Cyber Jet Backpack */}
            <g transform="translate(68, 120)">
              {/* Backpack Chassis */}
              <rect
                x="0"
                y="0"
                width="22"
                height="45"
                rx="6"
                fill="#1e293b"
                stroke="#06b6d4"
                strokeWidth="2"
              />
              {/* Thruster exhaust glow */}
              <ellipse
                cx="11"
                cy="46"
                rx="6"
                ry="3"
                fill="#06b6d4"
                className="animate-pulse"
              />
              {/* Glowing lightning bolt emblem */}
              <path
                d="M12,8 L7,24 L13,24 L10,38 L18,20 L12,20 Z"
                fill="#10b981"
                className="filter drop-shadow-[0_0_4px_#10b981]"
              />
            </g>

            {/* Otter Body & Belly */}
            <ellipse cx="120" cy="155" rx="46" ry="48" fill="url(#otterFur)" />
            {/* Cream Belly */}
            <ellipse cx="120" cy="160" rx="30" ry="36" fill="url(#otterBelly)" />

            {/* Ears */}
            {/* Left Ear */}
            <g
              transform="translate(68, 62)"
              className={isPetting ? 'rotate-[-10deg]' : ''}
            >
              <circle cx="10" cy="10" r="14" fill="url(#otterFur)" />
              <circle cx="10" cy="10" r="8" fill="#d98282" />
            </g>
            {/* Right Ear */}
            <g
              transform="translate(152, 62)"
              className={isPetting ? 'rotate-[10deg]' : ''}
            >
              <circle cx="10" cy="10" r="14" fill="url(#otterFur)" />
              <circle cx="10" cy="10" r="8" fill="#d98282" />
            </g>

            {/* Otter Head */}
            <ellipse cx="120" cy="98" rx="48" ry="44" fill="url(#otterFur)" />

            {/* Cheeks / Muzzle */}
            <ellipse cx="120" cy="115" rx="34" ry="22" fill="url(#otterBelly)" />
            <circle cx="108" cy="116" r="13" fill="url(#otterBelly)" />
            <circle cx="132" cy="116" r="13" fill="url(#otterBelly)" />

            {/* Whiskers */}
            <g stroke="#334155" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
              {/* Left Whiskers */}
              <line x1="94" y1="113" x2="62" y2="108" />
              <line x1="93" y1="118" x2="60" y2="119" />
              <line x1="94" y1="123" x2="64" y2="129" />
              {/* Right Whiskers */}
              <line x1="146" y1="113" x2="178" y2="108" />
              <line x1="147" y1="118" x2="180" y2="119" />
              <line x1="146" y1="123" x2="176" y2="129" />
            </g>

            {/* Nose */}
            <polygon
              points="114,107 126,107 120,115"
              fill="#1e1e24"
              stroke="#0f172a"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Nose shine */}
            <ellipse cx="118" cy="109" rx="2" ry="1" fill="#ffffff" opacity="0.8" />

            {/* Smiling Mouth */}
            <path
              d={
                mood === 'celebrate' || isPetting
                  ? 'M111,118 Q120,130 129,118'
                  : 'M113,118 Q120,124 127,118'
              }
              fill={mood === 'celebrate' ? '#be185d' : 'none'}
              stroke="#1e1e24"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Eyes or Eye Blinks */}
            {isBlinking || mood === 'celebrate' ? (
              /* Joyful Closed Eyes Crescents */
              <g stroke="#1e1e24" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M96,93 Q104,85 112,93" />
                <path d="M128,93 Q136,85 144,93" />
              </g>
            ) : (
              /* Big Expressive Anime/Pixar Eyes with specular shines */
              <g>
                {/* Left Eye */}
                <ellipse cx="104" cy="90" rx="9" ry="11" fill="#0f172a" />
                <ellipse
                  cx={104 + pupilOffset.x}
                  cy={90 + pupilOffset.y}
                  rx="6"
                  ry="8"
                  fill="#1e293b"
                />
                {/* Shines */}
                <circle cx={102 + pupilOffset.x * 0.5} cy={87} r="3" fill="#ffffff" />
                <circle cx={106 + pupilOffset.x * 0.5} cy={93} r="1.5" fill="#ffffff" />

                {/* Right Eye */}
                <ellipse cx="136" cy="90" rx="9" ry="11" fill="#0f172a" />
                <ellipse
                  cx={136 + pupilOffset.x}
                  cy={90 + pupilOffset.y}
                  rx="6"
                  ry="8"
                  fill="#1e293b"
                />
                {/* Shines */}
                <circle cx={134 + pupilOffset.x * 0.5} cy={87} r="3" fill="#ffffff" />
                <circle cx={138 + pupilOffset.x * 0.5} cy={93} r="1.5" fill="#ffffff" />
              </g>
            )}

            {/* Cyber Visor Headband */}
            <g>
              {/* Strap */}
              <path
                d="M74,80 Q120,68 166,80"
                stroke="#0f172a"
                strokeWidth="5"
                fill="none"
              />
              {/* Visor Glass Arc */}
              <path
                d="M80,78 Q120,68 160,78 L157,90 Q120,80 83,90 Z"
                fill="url(#cyberVisor)"
                opacity="0.85"
                stroke="#38bdf8"
                strokeWidth="1.5"
                className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
              {/* Visor Laser Scan Bar */}
              <rect
                x="84"
                y="80"
                width="72"
                height="3"
                fill="url(#laserBeam)"
                className="animate-pulse"
              />
              {/* Digital readout dots */}
              <circle cx="88" cy="84" r="1.8" fill="#ffffff" />
              <circle cx="152" cy="84" r="1.8" fill="#10b981" />
            </g>

            {/* Paws and Accessories based on Mood */}
            {/* 1. STAR MOOD: Holding Golden Recommendation Star */}
            {mood === 'star' && (
              <g transform="translate(100, 138)">
                {/* Glowing Star Halo */}
                <circle cx="20" cy="20" r="24" fill="rgba(245, 158, 11, 0.25)" />
                {/* Golden 5-pointed Star */}
                <polygon
                  points="20,2 25,14 38,15 28,24 31,37 20,30 9,37 12,24 2,15 15,14"
                  fill="url(#goldStar)"
                  stroke="#ffffff"
                  strokeWidth="1"
                  className="filter drop-shadow-[0_0_6px_#f59e0b]"
                />
                {/* Paws grasping star */}
                <ellipse cx="6" cy="22" rx="7" ry="6" fill="url(#otterFur)" />
                <ellipse cx="34" cy="22" rx="7" ry="6" fill="url(#otterFur)" />
              </g>
            )}

            {/* 2. SNACK MOOD: Holding Cyber Salmon Fish */}
            {mood === 'snack' && (
              <g transform="translate(95, 145)">
                {/* Holographic Cyber Salmon */}
                <path
                  d="M5,12 Q25,0 45,12 Q25,24 5,12 Z"
                  fill="#06b6d4"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  className="filter drop-shadow-[0_0_4px_#06b6d4]"
                />
                {/* Fish Tail */}
                <polygon points="45,12 55,5 55,19" fill="#0284c7" />
                {/* Fish Eye */}
                <circle cx="12" cy="12" r="2" fill="#ffffff" />
                {/* Paws holding fish */}
                <ellipse cx="18" cy="14" rx="6" ry="6" fill="url(#otterFur)" />
                <ellipse cx="36" cy="14" rx="6" ry="6" fill="url(#otterFur)" />
              </g>
            )}

            {/* 3. TURBO MOOD: Fast typing on holographic pad */}
            {mood === 'turbo' && (
              <g transform="translate(86, 148)">
                {/* Holographic Touchpad */}
                <polygon
                  points="0,15 68,15 58,32 10,32"
                  fill="rgba(6, 182, 212, 0.3)"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                />
                <line
                  x1="15"
                  y1="23"
                  x2="53"
                  y2="23"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                {/* Typing Paws moving rapidly */}
                <ellipse cx="22" cy="18" rx="7" ry="6" fill="url(#otterFur)" />
                <ellipse cx="46" cy="18" rx="7" ry="6" fill="url(#otterFur)" />
              </g>
            )}

            {/* 4. CELEBRATE MOOD: Double Thumbs-Up Victory Wave */}
            {mood === 'celebrate' && (
              <g>
                {/* Left Paw Up */}
                <g transform="translate(62, 110)">
                  <ellipse cx="12" cy="12" rx="9" ry="8" fill="url(#otterFur)" />
                  <rect x="7" y="0" width="6" height="12" rx="3" fill="url(#otterFur)" />
                </g>
                {/* Right Paw Up */}
                <g transform="translate(154, 110)">
                  <ellipse cx="12" cy="12" rx="9" ry="8" fill="url(#otterFur)" />
                  <rect x="11" y="0" width="6" height="12" rx="3" fill="url(#otterFur)" />
                </g>
              </g>
            )}

            {/* 5. IDLE / DEFAULT MOOD: Sweet Resting Paws & Friendly Waving */}
            {mood === 'idle' && (
              <g>
                {/* Left Resting Paw */}
                <ellipse cx="94" cy="162" rx="8" ry="7" fill="url(#otterFur)" />
                {/* Right Waving Paw */}
                <g
                  transform="translate(142, 142)"
                  className="animate-bounce origin-bottom"
                >
                  <ellipse cx="10" cy="10" rx="8" ry="8" fill="url(#otterFur)" />
                  <circle cx="8" cy="7" r="2" fill="#dfbe9f" />
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Floating Telemetry Badge directly under otter */}
        <div className="mt-2 flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 shadow-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px] font-semibold text-emerald-300">
            {mood === 'turbo' && '⚡ Turbo Rerank: 420ms | K=200'}
            {mood === 'star' && '🌟 P(item | S_u, C_u) = 0.963'}
            {mood === 'snack' && '🐟 Processing Fresh Feedback Stream'}
            {mood === 'celebrate' && '🎉 100% Production Cluster SLA'}
            {mood === 'idle' && '🦦 Jevvy Ready &bull; System 1 Guard'}
          </span>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      {showControls && (
        <div className="mt-3 w-full space-y-2.5">
          {/* Mood Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xs">
            <button
              onClick={() => handleSetMood('idle')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                mood === 'idle'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🦦 Float</span>
            </button>
            <button
              onClick={() => handleSetMood('turbo')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                mood === 'turbo'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="h-3 w-3" />
              <span>Turbo</span>
            </button>
            <button
              onClick={() => handleSetMood('star')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                mood === 'star'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>Star</span>
            </button>
            <button
              onClick={() => handleSetMood('snack')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                mood === 'snack'
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Fish className="h-3 w-3" />
              <span>Snack</span>
            </button>
            <button
              onClick={() => handleSetMood('celebrate')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                mood === 'celebrate'
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🎉 Cheers</span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <button
              onClick={() => handlePet()}
              className="flex items-center gap-1.5 rounded-lg border border-pink-500/30 bg-pink-950/20 px-3 py-1.5 text-pink-300 hover:bg-pink-900/30 hover:border-pink-500/50 transition-colors"
            >
              <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-400" />
              <span>Pet Jevvy</span>
            </button>

            {onLaunchVideo && (
              <button
                onClick={onLaunchVideo}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-3 py-1.5 font-semibold text-emerald-300 hover:bg-emerald-900/40 hover:text-white transition-colors"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Launch Video</span>
              </button>
            )}

            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-lg border transition-colors ${
                isMuted
                  ? 'border-slate-800 text-slate-500 bg-slate-900/60'
                  : 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
              }`}
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
