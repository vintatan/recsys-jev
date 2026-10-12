import React, { useEffect, useRef, useState } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScatterController,
} from 'chart.js';
import {
  Award,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Film,
  Gamepad2,
  BookOpen,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DATASET_BENCHMARK_PROFILES } from '../data/mockData';
import { Latex } from './Latex';

// Register Chart.js elements
Chart.register(
  LineController,
  ScatterController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SimplifiedParetoBenchmarkProps {
  onOpenConsole?: (tab?: string) => void;
  compact?: boolean;
}

export const SimplifiedParetoBenchmark: React.FC<SimplifiedParetoBenchmarkProps> = ({
  onOpenConsole,
  compact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [activeDatasetDomain, setActiveDatasetDomain] = useState<'gitrec' | 'movies' | 'games' | 'books'>('gitrec');
  const [activeView, setActiveView] = useState<'pareto' | 'latency' | 'quality'>('pareto');
  const [selectedModel, setSelectedModel] = useState<string>('recsys-jev (Ours)');

  const profile = DATASET_BENCHMARK_PROFILES[activeDatasetDomain];

  // Re-render chart whenever activeView or activeDatasetDomain changes
  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (activeView === 'pareto') {
      // 1. Simplified Pareto Frontier View: Quality vs Latency
      // Sort pareto points by latency to draw the frontier line
      const paretoOptimalPoints = profile.paretoPoints
        .filter((p) => p.isPareto)
        .sort((a, b) => a.latency - b.latency)
        .map((p) => ({ x: p.latency, y: p.ndcg }));

      const dominatedPoints = profile.paretoPoints
        .filter((p) => !p.isPareto)
        .map((p) => ({ x: p.latency, y: p.ndcg }));

      chartInstanceRef.current = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            // Pareto Frontier Line connecting optimal models
            {
              type: 'line',
              label: 'Pareto Optimal Frontier',
              data: paretoOptimalPoints as any,
              borderColor: 'rgba(16, 185, 129, 0.8)',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderWidth: 2,
              borderDash: [4, 4],
              pointRadius: 0,
              fill: false,
              tension: 0.1,
            },
            // Individual models for clean legend & tooltips
            ...profile.paretoPoints.map((pt) => ({
              label: pt.model,
              data: [{ x: pt.latency, y: pt.ndcg }],
              backgroundColor: pt.color,
              borderColor: pt.model.includes('recsys-jev') ? '#ffffff' : pt.color,
              borderWidth: pt.model.includes('recsys-jev') ? 2 : 1,
              pointRadius: pt.model.includes('recsys-jev') ? 9 : pt.isPareto ? 6 : 5,
              pointHoverRadius: 11,
            })),
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#94a3b8',
                font: { family: 'ui-monospace, monospace', size: 10 },
                usePointStyle: true,
                filter: (legendItem) => legendItem.text !== 'Pareto Optimal Frontier',
              },
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleColor: '#f8fafc',
              bodyColor: '#cbd5e1',
              borderColor: '#334155',
              borderWidth: 1,
              padding: 10,
              callbacks: {
                title: (items) => items[0]?.dataset.label || '',
                label: (context: any) =>
                  ` Latency: ${context.parsed.x} ms | NDCG@10: ${context.parsed.y} (${
                    context.parsed.x <= 900 && context.parsed.y >= 0.6
                      ? 'Optimal Sweet Spot'
                      : context.parsed.x > 1000
                      ? 'Latency Dominated'
                      : 'Classical Baseline'
                  })`,
              },
            },
          },
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: 'P99 Serving Latency at K=50 (ms) — [Lower is Better]',
                color: '#94a3b8',
                font: { family: 'ui-monospace, monospace', size: 11 },
              },
              grid: { color: '#1e293b' },
              ticks: {
                color: '#64748b',
                font: { family: 'ui-monospace, monospace' },
                callback: (val) => `${val}ms`,
              },
            },
            y: {
              min: 0.36,
              max: 0.68,
              title: {
                display: true,
                text: 'Ranking Quality (NDCG@10) — [Higher is Better]',
                color: '#94a3b8',
                font: { family: 'ui-monospace, monospace', size: 11 },
              },
              grid: { color: '#1e293b' },
              ticks: {
                color: '#64748b',
                font: { family: 'ui-monospace, monospace' },
              },
            },
          },
        },
      });
    } else if (activeView === 'latency') {
      // 2. Latency Scaling vs K view
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: profile.latencyData.kValues.map((k) => `K=${k}`),
          datasets: [
            {
              label: 'recsys-jev (Flat SLA <900ms)',
              data: profile.latencyData.jev,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              pointBackgroundColor: '#10b981',
              pointRadius: 4,
              tension: 0.15,
              fill: false,
            },
            {
              label: 'Qwen 7B Pointwise (Exponential Blowup)',
              data: profile.latencyData.qwenPointwise,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 2.5,
              borderDash: [5, 5],
              pointBackgroundColor: '#ef4444',
              pointRadius: 4,
              tension: 0.2,
              fill: false,
            },
            {
              label: 'Qwen 7B Listwise (Context Dilution)',
              data: profile.latencyData.qwenListwise,
              borderColor: '#f59e0b',
              borderWidth: 2,
              pointBackgroundColor: '#f59e0b',
              pointRadius: 3,
              tension: 0.15,
              fill: false,
            },
            {
              label: 'SASRec (Sequential Baseline)',
              data: profile.latencyData.sasrec,
              borderColor: '#06b6d4',
              borderWidth: 2,
              pointBackgroundColor: '#06b6d4',
              pointRadius: 3,
              tension: 0.1,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#94a3b8',
                font: { family: 'ui-monospace, monospace', size: 10 },
              },
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleColor: '#f8fafc',
              bodyColor: '#cbd5e1',
              borderColor: '#334155',
              borderWidth: 1,
              callbacks: {
                label: (context) => ` ${context.dataset.label}: ${context.parsed.y} ms`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: '#1e293b' },
              ticks: { color: '#64748b', font: { family: 'ui-monospace, monospace' } },
            },
            y: {
              grid: { color: '#1e293b' },
              ticks: {
                color: '#64748b',
                font: { family: 'ui-monospace, monospace' },
                callback: (value) => `${value}ms`,
              },
            },
          },
        },
      });
    } else {
      // 3. NDCG Quality Curve vs K view
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: profile.ndcgData.kValues.map((k) => `K=${k}`),
          datasets: [
            {
              label: 'recsys-jev (Continuous Monotonic Gain)',
              data: profile.ndcgData.jev,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              pointBackgroundColor: '#10b981',
              pointRadius: 4,
              tension: 0.15,
              fill: false,
            },
            {
              label: 'Qwen 7B Pointwise (Asymptotic Limit)',
              data: profile.ndcgData.qwenPointwise,
              borderColor: '#ef4444',
              borderWidth: 2,
              borderDash: [4, 4],
              pointBackgroundColor: '#ef4444',
              pointRadius: 3,
              tension: 0.15,
              fill: false,
            },
            {
              label: 'Qwen 7B Listwise (Context Collapse @ K>40)',
              data: profile.ndcgData.qwenListwise,
              borderColor: '#f59e0b',
              borderWidth: 2.5,
              pointBackgroundColor: '#f59e0b',
              pointRadius: 4,
              tension: 0.2,
              fill: false,
            },
            {
              label: 'SASRec (Early Plateau)',
              data: profile.ndcgData.sasrec,
              borderColor: '#06b6d4',
              borderWidth: 2,
              pointBackgroundColor: '#06b6d4',
              pointRadius: 3,
              tension: 0.1,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#94a3b8',
                font: { family: 'ui-monospace, monospace', size: 10 },
              },
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleColor: '#f8fafc',
              bodyColor: '#cbd5e1',
              borderColor: '#334155',
              borderWidth: 1,
              callbacks: {
                label: (context) => ` ${context.dataset.label}: NDCG@10 = ${context.parsed.y}`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: '#1e293b' },
              ticks: { color: '#64748b', font: { family: 'ui-monospace, monospace' } },
            },
            y: {
              min: 0.36,
              max: 0.67,
              grid: { color: '#1e293b' },
              ticks: { color: '#64748b', font: { family: 'ui-monospace, monospace' } },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [activeDatasetDomain, activeView]);

  const datasets = [
    { id: 'gitrec' as const, label: 'GitHub GitRec', icon: <Code2 className="h-3.5 w-3.5" />, tag: '128k Repos' },
    { id: 'movies' as const, label: 'Amazon Movies & TV', icon: <Film className="h-3.5 w-3.5" />, tag: '412k Titles' },
    { id: 'games' as const, label: 'Amazon Video Games', icon: <Gamepad2 className="h-3.5 w-3.5" />, tag: '286k Games' },
    { id: 'books' as const, label: 'Amazon Books', icon: <BookOpen className="h-3.5 w-3.5" />, tag: '950k Books' },
  ];

  const currentModelData = profile.paretoPoints.find((p) => p.model === selectedModel) || profile.paretoPoints[0];

  return (
    <div className="space-y-6">
      {/* Top Controls: Dataset Selector + Chart View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Dataset Tabs */}
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase text-slate-400 block mb-2">
            Select Empirical Benchmark Dataset:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {datasets.map((ds) => {
              const isSelected = activeDatasetDomain === ds.id;
              return (
                <button
                  key={ds.id}
                  onClick={() => setActiveDatasetDomain(ds.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    isSelected
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-semibold shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className={isSelected ? 'text-emerald-400' : 'text-slate-500'}>{ds.icon}</span>
                  <span>{ds.label}</span>
                  <span className="text-[10px] text-slate-500 opacity-80">({ds.tag})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Switcher: Pareto Frontier vs Latency Scaling vs NDCG Curve */}
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase text-slate-400 block mb-2">
            Benchmark Chart View:
          </span>
          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1 font-mono text-xs">
            <button
              onClick={() => setActiveView('pareto')}
              className={`rounded-md px-3 py-1 transition-all ${
                activeView === 'pareto'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pareto Frontier
            </button>
            <button
              onClick={() => setActiveView('latency')}
              className={`rounded-md px-3 py-1 transition-all ${
                activeView === 'latency'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Latency Scaling vs K
            </button>
            <button
              onClick={() => setActiveView('quality')}
              className={`rounded-md px-3 py-1 transition-all ${
                activeView === 'quality'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              NDCG@10 Curve
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6 space-y-4">
        {/* Chart Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-sm font-bold text-white">
                {activeView === 'pareto' && `Empirical Pareto Frontier: Quality vs Serving Latency (${profile.shortName})`}
                {activeView === 'latency' && `Figure 1: Serving Latency Scaling up to K=200 (${profile.shortName})`}
                {activeView === 'quality' && `Figure 2: NDCG@10 vs Candidate Set Size K (${profile.shortName})`}
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeView === 'pareto' && 'Models in the top-left quadrant are Pareto-optimal (maximum quality for lowest latency).'}
              {activeView === 'latency' && 'Pointwise LLMs scale exponentially O(K) while recsys-jev maintains a flat SLA under 900ms.'}
              {activeView === 'quality' && 'Listwise LLMs suffer attention collapse beyond K=40, whereas recsys-jev climbs monotonically.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-mono text-emerald-400 font-semibold">
              Peak NDCG: {profile.keyInsights.jevPeakNdcg}
            </span>
            <span className="rounded bg-slate-800 border border-slate-700 px-2.5 py-1 text-[11px] font-mono text-slate-300">
              SLA: {profile.keyInsights.jevP99Latency}
            </span>
          </div>
        </div>

        {/* Canvas container */}
        <div className="h-72 sm:h-80 w-full pt-1">
          <canvas ref={canvasRef} />
        </div>

        {/* Interactive Model Quick Selector / Status */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Inspect Model:</span>
            <div className="flex flex-wrap items-center gap-1">
              {profile.paretoPoints.map((pt) => (
                <button
                  key={pt.model}
                  onClick={() => setSelectedModel(pt.model)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                    selectedModel === pt.model
                      ? 'bg-slate-700 text-white font-bold ring-1 ring-slate-500'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: pt.color }} />
                  {pt.model}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">
              {currentModelData.model}: <strong className="text-white">{currentModelData.latency}ms</strong> | NDCG:{' '}
              <strong className="text-emerald-400">{currentModelData.ndcg}</strong>
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${
                currentModelData.isPareto
                  ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                  : 'border-red-500/40 bg-red-500/20 text-red-300'
              }`}
            >
              {currentModelData.isPareto ? 'Pareto Optimal' : 'Dominated'}
            </span>
          </div>
        </div>
      </div>

      {/* Simplified 3-Column Pareto Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="rounded-xl border border-emerald-900/40 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>recsys-jev Establishes SOTA Frontier</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Delivers the highest ranking accuracy (<span className="text-emerald-300 font-mono font-bold">{profile.keyInsights.jevPeakNdcg} NDCG</span>) while strictly respecting sub-second production SLAs (&lt;900ms flat).
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-red-900/30 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-semibold text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Pointwise LLMs Suffer Latency Blowup</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Qwen 7B Pointwise takes 14,840ms at K=200 and costs 76,000 tokens/query. recsys-jev is{' '}
            <span className="text-amber-300 font-mono font-bold">{profile.keyInsights.efficiencyGain}</span> with zero token waste.
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-amber-900/30 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <TrendingUp className="h-4 w-4 shrink-0" />
            <span>Listwise LLMs Collapse Under Long Context</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            As candidate pool exceeds {profile.keyInsights.collapseThreshold}, listwise prompt dilution causes rank collapse down to NDCG 0.395. recsys-jev scales monotonically.
          </p>
        </div>
      </div>

      {/* CTA to Open Full Benchmarks Console */}
      {onOpenConsole && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="text-xs text-slate-400">
            Need in-depth multi-metric evaluation across MRR, HitRate@10, and Table 2 matrices?
          </div>
          <button
            onClick={() => onOpenConsole('benchmarks')}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Open Comprehensive Benchmarks Console</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
