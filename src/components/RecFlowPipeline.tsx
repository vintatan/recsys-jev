import React, { useState } from 'react';
import {
  Layers,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Database,
  Code,
  Gauge,
  Info,
} from 'lucide-react';
import { Latex, LatexText } from './Latex';

export const RecFlowPipeline: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(2);

  const stages = [
    {
      id: 1,
      title: 'Stage 1: Multi-Source Retrieval',
      subtitle: 'RecFlow Candidate Fan-Out',
      icon: <Database className="h-5 w-5 text-emerald-400" />,
      badge: 'Latency < 15ms',
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      description:
        'Pulls an over-complete candidate pool $K \\in [20, 200]$ across 4 decoupled parallel streams: Collaborative Filtering (BPR factors=64), IVF1024-PQ32 dense vector embeddings, Popularity/Trending window, and Freshness streams.',
      technicalDetails: {
        inputs: 'User ID $u$, Domain dataset, Candidate pool size $K$',
        outputs: 'Candidate pool $\\mathcal{C}_u^{(K)}$ with baseline scores and dense vector embeddings',
        algorithm: 'Parallel channel Fan-Out + Min-Score Thresholding + Redis Set Union',
        paperCitation: 'RecFlow Two-Stage Pipeline (Apache 2.0 Open-Source RecSys Architecture)',
        formula: '\\mathcal{C}_u^{(K)} = \\bigcup_{s \\in \\mathcal{S}} \\text{TopK}_{s}(u) = \\text{TopK}_{\\text{CF}} \\cup \\text{TopK}_{\\text{Vec}} \\cup \\text{TopK}_{\\text{Pop}} \\cup \\text{TopK}_{\\text{Fresh}}',
      },
    },
    {
      id: 2,
      title: 'Stage 2: Jev System 1 Rerank',
      subtitle: 'Decision-Oriented Choice Modeling',
      icon: <Zap className="h-5 w-5 text-indigo-400" />,
      badge: 'Sub-900ms Flat P99',
      badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
      description:
        'Formulates user history into a continuous Decision State $S_u$ and candidate items into typed discrete Choice Alternatives $\\mathcal{C}_u^{(K)}$. Models utility through isotropic softmax, producing calibrated probabilities without token generation bottlenecks.',
      technicalDetails: {
        inputs: 'Decision State $S_u = f_\\theta(\\mathcal{H}_u) \\in \\mathbb{R}^d$ + Candidates $\\mathcal{C}_u^{(K)}$',
        outputs: 'Calibrated choice probability vector $P(i \\mid S_u, \\mathcal{C}_u^{(K)})$ across all $K$ items',
        algorithm: 'TypeSafe Jev Decision Gateway (/v1/decisions) & Isotropic Calibrated Softmax',
        paperCitation: 'Lyu & Xia (Meta AI & SMU, 2026): Decision-Oriented Recommendation Reranking',
        formula: 'P(i \\mid S_u, \\mathcal{C}_u^{(K)}) = \\frac{\\exp\\big(U(i, S_u)/\\tau\\big)}{\\sum_{j \\in \\mathcal{C}_u^{(K)}} \\exp\\big(U(j, S_u)/\\tau\\big)}',
      },
    },
    {
      id: 3,
      title: 'Stage 3: Confidence Gating',
      subtitle: 'Probabilistic Calibrated Threshold',
      icon: <ShieldCheck className="h-5 w-5 text-cyan-400" />,
      badge: 'Cutoff P >= 0.85',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      description:
        'Gates items through calibrated certainty bounds $P(i \\mid S_u, \\mathcal{C}_u^{(K)}) \\ge \\tau_{\\text{calibrated}}$. In choice theory, when entropy is high or alternatives lack strong utility alignment, gating suppresses speculative noise, preventing lukewarm or irrelevant recommendations.',
      technicalDetails: {
        inputs: 'Probability vector $P(i \\mid S_u, \\mathcal{C}_u^{(K)})$ and threshold $\\tau_{\\text{calibrated}} = 0.85$',
        outputs: 'Filtered & Ranked Top-N slate sorted by choice likelihood',
        algorithm: 'Isotropic Calibrated Softmax Cutoff + Entropy Thresholding',
        paperCitation: 'Lyu & Xia (2026) - Calibrated Choice Probabilities for Selective Presentation',
        formula: '\\text{Eligible}(i) = \\mathbf{1}\\Big(P(i \\mid S_u, \\mathcal{C}_u^{(K)}) \\ge \\tau_{\\text{calibrated}}\\Big)',
      },
    },
    {
      id: 4,
      title: 'Stage 4: System 2 Explainability',
      subtitle: 'Selective Gemini 2.5/Flash Micro-Copy',
      icon: <Sparkles className="h-5 w-5 text-amber-400" />,
      badge: 'Strictly Top-3 (80 tokens)',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      description:
        'Instead of generating LLM tokens across all 200 items (which takes 14.8 seconds and 76,000 tokens), System 2 selectively synthesizes punchy 1-sentence "Why for you" hooks strictly on the top-3 ranked items, minimizing token cost by 98%.',
      technicalDetails: {
        inputs: 'Top-3 Items + User Intent Description + Decision State Summary',
        outputs: 'One punchy, persuasive sentence explaining the technical or thematic match',
        algorithm: 'Gemini 2.5/Flash (gemini-3.8-flash) targeted inference with low temperature',
        paperCitation: 'Hybrid System 1 (Choice Model) + System 2 (Generative LLM) RecSys Paradigm',
        formula: '\\text{TokenCost} = 3 \\times 40\\text{ tokens} = 120\\text{ tokens} \\quad (\\ll 76,000\\text{ tokens})',
      },
    },
  ];

  const current = stages.find((s) => s.id === selectedStage) || stages[1];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white">Interactive RecFlow 4-Stage Architecture</h3>
        <p className="text-xs text-slate-400 mt-1">
          Click any stage below to inspect input/output schemas, latency constraints, and mathematical formulations.
        </p>
      </div>

      {/* Pipeline Diagram Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, idx) => {
          const isSelected = stage.id === selectedStage;
          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`relative cursor-pointer rounded-xl border p-5 transition-all ${
                isSelected
                  ? 'border-emerald-500/60 bg-slate-900 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Connector arrow on desktop */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-800/80">{stage.icon}</div>
                <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold border ${stage.badgeColor}`}>
                  {stage.badge}
                </span>
              </div>

              <div className="font-mono text-xs text-slate-500">Stage 0{stage.id}</div>
              <h4 className="font-semibold text-sm text-white mt-0.5">{stage.title.split(': ')[1]}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{stage.subtitle}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className={isSelected ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  {isSelected ? 'Active Inspector' : 'Click to inspect'}
                </span>
                <ChevronRight className={`h-4 w-4 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Inspection Drawer for Selected Stage */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">{current.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">{current.title}</h4>
                <span className={`rounded px-2 py-0.5 font-mono text-xs font-semibold border ${current.badgeColor}`}>
                  {current.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
            </div>
          </div>
          <div className="font-mono text-xs text-slate-400">
            Source:{' '}
            <span className="text-slate-300 font-semibold">
              {current.id === 1 ? 'Gorse Engine' : current.id === 4 ? 'Gemini 2.5' : 'Jev System 1'}
            </span>
          </div>
        </div>

        <div className="text-sm text-slate-300 leading-relaxed">
          <LatexText>{current.description}</LatexText>
        </div>

        {/* Concise Technical Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Data Flow</span>
            <p className="text-slate-300 font-medium">{current.technicalDetails.inputs.split('+')[0]}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Serving Protocol</span>
            <p className="text-emerald-300 font-medium">{current.technicalDetails.algorithm}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Academic Foundation</span>
            <p className="text-slate-300 font-medium">{current.technicalDetails.paperCitation.split(':')[0]}</p>
          </div>
        </div>

        {/* Formula Box - Formatted LaTeX */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/90 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-semibold text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5" />
              <span>Mathematical Formulation (LaTeX)</span>
            </div>
            <span className="text-slate-500 text-[10px]">KaTeX Engine</span>
          </div>
          <div className="py-3 px-4 rounded-lg bg-slate-900/90 border border-slate-800/80 overflow-x-auto text-emerald-300 flex items-center justify-center min-h-[58px]">
            <Latex display={true} math={current.technicalDetails.formula} className="text-base text-emerald-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
