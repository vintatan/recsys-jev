import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Play,
  Heart,
  Zap,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { soundSynth } from '../utils/audioEffects';
import { AnimatedOtterLogo } from './AnimatedOtterLogo';

interface MascotCompanionProps {
  onWatchVideo: () => void;
  onOpenWorkbench: () => void;
}

const MASCOT_MESSAGES = [
  "Hi there! I'm Jevvy the Cyber Otter 🦦! Your sub-900ms recommendation guardian!",
  "Did you know? Pointwise LLMs take 14.8s at K=200, but our System 1 model finishes in under 600ms! ⚡",
  "We paired Gorse's multi-source candidate generator with Decision-Oriented Choice Reranking! 🎯",
  "Check out our new Launch Video! Watch me blast off with high-speed recs! 🚀",
  "System 1 calculates choice probabilities, and Gemini Flash provides selective micro-copy! 🧠",
  "Fully reproducible! Try `docker compose up -d` to spin up Master, Worker, and Redis in seconds! 🐳",
];

export const MascotCompanion: React.FC<MascotCompanionProps> = ({
  onWatchVideo,
  onOpenWorkbench,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isWaving, setIsWaving] = useState(true);

  useEffect(() => {
    // Periodic message rotation
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MASCOT_MESSAGES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const handleMascotClick = () => {
    setIsOpen(!isOpen);
    setHasInteracted(true);
    if (!isMuted) {
      soundSynth.playMascotChirp();
    }
  };

  const handleNextMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMessageIndex((prev) => (prev + 1) % MASCOT_MESSAGES.length);
    if (!isMuted) {
      soundSynth.playMascotChirp();
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundSynth.setMuted(nextState);
    if (!nextState) {
      soundSynth.playMascotChirp();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Speech Bubble / Expandable Card */}
      {isOpen ? (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <AnimatedOtterLogo size={40} interactive={false} />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-white text-sm">Jevvy the Otter</h4>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                    Official Mascot
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Decision-AI Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleSound}
                className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mascot Message */}
          <div className="py-3">
            <div className="relative rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 text-xs leading-relaxed text-slate-200">
              <p>{MASCOT_MESSAGES[messageIndex]}</p>
              <button
                onClick={handleNextMessage}
                className="mt-2 flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300"
              >
                <span>Another tip</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onWatchVideo();
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all hover:scale-[1.02]"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Launch Video</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenWorkbench();
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition-all"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Try Playground</span>
            </button>
          </div>
        </div>
      ) : (
        /* Floating Minimized Mascot Trigger */
        <div className="relative group flex items-center">
          {/* Gentle Preview Tooltip */}
          {!hasInteracted && (
            <div className="mr-3 hidden sm:flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-slate-900/90 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-md animate-bounce">
              <span className="text-emerald-400 font-bold">Jevvy:</span>
              <span className="text-slate-200">Watch our new Launch Video! 🎬</span>
              <button
                onClick={() => onWatchVideo()}
                className="underline text-emerald-300 hover:text-emerald-200 text-xs ml-1 font-semibold"
              >
                Play
              </button>
            </div>
          )}

          <AnimatedOtterLogo
            size={56}
            onClick={handleMascotClick}
            className="shadow-2xl shadow-emerald-500/30"
          />
        </div>
      )}
    </div>
  );
};
