/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Activity,
  BarChart3,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Zap,
  Sliders,
  Database,
  X,
  Send,
  Star,
  Heart,
  Eye,
  MousePointer,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { RecFlowPipeline } from './components/RecFlowPipeline';
import { Workbench } from './components/Workbench';
import { Benchmarks } from './components/Benchmarks';
import { IncludeDataModal } from './components/IncludeDataModal';
import { MascotCompanion } from './components/MascotCompanion';
import { LaunchVideoPlayer } from './components/LaunchVideoPlayer';
import { AnimatedOtterLogo } from './components/AnimatedOtterLogo';
import { ClusterStatus, FeedbackEvent, RecommendResponse, User } from './types';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'landing' | 'console'>('landing');
  const [consoleTab, setConsoleTab] = useState<'workbench' | 'benchmarks' | 'pipeline'>('workbench');
  const [isLaunchVideoOpen, setIsLaunchVideoOpen] = useState(false);

  const [clusterStatus, setClusterStatus] = useState<ClusterStatus | null>(null);
  const [feedbackList, setFeedbackList] = useState<FeedbackEvent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isInjectModalOpen, setIsInjectModalOpen] = useState(false);
  const [isIncludeDataModalOpen, setIsIncludeDataModalOpen] = useState(false);

  // Modal form states
  const [injectUser, setInjectUser] = useState('usr_bob_gitrec');
  const [injectItem, setInjectItem] = useState('vllm-project/vllm');
  const [injectType, setInjectType] = useState<'star' | 'click' | 'read' | 'like'>('star');

  // Load telemetry, feedback, and users
  const loadClusterStatus = async () => {
    try {
      const res = await fetch('/api/cluster/status');
      if (res.ok) {
        const data = await res.json();
        setClusterStatus(data);
      }
    } catch (err) {
      console.warn('Telemetry poll error:', err);
    }
  };

  const loadFeedback = async () => {
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        if (data.feedback) setFeedbackList(data.feedback);
      }
    } catch (err) {
      console.warn('Feedback poll error:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users) setUsers(data.users);
      }
    } catch (err) {
      console.warn('Users load error:', err);
    }
  };

  useEffect(() => {
    loadClusterStatus();
    loadFeedback();
    loadUsers();

    const interval = setInterval(() => {
      loadClusterStatus();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleInjectFeedback = async (event: Partial<FeedbackEvent>) => {
    const payload = [
      {
        FeedbackType: event.FeedbackType || 'star',
        UserId: event.UserId || 'usr_bob_gitrec',
        ItemId: event.ItemId || 'ollama/ollama',
        Timestamp: new Date().toISOString(),
      },
    ];

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await loadFeedback();
        await loadClusterStatus();
        setIsInjectModalOpen(false);
      }
    } catch (err) {
      console.error('Feedback injection failed:', err);
    }
  };

  const handleExecuteRecommend = async (params: {
    userId: string;
    domain: string;
    rerankerModel: string;
    candidateSizeK: number;
    topN: number;
    enableExplainability: boolean;
    confidenceThreshold: number;
  }): Promise<RecommendResponse> => {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: params.userId,
        domain: params.domain,
        reranker_model: params.rerankerModel,
        candidate_size_k: params.candidateSizeK,
        top_n: params.topN,
        enable_explainability: params.enableExplainability,
        confidence_threshold: params.confidenceThreshold,
      }),
    });
    return await res.json();
  };

  const consoleNavItems = [
    {
      id: 'workbench' as const,
      label: 'RecSys Playground',
      icon: <Sliders className="h-4 w-4" />,
      badge: 'Top 5',
    },
    {
      id: 'benchmarks' as const,
      label: 'Pareto Benchmarks',
      icon: <BarChart3 className="h-4 w-4" />,
      badge: '4 Datasets',
    },
    {
      id: 'pipeline' as const,
      label: 'RecFlow Pipeline',
      icon: <Layers className="h-4 w-4" />,
      badge: '4 Stages',
    },
  ];

  const handleDataIngested = async (newUserId?: string) => {
    await loadUsers();
    await loadClusterStatus();
    await loadFeedback();
    setCurrentMode('console');
    setConsoleTab('workbench');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        setMode={setCurrentMode}
        clusterStatus={clusterStatus}
        onOpenIncludeData={() => setIsIncludeDataModalOpen(true)}
        onWatchLaunchVideo={() => setIsLaunchVideoOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1">
        {currentMode === 'landing' ? (
          <LandingPage
            onWatchLaunchVideo={() => setIsLaunchVideoOpen(true)}
            onOpenConsole={(initialTab) => {
              if (initialTab && (consoleNavItems.map((n) => n.id) as string[]).includes(initialTab)) {
                setConsoleTab(initialTab as any);
              }
              setCurrentMode('console');
            }}
          />
        ) : (
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-start gap-6">
            {/* Sleek Minimalist Dashboard Sidebar */}
            <div className="w-full lg:w-64 xl:w-72 shrink-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl lg:sticky lg:top-20 space-y-5">
              {/* Header Branding */}
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Sliders className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-white tracking-tight truncate">RecSys Console</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-300">Live Engine</span>
                  </div>
                </div>
              </div>

              {/* Active Operator / Persona with External Avatar */}
              {users && users.length > 0 && (
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <img
                    src={
                      users[0].AvatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                    }
                    alt={users[0].Name}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-emerald-500/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">{users[0].Name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{users[0].Role}</div>
                  </div>
                </div>
              )}

              {/* Navigation Views - Clean Button List */}
              <div className="space-y-1">
                {consoleNavItems.map((item) => {
                  const isActive = consoleTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setConsoleTab(item.id)}
                      className={`w-full flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-xs transition-all ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                          {item.icon}
                        </span>
                        <span className="font-medium truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] ${
                            isActive
                              ? 'bg-emerald-500/30 text-emerald-200'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Visual Telemetry Mini-Card */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/60 pb-2">
                  <span className="uppercase tracking-wider font-semibold">Live Telemetry</span>
                  <span className="text-emerald-400">Gorse &times; Jev</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2">
                    <span className="text-slate-500 block">Serving SLA</span>
                    <span className="text-emerald-400 font-bold">&lt; 620ms</span>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2">
                    <span className="text-slate-500 block">Cache Hit</span>
                    <span className="text-cyan-300 font-bold">94.2%</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsIncludeDataModalOpen(true)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 py-2 text-[11px] font-mono font-semibold transition-all shadow-sm"
                  >
                    <Database className="h-3.5 w-3.5 text-emerald-400" />
                    <span>+ Include Real Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInjectModalOpen(true)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 py-1.5 text-[10px] font-mono transition-colors"
                  >
                    <Send className="h-3 w-3 text-slate-500" />
                    <span>Quick Feedback Signal</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Console Content */}
            <div className="flex-1 min-w-0 w-full">
              {consoleTab === 'workbench' && (
                <Workbench users={users} onExecuteRecommend={handleExecuteRecommend} />
              )}
              {consoleTab === 'benchmarks' && <Benchmarks />}
              {consoleTab === 'pipeline' && <RecFlowPipeline />}
            </div>
          </div>
        )}
      </main>

      {/* Manual Feedback Injection Modal */}
      {isInjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-white">Inject Interaction Signal (/api/feedback)</h3>
              </div>
              <button
                onClick={() => setIsInjectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300">User Identity (UserId)</label>
                <select
                  value={injectUser}
                  onChange={(e) => setInjectUser(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="usr_bob_gitrec">usr_bob_gitrec (Senior ML Infra)</option>
                  <option value="usr_alice_movies">usr_alice_movies (Sci-Fi Cinephile)</option>
                  <option value="usr_charlie_games">usr_charlie_games (Action RPG Veteran)</option>
                  <option value="usr_dave_books">usr_dave_books (Distributed Systems)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300">Feedback Signal Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['star', 'like', 'read', 'click'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setInjectType(t)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 capitalize transition-all ${
                        injectType === t
                          ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t === 'star' && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
                      {t === 'like' && <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />}
                      {t === 'read' && <Eye className="h-3 w-3 text-cyan-400" />}
                      {t === 'click' && <MousePointer className="h-3 w-3 text-emerald-400" />}
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300">Target Item (ItemId)</label>
                <select
                  value={injectItem}
                  onChange={(e) => setInjectItem(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="vllm-project/vllm">vllm-project/vllm (LLM Serving)</option>
                  <option value="ollama/ollama">ollama/ollama (Local Inference)</option>
                  <option value="astral-sh/uv">astral-sh/uv (Rust Python Tooling)</option>
                  <option value="facebookresearch/faiss">facebookresearch/faiss (Vector Search)</option>
                  <option value="mov-oppenheimer">mov-oppenheimer (Nolan IMAX)</option>
                  <option value="mov-dune2">mov-dune2 (Villeneuve Sci-Fi)</option>
                  <option value="game-bg3">game-bg3 (Tactical CRPG)</option>
                  <option value="book-ddia">book-ddia (Designing Data-Intensive Apps)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsInjectModalOpen(false)}
                className="rounded-lg border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-mono text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleInjectFeedback({
                    UserId: injectUser,
                    ItemId: injectItem,
                    FeedbackType: injectType,
                  })
                }
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-mono font-semibold text-white shadow"
              >
                <Send className="h-3 w-3" />
                <span>Emit to Pipeline</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Include Your Data Modal */}
      <IncludeDataModal
        isOpen={isIncludeDataModalOpen}
        onClose={() => setIsIncludeDataModalOpen(false)}
        onDataIngested={handleDataIngested}
      />

      {/* Floating Interactive Mascot Companion */}
      <MascotCompanion
        onWatchVideo={() => setIsLaunchVideoOpen(true)}
        onOpenWorkbench={() => {
          setCurrentMode('console');
          setConsoleTab('workbench');
        }}
      />

      {/* Cinematic Launch Video Modal */}
      {isLaunchVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl">
            <LaunchVideoPlayer
              isModal
              onClose={() => setIsLaunchVideoOpen(false)}
              onOpenWorkbench={() => {
                setIsLaunchVideoOpen(false);
                setCurrentMode('console');
                setConsoleTab('workbench');
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AnimatedOtterLogo size={24} interactive={false} />
            <span>recsys-jev &middot; Open-Source AI-Native Recommender Engine (Apache 2.0)</span>
          </div>
          <span className="text-slate-400">Decision-Oriented Recommendation Reranking</span>
        </div>
      </footer>
    </div>
  );
}
