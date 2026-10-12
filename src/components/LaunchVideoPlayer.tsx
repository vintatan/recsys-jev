import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Subtitles,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  BarChart2,
  Terminal,
  X,
  FastForward,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundSynth } from '../utils/audioEffects';
import { AnimatedOtterLogo } from './AnimatedOtterLogo';

interface LaunchVideoPlayerProps {
  isModal?: boolean;
  onClose?: () => void;
  onOpenWorkbench?: () => void;
}

interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  actNumber: number;
  subtitle: string;
  jevvyQuote: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'act1',
    title: '14.8s Latency Crisis',
    startTime: 0,
    endTime: 9,
    actNumber: 1,
    subtitle: 'Pointwise LLM reranking serializes 200 calls, triggering 14.8s latency and 72% cart dropouts.',
    jevvyQuote: "Watch out! The pointwise LLM is melting the servers with 14.8s latency! 🚨",
  },
  {
    id: 'act2',
    title: 'Enter Jevvy & System 1',
    startTime: 9,
    endTime: 18,
    actNumber: 2,
    subtitle: 'Formulating Discrete Choice Alternatives C_u^(K) under Decision State S_u in <620ms.',
    jevvyQuote: "Here I come! Jev System 1 models user choice probabilities at flat latency! ⚡",
  },
  {
    id: 'act3',
    title: 'Hybrid RecFlow Engine',
    startTime: 18,
    endTime: 28,
    actNumber: 3,
    subtitle: 'High-throughput Jev System 1 choice gating (P > 0.85) + Gemini 2.5/Flash selective reasoning.',
    jevvyQuote: "System 1 does the heavy lifting, System 2 crafts human reasoning on Top-3! 🧠",
  },
  {
    id: 'act4',
    title: 'Pareto Frontier Dominance',
    startTime: 28,
    endTime: 37,
    actNumber: 4,
    subtitle: 'Dominating Pareto optimal frontier on Amazon Reviews 2023 & GitHub GitRec benchmarks.',
    jevvyQuote: "Sub-900ms serving SLA with peak NDCG@10. Non-dominated Pareto victory! 📊",
  },
  {
    id: 'act5',
    title: 'Deploy Anywhere & Launch',
    startTime: 37,
    endTime: 45,
    actNumber: 5,
    subtitle: 'Production-ready Apache-2.0 docker compose cluster online in under 30 seconds.',
    jevvyQuote: "Cluster is 100% healthy! Let's blast off and launch your RecSys! 🚀",
  },
];

const TOTAL_DURATION = 45; // seconds

