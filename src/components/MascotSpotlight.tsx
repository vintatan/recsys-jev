import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  Volume2,
  CheckCircle2,
  ShieldCheck,
  Award,
  Terminal,
  Layers,
} from 'lucide-react';
import { AnimatedOtterMascot } from './AnimatedOtterMascot';
import { soundSynth } from '../utils/audioEffects';

interface MascotSpotlightProps {
  onWatchVideo: () => void;
  onOpenConsole: (tab: 'workbench' | 'benchmarks' | 'pipeline') => void;
}

export const MascotSpotlight: React.FC<MascotSpotlightProps> = ({
  onWatchVideo,
  onOpenConsole,
}) => {
  const [viewMode, setViewMode] = useState<'animated' | '3d-render'>('animated');
  const [renderPose, setRenderPose] = useState<'avatar' | 'celebrating'>('avatar');

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950 to-emerald-950/20 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Animated Otter Mascot or 3D Render */}
        <div className="lg:col-span-5 flex flex-col items-center text-center">
          {/* View Mode Switcher Pill */}
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/90 p-1 text-xs">
            <button
              onClick={() => {
                setViewMode('animated');
                soundSynth.playPop();
              }}
              className={`rounded-full px-3 py-1 font-semibold transition-all ${
                viewMode === 'animated'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🦦 Live Animated Mascot
            </button>
            <button
              onClick={() => {
                setViewMode('3d-render');
                soundSynth.playPop();
              }}
              className={`rounded-full px-3 py-1 font-semibold transition-all ${
                viewMode === '3d-render'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎨 3D Render
            </button>
          </div>

          {viewMode === 'animated' ? (
            <div className="w-full flex justify-center">
              <AnimatedOtterMascot
                size="md"
                showControls={true}
                onLaunchVideo={onWatchVideo}
              />
            </div>
          ) : (
            <div className="relative group flex flex-col items-center">
              <div className="relative h-64 w-64 sm:h-72 sm:w-72 overflow-hidden rounded-3xl border-2 border-emerald-400/80 bg-slate-950 shadow-2xl">
                <img
                  src={
                    renderPose === 'avatar'
                      ? '/src/assets/images/jevvy_mascot_avatar_1791604927727.jpg'
                      : '/src/assets/images/mascot_celebrating_1791604951714.jpg'
                  }
                  alt="Jevvy the Cyber Otter Mascot"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-950/80 border border-emerald-400/60 px-3 py-1 backdrop-blur-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-[11px] font-bold text-emerald-300">
                    {renderPose === 'avatar' ? 'Recommended Pose ⭐' : 'Victory Cheers 🎉'}
                  </span>
                </div>
              </div>

              {/* 3D Render Pose selector buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setRenderPose('avatar')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    renderPose === 'avatar'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  Recommended Star
                </button>
                <button
                  onClick={() => setRenderPose('celebrating')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    renderPose === 'celebrating'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  Double Thumbs Up
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Mascot Story & Technical Role */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Official Mascot &bull; Decision-Oriented AI</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Meet <span className="text-emerald-400">Jevvy the Cyber Otter</span> 🦦
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Jevvy is the energetic guardian of sub-second recommendation SLAs! While traditional pointwise LLMs take 
            <span className="text-red-400 font-mono font-bold"> 14.8 seconds</span> to evaluate 200 candidates, 
            Jevvy calculates discrete choice probabilities <span className="text-emerald-400 font-mono font-bold">P(i | S_u, C_u^(K))</span> in under <span className="text-emerald-300 font-mono font-bold">600ms</span>.
          </p>

          {/* Mascot Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-[11px] font-mono text-slate-400">Serving SLA</p>
              <p className="text-lg font-bold font-mono text-emerald-400">&lt; 900ms</p>
              <p className="text-[10px] text-slate-500">Zero latency spikes</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-[11px] font-mono text-slate-400">Candidate Pool</p>
              <p className="text-lg font-bold font-mono text-cyan-400">K = 200 Items</p>
              <p className="text-[10px] text-slate-500">Multi-source retrieved</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 col-span-2 sm:col-span-1">
              <p className="text-[11px] font-mono text-slate-400">Architecture</p>
              <p className="text-lg font-bold font-mono text-teal-400">System 1 + 2</p>
              <p className="text-[10px] text-slate-500">Jev + Gemini Flash</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onWatchVideo}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all hover:scale-102"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Watch Launch Video (45s Motion Designed)</span>
            </button>
            <button
              onClick={() => onOpenConsole('workbench')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>Launch RecSys Workbench</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
