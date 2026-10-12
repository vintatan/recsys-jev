import React from 'react';
import { X, Database, Zap, Sparkles, BookOpen, Layers, CheckCircle2, Cpu, ArrowRight } from 'lucide-react';
import { Latex, LatexText } from './Latex';

interface CandidateSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSource?: string;
}

export const CandidateSourcesModal: React.FC<CandidateSourcesModalProps> = ({
  isOpen,
  onClose,
  initialSource,
}) => {
  if (!isOpen) return null;

  const candidateSources = [
    {
      id: 'collaborative_filtering',
      name: 'Collaborative Filtering (CF)',
      shortBadge: 'CF Stream',
      color: 'emerald',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      formula: '\\text{TopK}_{\\text{CF}}(u) = \\arg\\max_{i \\in \\mathcal{I} \\setminus \\mathcal{H}_u}^{(K_{\\text{CF}})} \\Big(\\mathbf{p}_u^\\top \\mathbf{q}_i + b_i\\Big)',
      whatItMeans:
        'Discovers items by analyzing collective behavioral interaction matrices (stars, clicks, bookmarks, ratings) via Bayesian Personalized Ranking (BPR with 64 latent factors).',
      whyNeeded:
        'Captures tacit community taste patterns and serendipitous associations that cannot be discovered from textual descriptions alone.',
    },
    {
      id: 'vector_similarity',
      name: 'Vector Semantic Similarity (Vec)',
      shortBadge: 'Vec Stream',
      color: 'indigo',
      borderColor: 'border-indigo-500/40',
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-400',
      formula: '\\text{TopK}_{\\text{Vec}}(u) = \\arg\\max_{i \\in \\mathcal{I}}^{(K_{\\text{Vec}})} \\cos(\\mathbf{e}_u, \\mathbf{e}_i) = \\frac{\\mathbf{e}_u \\cdot \\mathbf{e}_i}{\\|\\mathbf{e}_u\\|_2 \\|\\mathbf{e}_i\\|_2}',
      whatItMeans:
        'Projects both user decision persona history and catalog item descriptions into high-dimensional semantic vector space (1536-dim embeddings), queried via IVF1024-PQ32 index.',
      whyNeeded:
        'Bridges vocabulary gaps and semantic similarity, allowing relevant items to be found even when items have never been co-interacted before.',
    },
    {
      id: 'popular_trending',
      name: 'Popularity & Trending Stream (Pop)',
      shortBadge: 'Pop Stream',
      color: 'amber',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      formula: '\\text{TopK}_{\\text{Pop}} = \\arg\\max_{i \\in \\mathcal{I}}^{(K_{\\text{Pop}})} \\sum_{v \\in \\mathcal{U}} \\omega(v, i) \\cdot \\exp\\left(-\\frac{\\ln 2}{t_{1/2}} (t_{\\text{now}} - t_{v, i})\\right)',
      whatItMeans:
        'Calculates global interaction velocity within sliding recency windows with exponential half-life decay time weighting.',
      whyNeeded:
        'Ensures viral community momentum and universally acclaimed catalog titles are not starved out of the initial candidate pool.',
    },
    {
      id: 'fresh_feed',
      name: 'Freshness & Latest Feed (Fresh)',
      shortBadge: 'Fresh Stream',
      color: 'cyan',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
      formula: '\\text{TopK}_{\\text{Fresh}} = \\arg\\max_{i \\in \\mathcal{I}}^{(K_{\\text{Fresh}})} \\text{Timestamp}(i)',
      whatItMeans:
        'Event-driven chronological ingest stream streaming newly released repositories, films, books, or game titles directly into Redis hot cache.',
      whyNeeded:
        'Eliminates offline batch training lag; brand new items enter recommendation consideration within milliseconds of release.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Candidate Sources &amp; Mathematical Formulation
              </h3>
              <p className="text-xs text-slate-400">
                Multi-Source Candidate Generation and Decision-Oriented Choice Theory in RecFlow &amp; Jev
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Executive Overview: What are candidate sources talking about? */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="h-4 w-4" />
              <span>What are Candidate Sources Talking About?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In modern production recommender systems (such as Gorse RecFlow), the total item catalog contains hundreds of thousands or millions of items (<Latex math="|\mathcal{I}| \gg 10^5" />). It is computationally impossible to score every single item through an advanced reranker like Jev System 1 while honoring strict real-time SLA limits (<Latex math="\text{Latency} < 900\text{ms}" />).
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Therefore, <strong>Stage 1 (Candidate Generation)</strong> deploys 4 decoupled, parallel retrieval channels (sources). Each channel specializes in a distinct mathematical retrieval objective, and their results are combined via a set union into an over-complete candidate choice slate <Latex math="\mathcal{C}_u^{(K)}" />:
            </p>

            {/* LaTeX Slate Union Formula */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 shadow-inner">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Candidate Slate Union Formula:
              </div>
              <Latex
                display={true}
                math="\mathcal{C}_u^{(K)} = \bigcup_{s \in \mathcal{S}} \text{TopK}_{s}(u) = \text{TopK}_{\text{CF}}(u) \cup \text{TopK}_{\text{Vec}}(u) \cup \text{TopK}_{\text{Pop}} \cup \text{TopK}_{\text{Fresh}}"
                className="text-emerald-300 py-1"
              />
              <div className="text-[11px] font-mono text-slate-500 text-center mt-1">
                where candidate pool size <Latex math="K = |\mathcal{C}_u^{(K)}| \in [20, 200]" />
              </div>
            </div>
          </div>

          {/* Breakdown of the 4 Candidate Sources */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              The 4 Parallel Candidate Channels
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidateSources.map((source) => (
                <div
                  key={source.id}
                  className={`rounded-xl border p-4.5 bg-slate-950/60 transition-all ${
                    initialSource && initialSource.toLowerCase().includes(source.id.split('_')[0])
                      ? `${source.borderColor} ${source.bgColor} ring-1 ring-emerald-500/40`
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${source.borderColor} ${source.bgColor} ${source.textColor}`}>
                      {source.shortBadge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Gorse Stage 1</span>
                  </div>

                  <h5 className="font-bold text-sm text-white mb-2">{source.name}</h5>

                  {/* Rendered LaTeX Formula */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 my-2 text-center overflow-x-auto">
                    <Latex display={true} math={source.formula} className={`${source.textColor} text-xs`} />
                  </div>

                  <div className="space-y-2 mt-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">How it works:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{source.whatItMeans}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Why it is critical:</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{source.whyNeeded}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reranking & Decision Model Formulations */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                <span className="text-indigo-300 font-bold text-xs uppercase block">
                  1. Continuous Decision State Formulation
                </span>
                <Latex
                  display={true}
                  math="S_u = f_\theta(\mathcal{H}_u) = \left[\mathbf{z}_{\text{latent}}, \mathbf{v}_{\text{preferred}}, \mathbf{w}_{\text{negative}}\right] \in \mathbb{R}^d"
                  className="text-indigo-200 text-xs py-1"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Encodes user interaction history <Latex math="\mathcal{H}_u" /> into a continuous latent decision trajectory capturing semantic affinity and explicit negative signals.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                <span className="text-emerald-300 font-bold text-xs uppercase block">
                  2. Calibrated Multinomial Choice Probability
                </span>
                <Latex
                  display={true}
                  math="P(i \mid S_u, \mathcal{C}_u^{(K)}) = \frac{\exp\big(U(i, S_u)/\tau\big)}{\sum_{j \in \mathcal{C}_u^{(K)}} \exp\big(U(j, S_u)/\tau\big)}"
                  className="text-emerald-300 text-xs py-1"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Evaluates utility <Latex math="U(i, S_u)" /> over candidate choice alternatives <Latex math="\mathcal{C}_u^{(K)}" /> using isotropic softmax with flat latency (<Latex math="<900\text{ms}" />).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                <span className="text-cyan-300 font-bold text-xs uppercase block">
                  3. Calibrated Confidence Gating Cutoff
                </span>
                <Latex
                  display={true}
                  math="\text{Eligible}(i) = \mathbf{1}\Big(P(i \mid S_u, \mathcal{C}_u^{(K)}) \ge \tau_{\text{calibrated}}\Big)"
                  className="text-cyan-300 text-xs py-1"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Filters candidates through certainty threshold <Latex math="\tau \ge 0.85" /> to suppress speculative noise when entropy is high.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                <span className="text-amber-300 font-bold text-xs uppercase block">
                  4. Top-5 Slate Selection &amp; Gemini Explainability
                </span>
                <Latex
                  display={true}
                  math="\text{Slate}_u = \text{Top-5}\big(\{i \mid \text{Eligible}(i)\}\big), \quad \text{Cost} = \mathcal{O}(3 \times T_\mu)"
                  className="text-amber-300 text-xs py-1"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Selects Top-5 items for display and selectively invokes Gemini 2.5 Flash strictly on Top-3 items for persuasive 1-sentence explanations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-950 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Formulations grounded in Gorse RecFlow (Apache 2.0) &amp; Decision-Oriented Choice Theory
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