export const LaunchVideoPlayer: React.FC<LaunchVideoPlayerProps> = ({
  isModal = false,
  onClose,
  onOpenWorkbench,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showMascotCam, setShowMascotCam] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraShake, setCameraShake] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastSoundActRef = useRef<number>(0);

  // Video playback loop
  useEffect(() => {
    let animId: number;
    let lastStamp = performance.now();

    const updateFrame = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastStamp) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return next;
        });
      }
      lastStamp = now;
      animId = requestAnimationFrame(updateFrame);
    };

    animId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed]);

  // Dynamic Motion Background Canvas (Particle Stars & Grid Horizon)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 960);
    let height = (canvas.height = canvas.offsetHeight || 540);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      color: string;
    }> = [];

    const numParticles = 75;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        color: Math.random() > 0.5 ? '#10b981' : '#06b6d4',
      });
    }

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Cyber Grid Horizon
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render Floating Particles
      particles.forEach((p) => {
        p.y -= p.speed * (isPlaying ? playbackSpeed * 1.5 : 0.6);
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed]);

  // Current Chapter lookup
  const currentChapter =
    CHAPTERS.find((c) => currentTime >= c.startTime && currentTime < c.endTime) ||
    CHAPTERS[CHAPTERS.length - 1];

  // Sound triggers on Act changes
  useEffect(() => {
    if (!isPlaying) return;
    const act = currentChapter.actNumber;
    if (act !== lastSoundActRef.current) {
      lastSoundActRef.current = act;
      if (!isMuted) {
        soundSynth.playWhoosh();
        if (act === 1) {
          setCameraShake(true);
          soundSynth.playSubBass();
          setTimeout(() => setCameraShake(false), 500);
        } else if (act === 2) {
          soundSynth.playLaserScan();
          soundSynth.playMascotChirp();
          soundSynth.playSynthChord([261.63, 329.63, 392.0, 523.25]); // C major
        } else if (act === 3) {
          soundSynth.playSynthChord([329.63, 392.0, 493.88, 587.33]); // Em7
        } else if (act === 4) {
          soundSynth.playSynthChord([392.0, 493.88, 587.33, 783.99]); // G major
        } else if (act === 5) {
          soundSynth.playFanfare();
          confetti({
            particleCount: 70,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#3b82f6'],
          });
        }
      }
    }
  }, [currentChapter.actNumber, isPlaying, isMuted]);

  const handleTogglePlay = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      lastSoundActRef.current = 0;
    }
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState && !isMuted) {
      soundSynth.playWhoosh();
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    lastSoundActRef.current = 0;
    setIsPlaying(true);
    if (!isMuted) {
      soundSynth.playWhoosh();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(TOTAL_DURATION, pos * TOTAL_DURATION));
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundSynth.setMuted(next);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const progressPercent = (currentTime / TOTAL_DURATION) * 100;

  // Real-time animated counter for Act 1
  const act1Ms = Math.min(14800, Math.round((currentTime / 9) * 14800));

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl transition-all ${
        cameraShake ? 'animate-bounce' : ''
      } ${isModal ? 'max-w-5xl w-full mx-auto my-auto' : 'w-full'}`}
    >
      {/* Top Header Overlay Bar */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide">
                MOTION LAUNCH FILM &bull; GORSE &times; RECSYS-JEV
              </span>
              <span className="hidden sm:inline-block rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-300">
                Act {currentChapter.actNumber}: {currentChapter.title}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Equalizer visualizer */}
          {isPlaying && !isMuted && (
            <div className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded bg-slate-900/80 border border-slate-800">
              <span className="h-3 w-1 bg-emerald-400 animate-pulse" />
              <span className="h-4 w-1 bg-cyan-400 animate-pulse delay-75" />
              <span className="h-2 w-1 bg-emerald-400 animate-pulse delay-150" />
              <span className="h-5 w-1 bg-teal-400 animate-pulse delay-100" />
            </div>
          )}

          {/* Direct MP4 Download Button */}
          <a
            href="/api/download/launch-video"
            download="recsys-jev-launch.mp4"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-medium transition-colors"
            title="Download MP4 Launch Video (H.264/AAC)"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download MP4</span>
          </a>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport (16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center select-none">
        {/* Background Motion Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none opacity-60"
        />

        {/* Ambient Radial Spotlight */}
        <div className="absolute inset-0 bg-radial from-slate-900/40 via-slate-950/80 to-slate-950 pointer-events-none" />

        {/* Poster View (Before first play) */}
        {currentTime === 0 && !isPlaying ? (
          <div className="relative h-full w-full flex items-center justify-center">
            <img
              src="/src/assets/images/launch_hero_banner_1791604938984.jpg"
              alt="Launch Poster"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover brightness-75"
            />
            {/* Play Button Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <button
                onClick={handleTogglePlay}
                className="group relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-1 shadow-2xl shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
                <Play className="h-9 w-9 sm:h-11 sm:w-11 text-slate-950 fill-current ml-1 group-hover:scale-110 transition-transform" />
              </button>
              <div className="space-y-1.5 backdrop-blur-md bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  Gorse &times; recsys-jev Motion Trailer
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg drop-shadow">
                  Starring <strong className="text-white">Jevvy the Cyber Otter</strong> 🦦 &bull; High-Throughput Decision-AI in 45 Seconds
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                    60 FPS Motion Designed
                  </span>
                  <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                    Audio Synthesized
                  </span>
                </div>
                <div className="pt-2 flex justify-center">
                  <a
                    href="/api/download/launch-video"
                    download="recsys-jev-launch.mp4"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 px-3.5 py-1.5 text-xs font-mono text-slate-200 hover:text-white transition-all shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Download MP4 File (0.65 MB)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Dynamic Motion Designed Scenes (Acts 1-5) */
          <div className="relative h-full w-full overflow-hidden flex items-center justify-center p-6">
            {/* ACT 1: 14.8s Latency Meltdown */}
            {currentChapter.actNumber === 1 && (
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 max-w-3xl animate-in fade-in zoom-in-95 duration-500">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-950/70 px-3.5 py-1 text-xs text-red-300 shadow-lg shadow-red-950/50">
                  <AlertTriangle className="h-4 w-4 text-red-400 animate-bounce" />
                  <span className="font-mono font-bold">WARNING: SERVING LATENCY MELTDOWN</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  The Pointwise LLM{' '}
                  <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                    Latency Wall
                  </span>
                </h2>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full pt-2">
                  <div className="rounded-2xl border border-red-500/40 bg-slate-900/90 p-5 text-center shadow-xl shadow-red-950/40 flex-1 max-w-xs">
                    <p className="text-xs text-slate-400 font-mono">Qwen 7B Pointwise (K=200)</p>
                    <p className="text-4xl sm:text-6xl font-mono font-black text-red-400 tracking-tighter">
                      {(act1Ms / 1000).toFixed(1)}s
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, (act1Ms / 14800) * 100)}%` }}
                        className="h-full bg-red-500 transition-all duration-75"
                      />
                    </div>
                    <p className="text-[11px] font-mono text-red-300/80 mt-2">
                      200 Serialized Prompt Calls
                    </p>
                  </div>

                  <div className="text-left text-xs sm:text-sm text-slate-300 space-y-2 font-mono flex-1 max-w-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <p className="text-red-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
                      HTTP 504 Gateway Timeout
                    </p>
                    <p className="text-slate-400">&bull; 72% User Shopping Cart Abandonment</p>
                    <p className="text-slate-400">&bull; GPU Cloud Compute Costs Explode</p>
                    <p className="text-slate-400">&bull; Context Length Collapses Listwise Models</p>
                  </div>
                </div>
              </div>
            )}

            {/* ACT 2: Enter Jevvy & System 1 Decision Model */}
            {currentChapter.actNumber === 2 && (
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 max-w-3xl animate-in fade-in zoom-in-95 duration-500">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-950/70 px-3.5 py-1 text-xs text-emerald-300 shadow-lg shadow-emerald-950/50">
                  <Zap className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <span className="font-mono font-bold">JEV SYSTEM 1 ENGAGED &bull; LATENCY FIXED</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Enter Jevvy &amp;{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    Discrete Choice Reranking
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full pt-1">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center">
                    <p className="text-xs text-slate-400 font-mono">Gorse Multi-Source Retrieval</p>
                    <p className="text-3xl sm:text-4xl font-mono font-black text-cyan-400">
                      K = 200 items
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Collaborative + Vector + Trending
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-4 text-center ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-950/50">
                    <p className="text-xs text-emerald-300 font-mono font-bold">
                      Jev System 1 Serving SLA
                    </p>
                    <p className="text-3xl sm:text-4xl font-mono font-black text-emerald-400">
                      &lt;620 ms
                    </p>
                    <p className="text-[11px] text-emerald-300 mt-1 font-semibold">
                      17.6&times; Faster Than LLM
                    </p>
                  </div>
                </div>

                {/* Mathematical Formula Banner */}
                <div className="rounded-xl border border-emerald-500/30 bg-slate-900/90 px-4 py-2 font-mono text-xs text-emerald-300 max-w-lg shadow-md">
                  <span>P(i | S_u, C_u^(K)) = exp(&psi;(i, S_u)) / &sum; exp(&psi;(j, S_u))</span>
                </div>
              </div>
            )}

            {/* ACT 3: Two-Stage Hybrid RecFlow Architecture */}
            {currentChapter.actNumber === 3 && (
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 max-w-4xl animate-in fade-in zoom-in-95 duration-500">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/50 bg-teal-950/70 px-3.5 py-1 text-xs text-teal-300">
                  <Layers className="h-4 w-4 text-teal-400" />
                  <span className="font-mono font-bold">TWO-STAGE HYBRID RECFLOW PIPELINE</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  System 1 Throughput +{' '}
                  <span className="bg-gradient-to-r from-teal-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                    System 2 Explainability
                  </span>
                </h2>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-1">
                  {/* Stage 1 */}
                  <div className="flex-1 rounded-2xl border border-emerald-500/50 bg-slate-900/95 p-4 text-left shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">
                        Stage 1 &bull; Jev Engine
                      </span>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono text-emerald-300">
                        &lt;900ms
                      </span>
                    </div>
                    <p className="text-base font-bold text-white mt-1">High-Throughput Choice Scoring</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Scores all 200 candidates simultaneously with calibrated probabilities{' '}
                      <code className="text-emerald-300 font-mono">P(i|S_u,C_u)</code>
                    </p>
                  </div>

                  {/* Filter Gating Node */}
                  <div className="flex flex-col items-center justify-center px-2 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                    <span>GATE</span>
                    <span>P &gt; 0.85</span>
                  </div>

                  {/* Stage 2 */}
                  <div className="flex-1 rounded-2xl border border-indigo-500/50 bg-slate-900/95 p-4 text-left shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase">
                        Stage 2 &bull; Gemini 2.5
                      </span>
                      <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-mono text-indigo-300">
                        Top-3 Only
                      </span>
                    </div>
                    <p className="text-base font-bold text-white mt-1">Selective Reasoning Micro-Copy</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Generates human-level &quot;Why for you&quot; reasoning strictly on final recommendations (saving 94% tokens)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ACT 4: Pareto Frontier Dominance */}
            {currentChapter.actNumber === 4 && (
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 max-w-3xl animate-in fade-in zoom-in-95 duration-500">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-950/70 px-3.5 py-1 text-xs text-emerald-300">
                  <BarChart2 className="h-4 w-4 text-emerald-400" />
                  <span className="font-mono font-bold">EMPIRICALLY PROVEN ON BENCHMARKS</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  Dominating the{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                    Pareto Frontier
                  </span>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl text-left">
                  <div className="rounded-xl border border-emerald-500/40 bg-slate-900/90 p-3">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Top Quality</p>
                    <p className="text-xl font-mono font-black text-emerald-400">0.638</p>
                    <p className="text-[11px] text-slate-400">NDCG@10 Score</p>
                  </div>
                  <div className="rounded-xl border border-emerald-500/40 bg-slate-900/90 p-3">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Serving SLA</p>
                    <p className="text-xl font-mono font-black text-teal-400">&lt;900ms</p>
                    <p className="text-[11px] text-slate-400">Flat Latency Scaling</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 rounded-xl border border-cyan-500/40 bg-slate-900/90 p-3">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Datasets</p>
                    <p className="text-sm font-bold text-white mt-1">Amazon &bull; GitHub</p>
                    <p className="text-[11px] text-slate-400">Verified Empirical SLA</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-mono">
                  Non-dominated solution: highest accuracy per millisecond of compute.
                </p>
              </div>
            )}

            {/* ACT 5: Production Docker Launch & Open-Source Victory */}
            {currentChapter.actNumber === 5 && (
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 max-w-2xl animate-in fade-in zoom-in-95 duration-500">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-950/70 px-3.5 py-1 text-xs text-emerald-300 shadow-xl shadow-emerald-950/50">
                  <Sparkles className="h-4 w-4 text-emerald-400 animate-spin" />
                  <span className="font-mono font-bold">CLUSTER ONLINE &bull; APACHE 2.0</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-white">
                  Ready to Launch! 🚀
                </h2>

                {/* Animated Sci-Fi Terminal */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/95 p-3.5 font-mono text-xs sm:text-sm text-emerald-400 flex items-center justify-between gap-4 max-w-md w-full shadow-2xl">
                  <div className="flex items-center gap-2 truncate">
                    <Terminal className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-slate-300 font-bold">$</span>
                    <span className="text-emerald-300 font-semibold truncate">
                      docker compose up -d
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>HEALTHY</span>
                  </div>
                </div>

                {onOpenWorkbench && (
                  <button
                    onClick={onOpenWorkbench}
                    className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
                  >
                    <span>Launch RecSys Workbench</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Mascot Picture-in-Picture (PiP) Live Feed */}
            {showMascotCam && (
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                <AnimatedOtterLogo size={48} interactive={false} />
                <div className="pr-2 hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white">Jevvy 🦦</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono font-semibold">
                      REC-CAM
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 max-w-[210px] truncate font-sans">
                    {currentChapter.jevvyQuote}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Closed Captions (Subtitles) */}
        {showSubtitles && isPlaying && (
          <div className="absolute bottom-4 inset-x-12 z-20 flex justify-center pointer-events-none">
            <div className="rounded-xl bg-slate-950/85 px-4 py-2 border border-slate-800 backdrop-blur-md shadow-xl text-center max-w-xl animate-in fade-in duration-300">
              <p className="text-xs sm:text-sm text-slate-100 font-sans leading-snug">
                {currentChapter.subtitle}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Video Control Bar & Scrubber */}
      <div className="border-t border-slate-800 bg-slate-950 p-3 sm:p-4 space-y-3">
        {/* Scrubber Timeline */}
        <div
          onClick={handleSeek}
          className="group relative h-2.5 w-full cursor-pointer rounded-full bg-slate-800/80 transition-all hover:h-3.5"
        >
          {/* Chapter Markers */}
          {CHAPTERS.map((ch) => (
            <div
              key={ch.id}
              style={{ left: `${(ch.startTime / TOTAL_DURATION) * 100}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
              title={ch.title}
            />
          ))}

          {/* Progress Filled Track */}
          <div
            style={{ width: `${progressPercent}%` }}
            className="relative h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-75"
          >
            {/* Scrubber Knob */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>

        {/* Control Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-slate-300">
          {/* Left: Play / Pause / Replay / Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleTogglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Restart from beginning"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <div className="font-mono text-xs text-slate-300 pl-1">
              <span>{Math.floor(currentTime)}s</span>
              <span className="text-slate-600"> / </span>
              <span className="text-slate-500">{TOTAL_DURATION}s</span>
            </div>
          </div>

          {/* Center: Chapter Quick Selector */}
          <div className="hidden lg:flex items-center gap-1">
            {CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setCurrentTime(ch.startTime);
                  setIsPlaying(true);
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                  currentChapter.id === ch.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                Act {ch.actNumber}
              </button>
            ))}
          </div>

          {/* Right: Subtitles, Mascot Cam, Speed, Mute, Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Speed toggle */}
            <button
              onClick={() => {
                const speeds = [1, 1.25, 1.5, 2];
                const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                setPlaybackSpeed(speeds[nextIdx]);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono text-slate-300 hover:bg-slate-900 transition-colors"
              title="Playback speed"
            >
              <FastForward className="h-3.5 w-3.5 text-slate-400" />
              <span>{playbackSpeed}x</span>
            </button>

            {/* Subtitles toggle */}
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-2 rounded-xl transition-colors ${
                showSubtitles
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Subtitles"
            >
              <Subtitles className="h-4 w-4" />
            </button>

            {/* Mascot PiP toggle */}
            <button
              onClick={() => setShowMascotCam(!showMascotCam)}
              className={`px-2 py-1 rounded-xl text-xs font-mono transition-colors ${
                showMascotCam
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                  : 'text-slate-500 hover:text-slate-300 border border-slate-800'
              }`}
              title="Toggle Mascot PiP"
            >
              🦦 PiP
            </button>

            {/* Mute button */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-xl transition-colors ${
                isMuted ? 'text-red-400 bg-red-500/10' : 'text-slate-300 hover:text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Download MP4 file */}
            <a
              href="/api/download/launch-video"
              download="recsys-jev-launch.mp4"
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-slate-900 transition-colors"
              title="Download MP4 launch video (0.65 MB)"
            >
              <Download className="h-4 w-4" />
            </a>

            {/* Fullscreen button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
