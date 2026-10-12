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
import { Award, BarChart2, CheckCircle2, TrendingUp, Zap, HelpCircle, Code2, Film, Gamepad2, BookOpen, Layers } from 'lucide-react';
import { TABLE_2_BENCHMARKS, DATASET_BENCHMARK_PROFILES } from '../data/mockData';
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

export const Benchmarks: React.FC = () => {
  const latencyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ndcgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const paretoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const latencyChartRef = useRef<Chart | null>(null);
  const ndcgChartRef = useRef<Chart | null>(null);
  const paretoChartRef = useRef<Chart | null>(null);

  const [activeDatasetDomain, setActiveDatasetDomain] = useState<'gitrec' | 'movies' | 'games' | 'books'>('gitrec');

  const activeProfile = DATASET_BENCHMARK_PROFILES[activeDatasetDomain];

  useEffect(() => {
    // 1. Initialize Figure 1: Latency vs K for Active Dataset
    if (latencyCanvasRef.current) {
      if (latencyChartRef.current) {
        latencyChartRef.current.destroy();
      }

      const ctx = latencyCanvasRef.current.getContext('2d');
      if (ctx) {
        latencyChartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: activeProfile.latencyData.kValues.map((k) => `K=${k}`),
            datasets: [
              {
                label: 'recsys-jev (Flat SLA <900ms)',
                data: activeProfile.latencyData.jev,
                borderColor: '#10b981', // emerald
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#10b981',
                pointRadius: 4,
                tension: 0.2,
                fill: false,
              },
              {
                label: 'Qwen 7B Pointwise (Exponential Blowup)',
                data: activeProfile.latencyData.qwenPointwise,
                borderColor: '#ef4444', // red
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2.5,
                borderDash: [5, 5],
                pointBackgroundColor: '#ef4444',
                pointRadius: 4,
                tension: 0.3,
                fill: false,
              },
              {
                label: 'Qwen 7B Listwise (Context Dilution)',
                data: activeProfile.latencyData.qwenListwise,
                borderColor: '#f59e0b', // amber
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#f59e0b',
                pointRadius: 3,
                tension: 0.2,
                fill: false,
              },
              {
                label: 'SASRec (Sequential Baseline)',
                data: activeProfile.latencyData.sasrec,
                borderColor: '#06b6d4', // cyan
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
                  font: { family: 'ui-monospace, monospace', size: 11 },
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
      }
    }

    // 2. Initialize Figure 2: NDCG@10 vs K for Active Dataset
    if (ndcgCanvasRef.current) {
      if (ndcgChartRef.current) {
        ndcgChartRef.current.destroy();
      }

      const ctx2 = ndcgCanvasRef.current.getContext('2d');
      if (ctx2) {
        ndcgChartRef.current = new Chart(ctx2, {
          type: 'line',
          data: {
            labels: activeProfile.ndcgData.kValues.map((k) => `K=${k}`),
            datasets: [
              {
                label: `recsys-jev (Peak ${activeProfile.keyInsights.jevPeakNdcg})`,
                data: activeProfile.ndcgData.jev,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderWidth: 3,
                pointBackgroundColor: '#10b981',
                pointRadius: 4,
                tension: 0.2,
                fill: false,
              },
              {
                label: `Qwen 7B Listwise (Collapse @ ${activeProfile.keyInsights.collapseThreshold})`,
                data: activeProfile.ndcgData.qwenListwise,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2.5,
                borderDash: [4, 4],
                pointBackgroundColor: '#ef4444',
                pointRadius: 4,
                tension: 0.3,
                fill: false,
              },
              {
                label: 'Qwen 7B Pointwise (Saturates)',
                data: activeProfile.ndcgData.qwenPointwise,
                borderColor: '#818cf8',
                borderWidth: 2,
                pointBackgroundColor: '#818cf8',
                pointRadius: 3,
                tension: 0.2,
                fill: false,
              },
              {
                label: 'SASRec (Plateau)',
                data: activeProfile.ndcgData.sasrec,
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
                  font: { family: 'ui-monospace, monospace', size: 11 },
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
                min: 0.35,
                max: 0.66,
                grid: { color: '#1e293b' },
                ticks: {
                  color: '#64748b',
                  font: { family: 'ui-monospace, monospace' },
                },
              },
            },
          },
        });
      }
    }

    // 3. Initialize Figure 3: Empirical Pareto Frontier (NDCG@10 vs Latency) for Active Dataset
    if (paretoCanvasRef.current) {
      if (paretoChartRef.current) {
        paretoChartRef.current.destroy();
      }

      const ctx3 = paretoCanvasRef.current.getContext('2d');
      if (ctx3) {
        const paretoFrontierCurve = activeProfile.paretoPoints
          .filter((pt) => pt.isPareto)
          .sort((a, b) => a.latency - b.latency)
          .map((pt) => ({ x: pt.latency, y: pt.ndcg }));

        paretoChartRef.current = new Chart(ctx3, {
          type: 'scatter',
          data: {
            datasets: [
              // Pareto frontier line
              {
                type: 'line',
                label: 'Pareto Frontier Line',
                data: paretoFrontierCurve as any,
                borderColor: 'rgba(16, 185, 129, 0.7)',
                borderWidth: 2,
                borderDash: [4, 4],
                pointRadius: 0,
                fill: false,
                tension: 0.1,
              },
              ...activeProfile.paretoPoints.map((pt) => ({
                label: pt.model,
                data: [{ x: pt.latency, y: pt.ndcg }],
                backgroundColor: pt.color,
                borderColor: pt.model.includes('recsys-jev') ? '#ffffff' : pt.color,
                borderWidth: pt.model.includes('recsys-jev') ? 2 : 1,
                pointRadius: pt.model.includes('recsys-jev') ? 9 : pt.isPareto ? 6 : 5,
                pointHoverRadius: 10,
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
                  filter: (item) => item.text !== 'Pareto Frontier Line',
                },
              },
              tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: '#334155',
                borderWidth: 1,
                callbacks: {
                  title: (items) => items[0]?.dataset.label || '',
                  label: (context: any) =>
                    ` Latency: ${context.parsed.x} ms | NDCG@10: ${context.parsed.y}`,
                },
              },
            },
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: 'Serving Latency at K=50 (ms) — [Lower is Better]',
                  color: '#94a3b8',
                  font: { family: 'ui-monospace, monospace', size: 11 },
                },
                grid: { color: '#1e293b' },
                ticks: {
                  color: '#64748b',
                  font: { family: 'ui-monospace, monospace' },
                  callback: (value) => `${value}ms`,
                },
              },
              y: {
                min: 0.35,
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
      }
    }

    return () => {
      if (latencyChartRef.current) latencyChartRef.current.destroy();
      if (ndcgChartRef.current) ndcgChartRef.current.destroy();
      if (paretoChartRef.current) paretoChartRef.current.destroy();
    };
  }, [activeDatasetDomain]);

  const datasetList = [
    {
      id: 'gitrec' as const,
      name: 'GitHub GitRec',
      category: '128k Repositories',
      icon: <Code2 className="h-4 w-4" />,
      tag: 'GitRec 2026',
    },
    {
      id: 'movies' as const,
      name: 'Amazon Movies & TV',
      category: '412k Titles',
      icon: <Film className="h-4 w-4" />,
      tag: 'Amazon 2023',
    },
    {
      id: 'games' as const,
      name: 'Amazon Video Games',
      category: '286k Games',
      icon: <Gamepad2 className="h-4 w-4" />,
      tag: 'Amazon 2023',
    },
    {
      id: 'books' as const,
      name: 'Amazon Books',
      category: '950k Books',
      icon: <BookOpen className="h-4 w-4" />,
      tag: 'Amazon 2023',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. TOP HEADER & DATASET SELECTOR */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Empirical Pareto Benchmarks</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select any benchmark dataset below to immediately update all empirical graphs, latency scaling curves, and Pareto trade-off points.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Dataset-Synced Graphs
            </span>
          </div>
        </div>

        {/* Dataset Selection Tabs */}
        <div>
          <label className="text-[11px] font-mono font-semibold uppercase text-slate-400 block mb-2">
            Select Benchmark Dataset:
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {datasetList.map((ds) => {
              const isSelected = activeDatasetDomain === ds.id;
              return (
                <button
                  key={ds.id}
                  onClick={() => setActiveDatasetDomain(ds.id)}
                  className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-emerald-500/60 bg-emerald-500/15 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40 text-white'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={isSelected ? 'text-emerald-400' : 'text-slate-500'}>{ds.icon}</span>
                    <span
                      className={`text-[10px] font-mono rounded px-1.5 py-0.5 border ${
                        isSelected
                          ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                          : 'border-slate-800 bg-slate-900 text-slate-500'
                      }`}
                    >
                      {ds.tag}
                    </span>
                  </div>
                  <span className={`text-sm font-bold mt-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {ds.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 mt-0.5">{ds.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Dataset Insights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 font-mono text-xs">
          <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-2.5">
            <span className="text-slate-500 text-[10px] block">Dataset Scope</span>
            <span className="text-white font-bold text-xs">{activeProfile.name}</span>
          </div>
          <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-2.5">
            <span className="text-slate-500 text-[10px] block">recsys-jev Peak NDCG@10</span>
            <span className="text-emerald-400 font-bold text-xs">{activeProfile.keyInsights.jevPeakNdcg}</span>
          </div>
          <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-2.5">
            <span className="text-slate-500 text-[10px] block">P99 SLA Latency Limit</span>
            <span className="text-emerald-400 font-bold text-xs">{activeProfile.keyInsights.jevP99Latency}</span>
          </div>
          <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-2.5">
            <span className="text-slate-500 text-[10px] block">Pointwise LLM Speedup</span>
            <span className="text-amber-400 font-bold text-xs">{activeProfile.keyInsights.efficiencyGain}</span>
          </div>
        </div>
      </div>

      {/* 2. THREE DATASET-SYNCED BENCHMARK GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Figure 1: Latency Scaling vs K */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span>Figure 1: Latency Scaling</span>
                <Latex math="(K)" className="text-slate-300" />
              </h4>
              <p className="text-xs text-slate-400">{activeProfile.shortName} • Serving SLA</p>
            </div>
            <span className="rounded bg-red-500/10 px-2 py-0.5 font-mono text-[10px] text-red-400 border border-red-500/30">
              P99 &lt; 900ms
            </span>
          </div>

          <div className="h-64 w-full pt-1">
            <canvas ref={latencyCanvasRef} />
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>LLMs explode linearly</span>
            <span className="text-emerald-400 font-bold">Jev: Flat &lt; 900ms</span>
          </div>
        </div>

        {/* Figure 2: NDCG@10 vs K */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span>Figure 2: Quality</span>
                <Latex math="\text{NDCG}@10(K)" className="text-emerald-300" />
              </h4>
              <p className="text-xs text-slate-400">{activeProfile.shortName} • Listwise Collapse</p>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/30">
              Pareto Peak
            </span>
          </div>

          <div className="h-64 w-full pt-1">
            <canvas ref={ndcgCanvasRef} />
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Listwise collapses @ {activeProfile.keyInsights.collapseThreshold}</span>
            <span className="text-emerald-400 font-bold">Peak: {activeProfile.keyInsights.jevPeakNdcg}</span>
          </div>
        </div>

        {/* Figure 3: Empirical Pareto Frontier (NDCG vs Latency) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span>Figure 3: Pareto Frontier</span>
                <Latex math="(\text{NDCG} \text{ vs. } T)" className="text-indigo-300" />
              </h4>
              <p className="text-xs text-slate-400">{activeProfile.shortName} • Quality vs Latency</p>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/30">
              Optimal Boundary
            </span>
          </div>

          <div className="h-64 w-full pt-1">
            <canvas ref={paretoCanvasRef} />
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Dashed curve: Non-dominated Pareto Frontier</span>
            <span className="text-emerald-400 font-bold">recsys-jev + SASRec</span>
          </div>
        </div>
      </div>

      {/* 3. TABLE 2 BENCHMARK MATRIX (SYNCED TO ACTIVE DATASET) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-white">
              Table 2: Comprehensive Multi-Domain Evaluation Matrix
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Currently highlighting metrics for{' '}
              <span className="text-emerald-300 font-bold">{activeProfile.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1 font-mono text-xs">
            {datasetList.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDatasetDomain(d.id)}
                className={`rounded px-2.5 py-1 uppercase transition-all ${
                  activeDatasetDomain === d.id
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d.id}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold text-slate-300">Model Architecture</th>
                <th className="pb-3 font-semibold">Model Class</th>
                <th className="pb-3 font-semibold flex items-center gap-1">
                  <span>Latency</span>
                  <Latex math="(K=50)" className="text-[11px]" />
                </th>
                <th className="pb-3 font-semibold text-red-400">
                  <span>Latency </span>
                  <Latex math="(K=200)" className="text-[11px] text-red-400" />
                </th>
                <th className="pb-3 font-semibold text-emerald-400">
                  <span>NDCG@10 ({activeDatasetDomain.toUpperCase()})</span>
                </th>
                <th className="pb-3 font-semibold">HitRate@10</th>
                <th className="pb-3 font-semibold">MRR</th>
                <th className="pb-3 font-semibold">Pareto Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {TABLE_2_BENCHMARKS.map((row) => {
                const ndcgValue =
                  activeDatasetDomain === 'gitrec'
                    ? row.ndcgGitrec
                    : activeDatasetDomain === 'movies'
                    ? row.ndcgMovies
                    : activeDatasetDomain === 'games'
                    ? row.ndcgGames
                    : row.ndcgBooks;

                return (
                  <tr
                    key={row.modelName}
                    className={row.paretoFrontier ? 'bg-emerald-500/10 text-emerald-200 font-semibold' : ''}
                  >
                    <td className="py-3 flex items-center gap-2">
                      {row.paretoFrontier && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />}
                      <span>{row.modelName}</span>
                    </td>
                    <td className="py-3 text-slate-400">{row.modelType}</td>
                    <td className="py-3">{row.latencyK50} ms</td>
                    <td className={`py-3 font-mono ${row.latencyK200 > 5000 ? 'text-red-400 font-bold' : ''}`}>
                      {row.latencyK200} ms
                    </td>
                    <td className="py-3 text-emerald-400 font-bold">{ndcgValue.toFixed(3)}</td>
                    <td className="py-3">{(row.hitRate10 * 100).toFixed(1)}%</td>
                    <td className="py-3">{row.mrr.toFixed(3)}</td>
                    <td className="py-3">
                      {row.paretoFrontier ? (
                        <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 border border-emerald-500/40">
                          Optimal Frontier
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Sub-optimal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
