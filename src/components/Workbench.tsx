import React, { useEffect, useState } from 'react';
import {
  Play,
  Sparkles,
  Zap,
  Award,
  BookOpen,
  Film,
  Gamepad2,
  Code2,
  LayoutGrid,
  List,
  ChevronRight,
  Target,
  CheckCircle2,
  X,
  Database,
  ArrowRight,
  TrendingUp,
  Cpu,
  Eye,
  GitBranch,
  Star,
} from 'lucide-react';
import { RecommendItemResult, RecommendResponse, User } from '../types';
import { PersonaRadarChart } from './PersonaRadarChart';
import { CandidateSourcesModal } from './CandidateSourcesModal';

interface WorkbenchProps {
  users: User[];
  onExecuteRecommend: (params: {
    userId: string;
    domain: string;
    rerankerModel: string;
    candidateSizeK: number;
    topN: number;
    enableExplainability: boolean;
    confidenceThreshold: number;
  }) => Promise<RecommendResponse>;
}

export const Workbench: React.FC<WorkbenchProps> = ({ users, onExecuteRecommend }) => {
  const [selectedDomain, setSelectedDomain] = useState<'gitrec' | 'movies' | 'games' | 'books'>('gitrec');
  const [selectedUserId, setSelectedUserId] = useState<string>('usr_bob_gitrec');
  const [rerankerModel, setRerankerModel] = useState<string>('jev');
  const [candidateK, setCandidateK] = useState<number>(50);
  const [topN] = useState<number>(5);
  const [enableExplainability] = useState<boolean>(true);
  const [confidenceThreshold] = useState<number>(0.85);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [showRadar, setShowRadar] = useState<boolean>(false);

  // Inspector Modal State
  const [inspectedItem, setInspectedItem] = useState<RecommendItemResult | null>(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState<boolean>(false);
  const [selectedCandidateSourceForModal, setSelectedCandidateSourceForModal] = useState<string | undefined>(undefined);

  const getCandidateSourceBadge = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('collaborative') || s.includes('cf')) {
      return { symbol: 'CF', name: 'Collaborative Filtering', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
    if (s.includes('vector') || s.includes('vec')) {
      return { symbol: 'Vec', name: 'Vector ANN Cosine', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    }
    if (s.includes('popular') || s.includes('trend')) {
      return { symbol: 'Trend', name: 'Trending Stream', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
    return { symbol: 'Fresh', name: 'Freshness Feed', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
  };

  const domainUsers: Record<
    'gitrec' | 'movies' | 'games' | 'books',
    Array<{
      id: string;
      name: string;
      role: string;
      avatarUrl: string;
      tagline: string;
      historyItems: Array<{ id: string; type: string; title: string }>;
      negativeSignals: string[];
    }>
  > = {
    gitrec: [
      {
        id: 'usr_bob_gitrec',
        name: 'Bob',
        role: 'Systems & ML Architect',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        tagline: 'Distributed inference, consensus, Rust SIMD',
        historyItems: [
          { id: 'repo-vllm', type: 'star', title: 'vllm-project/vllm' },
          { id: 'repo-qdrant', type: 'fork', title: 'qdrant/qdrant' },
        ],
        negativeSignals: ['deprecated-electron-apps'],
      },
      {
        id: 'usr_alice_gitrec',
        name: 'Alice',
        role: 'Cloud & Infrastructure',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        tagline: 'Kubernetes, reactive architectures, microservices',
        historyItems: [
          { id: 'repo-fastapi', type: 'star', title: 'tiangolo/fastapi' },
          { id: 'repo-tailwind', type: 'star', title: 'tailwindlabs/tailwindcss' },
        ],
        negativeSignals: ['legacy-jquery-plugins'],
      },
    ],
    movies: [
      {
        id: 'usr_dystopian_cinephile',
        name: 'Marcus',
        role: 'Sci-Fi Film Curator',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        tagline: 'Cyberpunk, neo-noir, hard physics',
        historyItems: [
          { id: 'mov-blade-runner-2049', type: 'star', title: 'Blade Runner 2049' },
          { id: 'mov-interstellar', type: 'star', title: 'Interstellar' },
        ],
        negativeSignals: ['superhero-cliches'],
      },
      {
        id: 'usr_indie_cinephile',
        name: 'Elena',
        role: 'Arthouse Specialist',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        tagline: 'Existential drama, psychological pacing',
        historyItems: [
          { id: 'mov-arrival', type: 'star', title: 'Arrival' },
          { id: 'mov-her', type: 'star', title: 'Her' },
        ],
        negativeSignals: ['predictable-romcoms'],
      },
    ],
    games: [
      {
        id: 'usr_action_rpg',
        name: 'Kenji',
        role: 'Action RPG Veteran',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        tagline: 'Tight parry windows, dark fantasy lore',
        historyItems: [
          { id: 'game-eldenring', type: 'star', title: 'Elden Ring' },
          { id: 'game-armoredcore', type: 'star', title: 'Armored Core VI' },
        ],
        negativeSignals: ['gacha-mechanics'],
      },
      {
        id: 'usr_strategy_gamer',
        name: 'Chloe',
        role: 'Grand Strategy Tactician',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        tagline: 'Narrative agency, deep mythologies',
        historyItems: [
          { id: 'game-bg3', type: 'star', title: "Baldur's Gate 3" },
          { id: 'game-blackmyth', type: 'like', title: 'Black Myth: Wukong' },
        ],
        negativeSignals: ['microtransactions'],
      },
    ],
    books: [
      {
        id: 'usr_dave_books',
        name: 'Dave',
        role: 'Distributed Systems Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        tagline: 'Consensus protocols, database internals, DDIA',
        historyItems: [
          { id: 'book-ddia', type: 'star', title: 'Designing Data-Intensive Apps' },
          { id: 'book-mlsys', type: 'read', title: 'Designing ML Systems' },
        ],
        negativeSignals: ['superficial-pop-science'],
      },
      {
        id: 'usr_sarah_books',
        name: 'Sarah',
        role: 'Complexity Scientist',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        tagline: 'Cosmic sociology, hard sci-fi, consciousness',
        historyItems: [
          { id: 'book-threebody', type: 'star', title: 'The Three-Body Problem' },
          { id: 'book-blindsight', type: 'like', title: 'Blindsight' },
        ],
        negativeSignals: ['unscientific-fantasy'],
      },
    ],
  };

  const mergedDomainUsers = {
    gitrec: [...domainUsers.gitrec],
    movies: [...domainUsers.movies],
    games: [...domainUsers.games],
    books: [...domainUsers.books],
  };

  if (users && users.length > 0) {
    users.forEach((u) => {
      const d = (u.Domain as 'gitrec' | 'movies' | 'games' | 'books') || 'gitrec';
      if (!mergedDomainUsers[d]) (mergedDomainUsers as any)[d] = [];
      const exists = mergedDomainUsers[d].some((item) => item.id === u.UserId);
      if (!exists) {
        mergedDomainUsers[d].unshift({
          id: u.UserId,
          name: u.Name,
          role: u.Role,
          avatarUrl:
            u.AvatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          tagline: u.DecisionStateDescription || `${u.Domain} profile`,
          historyItems: (u.History || []).map((h) => ({ id: h, type: 'star', title: h })),
          negativeSignals: u.NegativeSignals || [],
        });
      }
    });
  }

  const datasetList = [
    { id: 'gitrec' as const, name: 'GitHub GitRec', icon: <Code2 className="h-3.5 w-3.5" /> },
    { id: 'movies' as const, name: 'Amazon Movies', icon: <Film className="h-3.5 w-3.5" /> },
    { id: 'games' as const, name: 'Video Games', icon: <Gamepad2 className="h-3.5 w-3.5" /> },
    { id: 'books' as const, name: 'Books Corpus', icon: <BookOpen className="h-3.5 w-3.5" /> },
  ];

  const availableUsersForDomain = mergedDomainUsers[selectedDomain] || [];
  const currentPersona =
    availableUsersForDomain.find((u) => u.id === selectedUserId) ||
    availableUsersForDomain[0] || {
      id: selectedUserId,
      name: selectedUserId,
      role: 'Active Profile',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      tagline: 'Decision State Profile',
      historyItems: [],
      negativeSignals: [],
    };

  const handleDomainChange = (domain: 'gitrec' | 'movies' | 'games' | 'books') => {
    setSelectedDomain(domain);
    const usersForNewDomain = mergedDomainUsers[domain];
    if (usersForNewDomain && usersForNewDomain.length > 0) {
      setSelectedUserId(usersForNewDomain[0].id);
    }
  };

  const handleRun = async () => {
    setIsLoading(true);
    try {
      const res = await onExecuteRecommend({
        userId: selectedUserId,
        domain: selectedDomain,
        rerankerModel,
        candidateSizeK: candidateK,
        topN,
        enableExplainability,
        confidenceThreshold,
      });
      setResult(res);
    } catch {
      // Handled in parent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRun();
  }, [selectedUserId, selectedDomain, rerankerModel, candidateK]);

  const displayedItems = result ? result.items.slice(0, 5) : [];

  return (
    <div className="space-y-6 text-left">
      {/* 1. MINIMALIST VISUAL CONTROL COCKPIT */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 backdrop-blur-md shadow-xl">
        {/* Row 1: Datasets + User Avatars */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          {/* Corpus Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-semibold mr-1">Corpus:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              {datasetList.map((ds) => {
                const isSelected = selectedDomain === ds.id;
                return (
                  <button
                    key={ds.id}
                    onClick={() => handleDomainChange(ds.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ds.icon}
                    <span>{ds.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Persona Chip Switcher with Photographic Avatars */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-semibold mr-1">Persona:</span>
            <div className="flex items-center gap-2">
              {availableUsersForDomain.map((u) => {
                const isSelected = selectedUserId === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUserId(u.id)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'border-emerald-500/60 bg-emerald-500/15 text-white ring-1 ring-emerald-500/30 font-semibold'
                        : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      referrerPolicy="no-referrer"
                      className="h-5 w-5 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                    />
                    <span>{u.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Reranker Model + K Slider + Action + Radar Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-semibold mr-1">Model:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono">
              <button
                onClick={() => setRerankerModel('jev')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  rerankerModel === 'jev'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Jev System 1 (&lt;620ms)
              </button>
              <button
                onClick={() => setRerankerModel('qwen-pointwise')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  rerankerModel === 'qwen-pointwise'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Qwen 7B (14.8s)
              </button>
              <button
                onClick={() => setRerankerModel('sasrec')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  rerankerModel === 'sasrec'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SASRec (34ms)
              </button>
            </div>
          </div>

          {/* Candidate Pool Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 font-semibold">
              Pool <strong className="text-emerald-400">K={candidateK}</strong>
            </span>
            <input
              type="range"
              min={20}
              max={200}
              step={20}
              value={candidateK}
              onChange={(e) => setCandidateK(Number(e.target.value))}
              className="w-24 sm:w-32 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Visual Radar Toggle */}
            <button
              onClick={() => setShowRadar(!showRadar)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
                showRadar
                  ? 'border-indigo-500/60 bg-indigo-500/20 text-indigo-300 font-semibold'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
              }`}
              title="Toggle Persona Profile Radar Chart"
            >
              <Target className="h-3.5 w-3.5 text-indigo-400" />
              <span>{showRadar ? 'Hide Radar' : 'Radar Chart'}</span>
            </button>

            {/* Run Recommendations Action */}
            <button
              onClick={handleRun}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Reranking...</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current" />
                  <span>Rerank</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. OPTIONAL EXPANDABLE RADAR CHART VISUALIZATION */}
      {showRadar && (
        <div className="rounded-2xl border border-indigo-500/40 bg-slate-900/90 p-5 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <img
                src={currentPersona.avatarUrl}
                alt={currentPersona.name}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/50"
              />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Persona Profile Vector Alignment ({currentPersona.name})
                </h3>
                <p className="text-xs text-slate-400">{currentPersona.role}</p>
              </div>
            </div>
            <button
              onClick={() => setShowRadar(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="h-80 w-full">
            <PersonaRadarChart
              userId={selectedUserId}
              userName={currentPersona.name}
              domain={selectedDomain}
            />
          </div>
        </div>
      )}

      {/* 3. VISUAL RECOMMENDATION RESULTS SLATE (WITH EXTERNAL IMAGE COVERS) */}
      {result && (
        <div className="space-y-4">
          {/* Status HUD Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="font-bold text-white text-sm">Top 5 Recommendation Slate</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">
                Serving SLA: <strong className="text-emerald-400">{result.total_latency_ms} ms</strong>
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">
                Confidence Gate: <strong className="text-indigo-300">P &ge; 0.85</strong>
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1 font-mono text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Visual Cards</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-all ${
                  viewMode === 'list'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>

          {/* Visual Cards Grid with Photographic Image Covers */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedItems.map((item, idx) => {
                const isTopPick = item.rank === 1 || idx === 0;
                const badgeInfo = getCandidateSourceBadge(item.candidate_source);
                const probPercent = Math.round(item.confidence_score * 100);

                return (
                  <div
                    key={`${item.item_id}-${item.rank}`}
                    onClick={() => setInspectedItem(item)}
                    className={`rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl group flex flex-col justify-between ${
                      isTopPick
                        ? 'border-emerald-500/60 bg-gradient-to-b from-slate-900 to-slate-950 ring-1 ring-emerald-500/30'
                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Photographic Image Thumbnail Header */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                        <img
                          src={
                            item.imageUrl ||
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
                          }
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        {/* Top Rank Badge */}
                        <div className="absolute top-3 left-3 rounded-md backdrop-blur-md px-2 py-0.5 font-mono text-xs font-bold border border-slate-700/80 bg-slate-900/90 text-white shadow">
                          {isTopPick ? (
                            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                              <Award className="h-3 w-3" /> #1 Pick
                            </span>
                          ) : (
                            <span className="text-slate-300">#{item.rank}</span>
                          )}
                        </div>

                        {/* Calibrated Choice Likelihood Pill */}
                        <div className="absolute top-3 right-3 rounded-md backdrop-blur-md px-2 py-0.5 font-mono text-xs font-bold border border-emerald-500/40 bg-slate-950/90 text-emerald-300 shadow">
                          P: {probPercent}%
                        </div>

                        {/* Candidate Source Channel */}
                        <div
                          className={`absolute bottom-2.5 left-3 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold border ${badgeInfo.color}`}
                        >
                          {badgeInfo.name}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {item.subtitle || item.category}
                          </p>
                        </div>

                        {/* Visual Choice Likelihood Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>Calibrated Likelihood</span>
                            <span className="text-emerald-400 font-bold">{probPercent}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div
                              style={{ width: `${probPercent}%` }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                            />
                          </div>
                        </div>

                        {/* Punchy 1-Sentence Gemini Micro-Copy */}
                        {item.why_suggested && (
                          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                            <span className="text-emerald-400 font-semibold mr-1">Why:</span>
                            <span className="italic">{item.why_suggested.headline}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Link Footer */}
                    <div className="px-4 pb-3 pt-1 flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-emerald-400 transition-colors">
                      <span>Click to inspect</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Minimalist Data Table with Image Thumbnails */
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 font-mono text-slate-400">
                    <th className="py-2.5 px-3">Cover</th>
                    <th className="py-2.5 px-4">Rank</th>
                    <th className="py-2.5 px-4">Item</th>
                    <th className="py-2.5 px-4">Channel</th>
                    <th className="py-2.5 px-4">Choice P(i)</th>
                    <th className="py-2.5 px-4">Gemini Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {displayedItems.map((item) => (
                    <tr
                      key={item.item_id}
                      onClick={() => setInspectedItem(item)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-2 px-3">
                        <img
                          src={
                            item.imageUrl ||
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
                          }
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="h-9 w-9 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                      </td>
                      <td className="py-2.5 px-4 font-bold text-emerald-400">#{item.rank}</td>
                      <td className="py-2.5 px-4 text-white font-medium">{item.title}</td>
                      <td className="py-2.5 px-4 text-slate-400">{item.candidate_source}</td>
                      <td className="py-2.5 px-4 text-emerald-300 font-bold">
                        {(item.confidence_score * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-4 text-slate-300 font-sans italic truncate max-w-xs">
                        {item.why_suggested?.headline || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Item Inspector Modal with Image Preview */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-bold">#{inspectedItem.rank}</span>
                <h3 className="font-bold text-white text-base truncate">{inspectedItem.title}</h3>
              </div>
              <button
                onClick={() => setInspectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Photographic Item Image in Inspector */}
            {inspectedItem.imageUrl && (
              <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={inspectedItem.imageUrl}
                  alt={inspectedItem.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-xs font-mono font-bold text-white">
                  {inspectedItem.category}
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Choice Probability:</span>
                  <span className="text-emerald-400 font-bold">
                    {(inspectedItem.confidence_score * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Candidate Channel:</span>
                  <span className="text-slate-200">{inspectedItem.candidate_source}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Category:</span>
                  <span className="text-slate-200">{inspectedItem.category}</span>
                </div>
              </div>

              {inspectedItem.why_suggested && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                    Gemini 2.5/Flash Micro-Copy:
                  </span>
                  <p className="text-slate-200 font-medium">{inspectedItem.why_suggested.headline}</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {inspectedItem.why_suggested.rationale}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setInspectedItem(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* Candidate Sources Modal */}
      {isCandidateModalOpen && (
        <CandidateSourcesModal
          isOpen={isCandidateModalOpen}
          onClose={() => setIsCandidateModalOpen(false)}
          initialSource={selectedCandidateSourceForModal}
        />
      )}
    </div>
  );
};
