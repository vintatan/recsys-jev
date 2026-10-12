import React, { useEffect, useRef } from 'react';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Target, Zap, Activity, Layers, Info, CheckCircle2 } from 'lucide-react';
import { Latex, LatexText } from './Latex';

// Register Chart.js radar components
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface PersonaRadarChartProps {
  userId: string;
  userName: string;
  domain: 'gitrec' | 'movies' | 'games' | 'books';
}

interface DimensionConfig {
  dimensions: string[];
  userWeights: number[];
  datasetCoverage: number[];
}

export const PersonaRadarChart: React.FC<PersonaRadarChartProps> = ({
  userId,
  userName,
  domain,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Dynamic dimension configuration based on domain & persona
  const getDimensionData = (): DimensionConfig => {
    if (domain === 'gitrec') {
      const isBob = userId === 'usr_bob_gitrec';
      return {
        dimensions: [
          'High-Throughput Serving',
          'Vector Indexing (ANN)',
          'Systems & Performance (Rust/Go)',
          'Distributed Architecture',
          'Deep Learning & PEFT',
          'Developer Ergonomics',
        ],
        userWeights: isBob
          ? [0.96, 0.91, 0.94, 0.82, 0.74, 0.85]
          : [0.65, 0.70, 0.60, 0.55, 0.88, 0.75],
        datasetCoverage: [0.92, 0.88, 0.89, 0.84, 0.90, 0.94],
      };
    }

    if (domain === 'movies') {
      const isAlice = userId === 'usr_alice_movies';
      return {
        dimensions: [
          'Mind-Bending Structure',
          'Hard Sci-Fi Physics',
          'Atmospheric Visuals',
          'Existential Dilemmas',
          'High-Concept Worldbuilding',
          'Psychological Suspense',
        ],
        userWeights: isAlice
          ? [0.96, 0.92, 0.95, 0.90, 0.94, 0.88]
          : [0.60, 0.55, 0.70, 0.65, 0.75, 0.80],
        datasetCoverage: [0.90, 0.88, 0.96, 0.92, 0.94, 0.86],
      };
    }

    if (domain === 'games') {
      const isCharlie = userId === 'usr_charlie_games';
      return {
        dimensions: [
          'Boss Mechanics & Mastery',
          'Tactical RPG Decisions',
          'Atmospheric Lore & World',
          'High-Mobility Combat',
          'Cyberpunk Themes',
          'Build Customization',
        ],
        userWeights: isCharlie
          ? [0.98, 0.94, 0.92, 0.95, 0.88, 0.96]
          : [0.65, 0.75, 0.70, 0.80, 0.60, 0.70],
        datasetCoverage: [0.94, 0.90, 0.92, 0.89, 0.86, 0.95],
      };
    }

    // Books domain
    const isDave = userId === 'usr_dave_books';
    return {
      dimensions: [
        'Storage Engines & LSM Trees',
        'Consensus & Replication',
        'Production MLOps Pipelines',
        'Service Decoupling & Events',
        'Cosmic Sociology Sci-Fi',
        'Data Fault Tolerance',
      ],
      userWeights: isDave
        ? [0.97, 0.95, 0.92, 0.86, 0.94, 0.96]
        : [0.55, 0.60, 0.70, 0.65, 0.85, 0.60],
      datasetCoverage: [0.95, 0.92, 0.90, 0.88, 0.92, 0.94],
    };
  };

  const currentData = getDimensionData();

  // Calculate Cosine Similarity between user weights and dataset coverage
  const calculateCosineAffinity = (v1: number[], v2: number[]) => {
    let dot = 0;
    let norm1 = 0;
    let norm2 = 0;
    for (let i = 0; i < v1.length; i++) {
      dot += v1[i] * v2[i];
      norm1 += v1[i] * v1[i];
      norm2 += v2[i] * v2[i];
    }
    return norm1 > 0 && norm2 > 0 ? dot / (Math.sqrt(norm1) * Math.sqrt(norm2)) : 0.85;
  };

  const cosineAffinity = calculateCosineAffinity(currentData.userWeights, currentData.datasetCoverage);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: currentData.dimensions,
        datasets: [
          {
            label: `User Profile Vector (${userName})`,
            data: currentData.userWeights,
            borderColor: '#10b981', // emerald
            backgroundColor: 'rgba(16, 185, 129, 0.25)',
            borderWidth: 2.5,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#10b981',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: `Corpus Item Coverage (${domain.toUpperCase()})`,
            data: currentData.datasetCoverage,
            borderColor: '#6366f1', // indigo
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            borderWidth: 2,
            borderDash: [4, 4],
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#6366f1',
            pointRadius: 3.5,
            pointHoverRadius: 5,
          },
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
              font: { family: 'ui-monospace, monospace', size: 11 },
              padding: 14,
            },
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${(context.parsed.r * 100).toFixed(0)}%`,
            },
          },
        },
        scales: {
          r: {
            min: 0,
            max: 1.0,
            ticks: {
              stepSize: 0.2,
              display: false,
            },
            grid: {
              color: 'rgba(51, 65, 85, 0.45)', // slate-700
            },
            angleLines: {
              color: 'rgba(51, 65, 85, 0.6)',
            },
            pointLabels: {
              color: '#cbd5e1',
              font: {
                family: 'ui-monospace, monospace',
                size: 10,
                weight: 'bold',
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [userId, domain]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-400" />
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <span>Decision State Trajectory</span>
            <Latex math="S_u" className="text-emerald-300 font-bold" />
            <span>vs. Corpus Coverage</span>
          </h4>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Cosine Alignment <Latex math="\cos(S_u, \mathcal{D})" />:</span>
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-bold border border-emerald-500/30">
            {(cosineAffinity * 100).toFixed(1)}% High Fit
          </span>
        </div>
      </div>

      {/* Main Grid: Radar Canvas + Dimension Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Chart Canvas */}
        <div className="lg:col-span-7 h-72 sm:h-80 w-full relative">
          <canvas ref={canvasRef} />
        </div>

        {/* Dimension Breakdown List & Alignment Insights */}
        <div className="lg:col-span-5 space-y-3 font-mono text-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Latent Facet Breakdown</span>
            <span>User vs. Dataset</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {currentData.dimensions.map((dim, idx) => {
              const uWeight = currentData.userWeights[idx];
              const dCov = currentData.datasetCoverage[idx];
              const delta = Math.abs(uWeight - dCov);
              const isWellCovered = delta < 0.12;

              return (
                <div
                  key={dim}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-2.5 space-y-1.5 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-200 font-semibold truncate max-w-[170px]" title={dim}>
                      {dim}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-emerald-400 font-bold">{(uWeight * 100).toFixed(0)}%</span>
                      <span className="text-slate-600">/</span>
                      <span className="text-indigo-400">{(dCov * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Dual Bar Indicator */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${uWeight * 100}%` }}
                        title={`User Weight: ${(uWeight * 100).toFixed(0)}%`}
                      />
                    </div>
                    <div className="h-1 w-full rounded-full bg-slate-800/60 overflow-hidden flex">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${dCov * 100}%` }}
                        title={`Dataset Coverage: ${(dCov * 100).toFixed(0)}%`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
            <Info className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <LatexText>
                {'The Jev System 1 Decision Model formulates discrete utilities $U(i, S_u)$ from this dimensional overlap vector, ensuring calibrated isotropic choice probabilities $P(i \\mid S_u, \\mathcal{C}_u^{(K)}$.'}
              </LatexText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
