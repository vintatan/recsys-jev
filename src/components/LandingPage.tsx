import React, { useState } from 'react';
import {
  Check,
  Copy,
  Terminal,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Code2,
  Database,
  Play,
  Cpu,
  Clock,
  TrendingUp,
  Server,
  Lock,
  DollarSign,
  Activity,
  Sliders,
  Download,
} from 'lucide-react';
import { SDK_CODE_SNIPPETS } from '../data/mockData';
import { SimplifiedParetoBenchmark } from './SimplifiedParetoBenchmark';
import { AnimatedOtterLogo } from './AnimatedOtterLogo';

interface LandingPageProps {
  onOpenConsole: (initialTab?: string) => void;
  onWatchLaunchVideo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenConsole,
  onWatchLaunchVideo,
}) => {
  const [activeSdk, setActiveSdk] = useState<'curl' | 'python' | 'go' | 'typescript' | 'rust'>('curl');
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedSdk, setCopiedSdk] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(2);

  const dockerCommand = 'docker compose up -d';

  const handleCopyDocker = () => {
    navigator.clipboard.writeText(dockerCommand);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  const handleCopySdk = () => {
    navigator.clipboard.writeText(SDK_CODE_SNIPPETS[activeSdk]);
    setCopiedSdk(true);
    setTimeout(() => setCopiedSdk(false), 2000);
  };

  const funnelStages = [
    {
      id: 1,
      title: 'Fan-Out Retrieval',
      size: 'K = 200',
      latency: '< 15 ms',
      tech: 'CF + ANN + Trends',
      accent: 'emerald',
      desc: 'Parallel candidate retrieval from multi-source streams into Redis hot-cache.',
    },
    {
      id: 2,
      title: 'Jev System 1 Rerank',
      size: 'Top 50',
      latency: '< 620 ms',
      tech: 'Discrete Choice',
      accent: 'teal',
      desc: 'High-throughput probabilistic choice model P(i | S_u, C_u) without token generation.',
    },
    {
      id: 3,
      title: 'Confidence Gating',
      size: 'Top 5',
      latency: '< 1 ms',
      tech: 'P ≥ 0.85 Cutoff',
      accent: 'indigo',
      desc: 'Suppresses low-certainty hallucinations before user presentation.',
    },
    {
      id: 4,
      title: 'Gemini Explainability',
      size: 'Top 3',
      latency: '< 200 ms',
      tech: 'Selective Micro-Copy',
      accent: 'amber',
      desc: 'Targeted System 2 synthesis generates punchy "Why for you" copy with 94% cost savings.',
    },
  ];

  return (
    <div className="space-y-24 pb-28">
      {/* 1. HERO SECTION: Clean, Typographic, Visual Flow */}
      <section className="relative overflow-hidden pt-12 pb-6">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[280px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Unboxed Metadata Header (Zero-Pill Discipline) */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <AnimatedOtterLogo size={22} interactive={false} />
            <span className="text-emerald-400 font-semibold">recsys-jev</span>
            <span aria-hidden="true">&bull;</span>
            <span>Decision-Oriented RecSys</span>
            <span aria-hidden="true">&bull;</span>
            <span className="text-slate-300">Apache 2.0</span>
            {onWatchLaunchVideo && (
              <>
                <span aria-hidden="true">&bull;</span>
                <button
                  onClick={onWatchLaunchVideo}
                  className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <Play className="h-2.5 w-2.5 fill-current" />
                  <span>Launch Film</span>
                </button>
              </>
            )}
          </div>

          {/* Balanced Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] text-balance max-w-4xl mx-auto">
            Sub-Second Decision Reranking for{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Modern RecSys
            </span>
          </h1>

          {/* Concise 1-Sentence Proposition */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 font-normal leading-relaxed text-balance">
            Replace 14.8s pointwise LLM bottlenecks with flat sub-900ms probabilistic choice modeling and selective Gemini explainability.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenConsole('workbench')}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Launch Playground</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {onWatchLaunchVideo && (
              <button
                onClick={onWatchLaunchVideo}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-slate-600 px-5 py-3.5 text-sm font-medium text-slate-200 transition-all"
              >
                <Play className="h-3.5 w-3.5 fill-current text-emerald-400" />
                <span>Watch Film (45s)</span>
              </button>
            )}

            <a
              href="/api/download/launch-video"
              download="recsys-jev-launch.mp4"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-900 hover:border-slate-700 px-4 py-3.5 text-sm font-medium text-slate-300 hover:text-white transition-all"
              title="Download 1080p MP4 Launch Video"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span>MP4 Video (0.65 MB)</span>
            </a>

            <button
              onClick={() => onOpenConsole('pipeline')}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 px-4 py-3.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-all"
            >
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>Inspect Flow</span>
            </button>
          </div>

          {/* Minimalist 1-Line Docker Command */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 rounded-xl border border-slate-800/90 bg-slate-900/80 px-4 py-2 font-mono text-xs text-slate-300 shadow-inner">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-500">$</span>
              <span className="text-emerald-300 font-semibold">{dockerCommand}</span>
              <button
                onClick={handleCopyDocker}
                className="ml-2 text-slate-400 hover:text-white transition-colors"
                title="Copy command"
              >
                {copiedDocker ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 2. VISUAL FUNNEL ARCHITECTURE (Intuitive Graphic Pipeline) */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-bold text-white tracking-tight">Two-Stage Hybrid RecFlow Funnel</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>Serving SLA: <strong className="text-emerald-400">&lt;620ms</strong></span>
                <span>&bull;</span>
                <span>Throughput: <strong className="text-white">4,250 RPS</strong></span>
              </div>
            </div>

            {/* Visual Funnel Cards with Flow Connecting Lines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {funnelStages.map((stage) => {
                const isActive = activeStage === stage.id;
                return (
                  <div
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    className={`cursor-pointer rounded-xl p-4 transition-all border text-left flex flex-col justify-between ${
                      isActive
                        ? 'border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                        : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                        <span className="font-semibold text-slate-500">Stage 0{stage.id}</span>
                        <span className={isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                          {stage.latency}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{stage.title}</h3>
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-300">
                        <span className="rounded bg-slate-900 px-1.5 py-0.5 border border-slate-800 text-[10px] text-slate-300">
                          {stage.tech}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Pool Size:</span>
                      <span className="font-bold text-white">{stage.size}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Stage Visual Callout */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-400">
                  <strong className="text-white">{funnelStages[activeStage - 1].title}:</strong>{' '}
                  {funnelStages[activeStage - 1].desc}
                </span>
              </div>
              <button
                onClick={() => onOpenConsole('pipeline')}
                className="shrink-0 text-emerald-400 hover:text-emerald-300 font-mono text-xs flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View Mathematical Formulations</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. VISUAL KPI TILES (Bold Numbers, Clean Micro-Labels) */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-1">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block">Serving SLA (K=200)</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">&lt;620 ms</div>
              <span className="text-xs text-slate-400 block pt-1">17.6&times; faster than LLM</span>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-1">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block">Peak NDCG@10</span>
              <div className="text-3xl font-extrabold font-mono text-white tracking-tight">0.638</div>
              <span className="text-xs text-slate-400 block pt-1">Top Pareto boundary</span>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-1">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block">Token Bill Cut</span>
              <div className="text-3xl font-extrabold font-mono text-teal-300 tracking-tight">-94%</div>
              <span className="text-xs text-slate-400 block pt-1">Selective gating Top-3</span>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-1">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block">Open License</span>
              <div className="text-3xl font-extrabold font-mono text-indigo-400 tracking-tight">Apache 2.0</div>
              <span className="text-xs text-slate-400 block pt-1">100% On-Prem &amp; Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISUAL PARETO BENCHMARKS (Interactive Chart Section) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
          <div>
            <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">Empirical Validation</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pareto Frontier Dominance
            </h2>
          </div>
          <button
            onClick={() => onOpenConsole('benchmarks')}
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Multi-Dataset Analysis</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Visual Chart Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 shadow-xl">
          <SimplifiedParetoBenchmark onOpenConsole={onOpenConsole} />
        </div>
      </section>

      {/* 3. VISUAL ARCHITECTURE COMPARISON (Bento Cards instead of Dense Table) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        <div>
          <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">Architectural Comparison</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Why Open-Source AI RecSys Wins
          </h2>
        </div>

        {/* 3 High-Impact Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Pointwise LLMs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 font-semibold">Pointwise LLMs</span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Timeout Risk
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Qwen 7B / LLaMA</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Suffers explosive linear latency scaling. Hits 14.8 seconds at K=200 candidates, blowing past web timeout limits.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Latency:</span>
                <span className="text-rose-400 font-bold">14,800 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cost:</span>
                <span className="text-slate-300">$0.02 / query</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Context:</span>
                <span className="text-rose-400">Quality Collapse</span>
              </div>
            </div>
          </div>

          {/* Card 2: Proprietary SaaS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 font-semibold">Proprietary SaaS</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Vendor Lock-In
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Cloud Vendor API</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Opaque black-box models with recurring SaaS fees and third-party cloud data egress risks.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Latency:</span>
                <span className="text-amber-300 font-bold">150 &ndash; 300 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cost:</span>
                <span className="text-slate-300">$5,000+ / mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Privacy:</span>
                <span className="text-slate-400">External Egress</span>
              </div>
            </div>
          </div>

          {/* Card 3: Gorse x recsys-jev (Optimal) */}
          <div className="rounded-2xl border border-emerald-500/60 bg-gradient-to-b from-slate-900 to-slate-950 p-6 space-y-4 flex flex-col justify-between ring-1 ring-emerald-500/30 shadow-xl shadow-emerald-950/40">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-bold">Gorse &times; recsys-jev</span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                  Pareto Optimal
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Hybrid Choice Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Flat &lt;620ms serving SLA up to K=200, calibrated certainty gating, and selective explainability in your private VPC.
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-500/20 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Latency:</span>
                <span className="text-emerald-400 font-bold">&lt; 15ms / &lt; 620ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TCO:</span>
                <span className="text-emerald-300 font-bold">$0 (Apache 2.0)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Data Privacy:</span>
                <span className="text-emerald-300 font-medium">100% On-Prem</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEVELOPER CLIENT SDKS (Minimalist Code Tabs) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">Developer API</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Standard REST Client SDKs
            </h2>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
            {(['curl', 'python', 'go', 'typescript', 'rust'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveSdk(lang)}
                className={`px-3 py-1 rounded-lg transition-colors capitalize ${
                  activeSdk === lang
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs text-slate-300 shadow-xl overflow-x-auto">
          <button
            onClick={handleCopySdk}
            className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 px-3 py-1.5 text-[11px] text-slate-300 transition-colors"
          >
            {copiedSdk ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedSdk ? 'Copied' : 'Copy'}</span>
          </button>
          <pre className="pr-16 text-emerald-300/95 leading-relaxed">{SDK_CODE_SNIPPETS[activeSdk]}</pre>
        </div>
      </section>

      {/* 5. OPEN SOURCE & DOCKER QUICKSTART */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4 text-left pb-12">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>100% OPEN SOURCE &bull; APACHE 2.0</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Self-Host Anywhere in Under 30 Seconds
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Zero telemetry. Full data ownership. Drop-in compatible with existing Gorse vector indexes and Postgres stores.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <code className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300">
                docker compose up -d
              </code>
              <a
                href="/api/download/launch-video"
                download="recsys-jev-launch.mp4"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-emerald-300 transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>Download MP4 Launch Video (0.65 MB)</span>
              </a>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2.5 w-full md:w-auto">
            <button
              onClick={() => onOpenConsole('workbench')}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all shadow-md shadow-emerald-500/20"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Try Playground</span>
            </button>
            {onWatchLaunchVideo && (
              <button
                onClick={onWatchLaunchVideo}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 px-4 py-2.5 text-xs font-mono text-slate-300 hover:text-white transition-all"
              >
                <Play className="h-3 w-3 fill-current text-emerald-400" />
                <span>Watch Film</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
