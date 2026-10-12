import React from 'react';
import { Activity, Database, Flame, Layers, Sliders, Play, Sparkles } from 'lucide-react';
import { ClusterStatus } from '../types';
import { AnimatedOtterLogo } from './AnimatedOtterLogo';

interface NavbarProps {
  currentMode: 'landing' | 'console';
  setMode: (mode: 'landing' | 'console') => void;
  clusterStatus: ClusterStatus | null;
  onOpenIncludeData: () => void;
  onWatchLaunchVideo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  setMode,
  clusterStatus,
  onOpenIncludeData,
  onWatchLaunchVideo,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Clean Brand Zone & Mascot Logo */}
        <div className="flex items-center gap-3">
          <AnimatedOtterLogo
            size={36}
            onClick={() => setMode('landing')}
          />
          <button
            onClick={() => setMode('landing')}
            className="text-left font-mono text-base font-bold tracking-tight text-white hover:text-emerald-300 transition-colors whitespace-nowrap"
          >
            recsys<span className="text-emerald-400">-jev</span>
          </button>
        </div>

        {/* Center: Mode Switcher */}
        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/90 p-1">
          <button
            onClick={() => setMode('landing')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              currentMode === 'landing'
                ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-emerald-400" />
            <span>Overview &amp; Docs</span>
          </button>
          <button
            onClick={() => setMode('console')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              currentMode === 'console'
                ? 'bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-indigo-400" />
            <span>Playground Dashboard</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>

        {/* Right: Telemetry & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-400 border-r border-slate-800 pr-4">
            <div className="flex items-center gap-1.5" title="Cluster Throughput">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>{clusterStatus ? `${clusterStatus.system1_throughput_rps.toLocaleString()} RPS` : '4,250 RPS'}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Cache Hit Rate">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span>{clusterStatus ? `${(clusterStatus.cache_hit_rate * 100).toFixed(1)}% Hit` : '94.2% Hit'}</span>
            </div>
          </div>

          {/* Launch Video Action Button */}
          <button
            onClick={onWatchLaunchVideo}
            className="flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500/15 px-3 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/25 hover:border-teal-400 hover:text-white transition-all shadow-md shadow-teal-950/40"
            title="Watch the official launch trailer starring Jevvy the Cyber Otter"
          >
            <Play className="h-3.5 w-3.5 fill-current text-teal-400" />
            <span className="hidden sm:inline">Launch Video</span>
            <span className="sm:hidden">Trailer</span>
          </button>

          <button
            onClick={onOpenIncludeData}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:from-emerald-500/30 hover:to-teal-500/30 hover:border-emerald-400 hover:text-white transition-all shadow-md shadow-emerald-950/60"
            title="Include your data: input custom user personas, candidate items, or feedback signals to run through the pipeline and evaluate against benchmarks"
          >
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span>Include Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
