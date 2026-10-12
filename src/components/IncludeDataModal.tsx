import React, { useState, useEffect } from 'react';
import {
  X,
  UploadCloud,
  Database,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Copy,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  UserCheck,
  FileText,
  BarChart3,
  Zap,
  Info,
  Clock,
  Send,
  Download,
  Flame,
} from 'lucide-react';
import { User, FeedbackEvent } from '../types';
import { Latex } from './Latex';

interface IncludeDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataIngested: (newUserId?: string) => void;
}

export const IncludeDataModal: React.FC<IncludeDataModalProps> = ({
  isOpen,
  onClose,
  onDataIngested,
}) => {
  const [activeTab, setActiveTab] = useState<'guided' | 'paste' | 'evaluate'>('guided');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Stats from server
  const [datasetStats, setDatasetStats] = useState<{
    userCount: number;
    itemCount: number;
    feedbackCount: number;
    isCustomDataActive: boolean;
    cfEdges: number;
    backendCapabilities: Array<{ name: string; status: string; detail: string }>;
    recentTasks: Array<{ id: string; timestamp: string; action: string; detail: string }>;
  }>({
    userCount: 8,
    itemCount: 42,
    feedbackCount: 5,
    isCustomDataActive: false,
    cfEdges: 12,
    backendCapabilities: [],
    recentTasks: [],
  });

  // Backend Live Evaluation State
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [candidateK, setCandidateK] = useState<number>(50);

  // Guided Form State
  const [userId, setUserId] = useState('usr_custom_engineer');
  const [domain, setDomain] = useState<'gitrec' | 'movies' | 'games' | 'books'>('gitrec');
  const [name, setName] = useState('Alex (Staff ML Systems Engineer)');
  const [role, setRole] = useState('Principal Distributed Systems Architect');
  const [decisionStateDesc, setDecisionStateDesc] = useState(
    'Specializing in low-latency LLM inference engines, vector retrieval indexing, and Rust/Go concurrency systems.'
  );
  const [historyItems, setHistoryItems] = useState('vllm-project/vllm, astral-sh/uv, facebookresearch/faiss');
  const [negativeSignals, setNegativeSignals] = useState('low-code-tools, legacy-jquery');
  const [preferencesStr, setPreferencesStr] = useState('Python, Rust, CUDA, C++');

  // Paste / JSON / CSV state
  const [importFormat, setImportFormat] = useState<'persona_json' | 'feedback_json' | 'feedback_csv'>('persona_json');
  const [rawInputText, setRawInputText] = useState('');
  const [copiedSample, setCopiedSample] = useState(false);

  // Fetch current dataset stats
  const fetchDatasetStats = async () => {
    try {
      const res = await fetch('/api/dataset/status');
      if (res.ok) {
        const data = await res.json();
        setDatasetStats({
          userCount: data.user_count,
          itemCount: data.item_count,
          feedbackCount: data.feedback_count,
          isCustomDataActive: data.is_custom_data_active,
          cfEdges: data.active_cf_edges || 0,
          backendCapabilities: data.backend_capabilities || [],
          recentTasks: data.recent_tasks || [],
        });
      }
    } catch (e) {
      console.warn('Failed to fetch dataset status:', e);
    }
  };

  const handleRunBackendEvaluation = async () => {
    setEvaluating(true);
    try {
      const res = await fetch('/api/dataset/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_size_k: candidateK }),
      });
      if (res.ok) {
        const data = await res.json();
        setEvaluationResult(data);
        await fetchDatasetStats();
      }
    } catch (e) {
      console.error('Failed to run live evaluation:', e);
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDatasetStats();
      setStatusMessage(null);
    }
  }, [isOpen]);

  // Real Dataset Presets
  const handleLoadPreset = (preset: 'mlinfra' | 'scifi' | 'gamer' | 'distributed') => {
    if (preset === 'mlinfra') {
      setUserId('usr_marcus_mlinfra');
      setDomain('gitrec');
      setName('Marcus (Inference & Kernel Dev)');
      setRole('Lead GPU Systems Engineer');
      setDecisionStateDesc('Looking for high-throughput Triton kernels, PagedAttention optimizations, and distributed inference.');
      setHistoryItems('vllm-project/vllm, huggingface/transformers, ollama/ollama');
      setNegativeSignals('web-frameworks, css-libraries');
      setPreferencesStr('CUDA, Triton, PyTorch, C++');
    } else if (preset === 'scifi') {
      setUserId('usr_clara_cinephile');
      setDomain('movies');
      setName('Clara (Hard Sci-Fi & Speculative Cinema)');
      setRole('Narrative Designer & Film Historian');
      setDecisionStateDesc('Prioritizing ontological hard science-fiction, cosmic mystery, and atmospheric sound design.');
      setHistoryItems('mov-inception, mov-interstellar, mov-arrival');
      setNegativeSignals('jump-scare-horror, romantic-slapstick');
      setPreferencesStr('Denis Villeneuve, Christopher Nolan, Ridley Scott');
    } else if (preset === 'gamer') {
      setUserId('usr_zack_actionrpg');
      setDomain('games');
      setName('Zack (Soulslike & Action Mastery)');
      setRole('Competitive Speedrunner & Streamer');
      setDecisionStateDesc('Evaluating demanding combat mechanics, intricate build diversity, and rich environmental storytelling.');
      setHistoryItems('game-eldenring, game-armoredcore6, game-blackmyth');
      setNegativeSignals('pay-to-win, auto-battlers');
      setPreferencesStr('FromSoftware, Action RPG, Hardcore Combat');
    } else if (preset === 'distributed') {
      setUserId('usr_nora_storage');
      setDomain('books');
      setName('Nora (Consensus & Storage Systems)');
      setRole('Senior Distributed Systems Researcher');
      setDecisionStateDesc('Researching Raft/Paxos consensus, LSM-tree compaction, and distributed transaction protocols.');
      setHistoryItems('book-ddia, book-mlsys');
      setNegativeSignals('pop-psychology, self-help');
      setPreferencesStr('Distributed Systems, Storage Engines, Hard Sci-Fi');
    }
  };

  // Sample templates for Paste tab
  const samplePersonaJson = JSON.stringify(
    {
      UserId: 'usr_sarah_ai',
      Domain: 'gitrec',
      Name: 'Sarah (Distributed AI Engineer)',
      Role: 'Principal Systems Architect',
      DecisionStateDescription: 'Architecting vector search backends, high-performance web frameworks, and local LLM runners.',
      History: ['qdrant/qdrant', 'ollama/ollama'],
      NegativeSignals: ['legacy-jquery'],
      Preferences: {
        languages: ['Rust', 'Python', 'TypeScript'],
        min_stars: 10000,
      },
    },
    null,
    2
  );

  const sampleFeedbackJson = JSON.stringify(
    [
      {
        UserId: 'usr_custom_engineer',
        ItemId: 'vllm-project/vllm',
        FeedbackType: 'star',
        Timestamp: new Date().toISOString(),
      },
      {
        UserId: 'usr_custom_engineer',
        ItemId: 'facebookresearch/faiss',
        FeedbackType: 'like',
        Timestamp: new Date().toISOString(),
      },
    ],
    null,
    2
  );

  const sampleFeedbackCsv = `UserId,ItemId,FeedbackType,Timestamp
usr_custom_engineer,vllm-project/vllm,star,2026-10-09T08:00:00Z
usr_custom_engineer,facebookresearch/faiss,read,2026-10-09T08:05:00Z
usr_custom_engineer,ollama/ollama,like,2026-10-09T08:10:00Z`;

  const handleCopySample = (sample: string) => {
    navigator.clipboard.writeText(sample);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  // Submit Guided Form
  const handleSaveGuidedUser = async () => {
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const historyList = historyItems
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const negList = negativeSignals
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const prefTags = preferencesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        UserId: userId.trim(),
        Domain: domain,
        Name: name.trim(),
        Role: role.trim(),
        DecisionStateDescription: decisionStateDesc.trim(),
        History: historyList,
        NegativeSignals: negList,
        Preferences: { tags: prefTags, languages: prefTags },
      };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to register user persona.');
      }

      await fetchDatasetStats();
      setStatusMessage({
        type: 'success',
        text: `User persona "${payload.Name}" successfully included in active session! Ready for recommendation evaluation.`,
      });

      // Also trigger optional feedback events if history provided
      if (historyList.length > 0) {
        const feedbackPayload = historyList.map((item) => ({
          UserId: payload.UserId,
          ItemId: item,
          FeedbackType: 'star',
          Timestamp: new Date().toISOString(),
        }));
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackPayload),
        });
      }

      setTimeout(() => {
        onDataIngested(payload.UserId);
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving user.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Raw Paste (JSON / CSV)
  const handleSaveRawData = async () => {
    if (!rawInputText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste or upload JSON/CSV data first.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (importFormat === 'persona_json') {
        const parsed = JSON.parse(rawInputText);
        const usersArray = Array.isArray(parsed) ? parsed : [parsed];
        const res = await fetch('/api/dataset/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: usersArray }),
        });
        if (!res.ok) throw new Error('Failed to import user JSON.');
        await fetchDatasetStats();
        setStatusMessage({
          type: 'success',
          text: `Successfully ingested ${usersArray.length} user persona(s)!`,
        });
        setTimeout(() => {
          onDataIngested(usersArray[0]?.UserId);
          onClose();
        }, 1000);
      } else if (importFormat === 'feedback_json') {
        const parsed = JSON.parse(rawInputText);
        const feedbackArray = Array.isArray(parsed) ? parsed : [parsed];
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackArray),
        });
        if (!res.ok) throw new Error('Failed to import feedback JSON.');
        await fetchDatasetStats();
        setStatusMessage({
          type: 'success',
          text: `Successfully injected ${feedbackArray.length} feedback interaction(s)!`,
        });
        setTimeout(() => {
          onDataIngested(feedbackArray[0]?.UserId);
          onClose();
        }, 1000);
      } else if (importFormat === 'feedback_csv') {
        // Parse CSV lines
        const lines = rawInputText.trim().split('\n');
        const feedbackArray: Array<{ UserId: string; ItemId: string; FeedbackType: string; Timestamp: string }> = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map((p) => p.trim());
          if (parts.length >= 2 && parts[0] && parts[1]) {
            feedbackArray.push({
              UserId: parts[0],
              ItemId: parts[1],
              FeedbackType: parts[2] || 'star',
              Timestamp: parts[3] || new Date().toISOString(),
            });
          }
        }
        if (feedbackArray.length === 0) {
          throw new Error('No valid rows found in CSV. Expected header: UserId,ItemId,FeedbackType,Timestamp');
        }
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackArray),
        });
        if (!res.ok) throw new Error('Failed to ingest CSV feedback.');
        await fetchDatasetStats();
        setStatusMessage({
          type: 'success',
          text: `Successfully parsed and ingested ${feedbackArray.length} interaction rows from CSV!`,
        });
        setTimeout(() => {
          onDataIngested(feedbackArray[0]?.UserId);
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Invalid format.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to Baseline Amazon & GitRec Benchmarks
  const handleResetToBaseline = async () => {
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/dataset/reset', { method: 'POST' });
      if (res.ok) {
        await fetchDatasetStats();
        setStatusMessage({
          type: 'success',
          text: 'Dataset successfully reset to pristine Amazon Reviews 2023 & GitHub GitRec benchmark baselines!',
        });
        onDataIngested('usr_bob_gitrec');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Reset failed: ' + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 p-5 sm:p-6 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-indigo-500/20 border border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-950">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Include Your Real Data
                </h3>
                <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                  Live Engine Ingestion
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Input your user persona, interaction signals, or candidate catalog, run the Jev System 1 pipeline, and evaluate against benchmarks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Prominent Lifecycle & "When Does It Reset?" Callout Card */}
        <div className="px-5 sm:px-6 pt-4 pb-2">
          <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-emerald-950/30 p-3.5 sm:p-4 text-xs font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <Clock className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>When Does Your Data Reset?</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Active Registry:</span>
                <span className="rounded bg-slate-950 px-2 py-0.5 text-[11px] text-emerald-400 font-bold border border-slate-800">
                  {datasetStats.userCount} Users &middot; {datasetStats.itemCount} Items &middot; {datasetStats.feedbackCount} Signals
                </span>
                {datasetStats.isCustomDataActive && (
                  <button
                    onClick={handleResetToBaseline}
                    disabled={isSubmitting}
                    className="flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] text-rose-300 hover:bg-rose-500/20 transition-colors"
                    title="Revert back to default Amazon 2023 & GitRec baseline benchmarks"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Baseline</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300 font-sans">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Active Session:</strong> Data you input is stored in server memory and ready immediately for all recommendation runs.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Server Restarts:</strong> In-memory state resets when the dev server or cloud container restarts or redeploys.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <RotateCcw className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Manual Reset:</strong> Click &ldquo;Reset Baseline&rdquo; anytime to restore original Amazon &amp; GitRec benchmarks.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-6 pt-2 flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('guided')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'guided'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Interactive Guided Form</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'paste'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Paste / Upload (JSON &amp; CSV)</span>
          </button>
          <button
            onClick={() => setActiveTab('evaluate')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'evaluate'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Pipeline &amp; Benchmark Evaluation</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-mono ${
                statusMessage.type === 'success'
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : 'border-rose-500/40 bg-rose-950/40 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: GUIDED FORM */}
          {activeTab === 'guided' && (
            <div className="space-y-4">
              {/* Preset Selector */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">
                  1-Click Real-World User Presets (or fill custom fields below):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('mlinfra')}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all group"
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-emerald-300">
                      💻 GPU ML Infra
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">Triton, vLLM, CUDA</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('scifi')}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all group"
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-emerald-300">
                      🎬 Sci-Fi Critic
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">Nolan, Villeneuve</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('gamer')}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all group"
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-emerald-300">
                      🎮 RPG Speedrunner
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">Elden Ring, BG3</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('distributed')}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all group"
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-emerald-300">
                      📚 Systems Author
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">DDIA, Raft, LSM</div>
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 flex items-center justify-between">
                    <span>User ID (Unique identifier)</span>
                    <span className="text-[10px] text-slate-400 font-sans">e.g. usr_alex_dev</span>
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300">Benchmark Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="gitrec">GitHub Repositories (gitrec)</option>
                    <option value="movies">Amazon Movies 2023 (movies)</option>
                    <option value="games">Amazon Video Games 2023 (games)</option>
                    <option value="books">Amazon Books 2023 (books)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300">Persona Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300">Professional Role / Title</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-slate-300 flex items-center justify-between">
                    <span>Decision State Focus (<Latex math="S_u" /> Trajectory Description)</span>
                    <span className="text-[10px] text-emerald-400 font-sans">Used by Jev System 1 Reranker</span>
                  </label>
                  <textarea
                    rows={2}
                    value={decisionStateDesc}
                    onChange={(e) => setDecisionStateDesc(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300">Past Interacted Items (Comma-separated)</label>
                  <input
                    type="text"
                    value={historyItems}
                    onChange={(e) => setHistoryItems(e.target.value)}
                    placeholder="vllm-project/vllm, astral-sh/uv"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300">Negative Signals (Disliked items/tags)</label>
                  <input
                    type="text"
                    value={negativeSignals}
                    onChange={(e) => setNegativeSignals(e.target.value)}
                    placeholder="low-code-tools, legacy-jquery"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-slate-300">Domain Preferences / Preferred Tags</label>
                  <input
                    type="text"
                    value={preferencesStr}
                    onChange={(e) => setPreferencesStr(e.target.value)}
                    placeholder="Python, Rust, Distributed Systems, CUDA"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  Data will be added to the live engine registry and selectable in the Playground.
                </div>
                <button
                  type="button"
                  onClick={handleSaveGuidedUser}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/50 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Include User &amp; Run Pipeline</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE / UPLOAD (JSON & CSV) */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Format:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setImportFormat('persona_json');
                      setRawInputText(samplePersonaJson);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
                      importFormat === 'persona_json'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    User Persona JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportFormat('feedback_json');
                      setRawInputText(sampleFeedbackJson);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
                      importFormat === 'feedback_json'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    Feedback JSON (Gorse)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportFormat('feedback_csv');
                      setRawInputText(sampleFeedbackCsv);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
                      importFormat === 'feedback_csv'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    Interactions CSV
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sample =
                        importFormat === 'persona_json'
                          ? samplePersonaJson
                          : importFormat === 'feedback_json'
                          ? sampleFeedbackJson
                          : sampleFeedbackCsv;
                      handleCopySample(sample);
                    }}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copiedSample ? 'Copied!' : 'Copy Sample'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const sample =
                        importFormat === 'persona_json'
                          ? samplePersonaJson
                          : importFormat === 'feedback_json'
                          ? sampleFeedbackJson
                          : sampleFeedbackCsv;
                      setRawInputText(sample);
                    }}
                    className="flex items-center gap-1 rounded bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-1 text-xs text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Load Template</span>
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  rows={9}
                  value={rawInputText}
                  onChange={(e) => setRawInputText(e.target.value)}
                  placeholder={
                    importFormat === 'feedback_csv'
                      ? 'UserId,ItemId,FeedbackType,Timestamp\nusr_demo,vllm-project/vllm,star,2026-10-09T08:00:00Z'
                      : 'Paste valid JSON array or object here...'
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  Matches standard Gorse Recommender REST schema (<span className="text-emerald-400">/api/feedback</span> and <span className="text-emerald-400">/api/users</span>).
                </div>
                <button
                  type="button"
                  onClick={handleSaveRawData}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Ingest &amp; Run Pipeline</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PIPELINE & BENCHMARKS EVALUATION */}
          {activeTab === 'evaluate' && (
            <div className="space-y-5">
              {/* Active Backend Capabilities Overview */}
              <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-teal-950/20 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white">Active Backend Pipeline Capabilities:</h4>
                  </div>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    Live Server Engine · {datasetStats.cfEdges} CF Co-occurrence Edges Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">STAGE 1: GRAPH & CF</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="font-semibold text-white text-xs">Dynamic Collaborative Filtering</div>
                    <p className="text-[11px] text-slate-400">
                      Instantly rebuilds item-item co-occurrence bipartite graph when any feedback is ingested ({datasetStats.cfEdges} active edges).
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">STAGE 2: EMBEDDINGS</span>
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    </div>
                    <div className="font-semibold text-white text-xs">State Trajectory Encoder (<Latex math="S_u" />)</div>
                    <p className="text-[11px] text-slate-400">
                      Calculates normalized 4-dim trajectory vectors from user interaction recency, facet tags, and negative signals.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold">STAGE 3: RETRIEVAL</span>
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                    </div>
                    <div className="font-semibold text-white text-xs">4-Stream Multi-Source Fan-out</div>
                    <p className="text-[11px] text-slate-400">
                      Blends Vector Cosine, CF bipartite graph, Trending interaction stream, and Catalog Freshness.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">STAGE 4: EVALUATION</span>
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                    </div>
                    <div className="font-semibold text-white text-xs">Live Holdout Benchmark Runner</div>
                    <p className="text-[11px] text-slate-400">
                      Executes empirical leave-one-out ranking evaluation comparing Jev vs Pointwise LLMs directly on active data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Live Benchmark Runner Card */}
              <div className="rounded-xl border border-indigo-500/30 bg-slate-950 p-4 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-indigo-400" />
                      <span>Live Backend Benchmark Evaluation on Ingested Data</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Runs an automated holdout ranking evaluation across all {datasetStats.userCount} personas and {datasetStats.itemCount} items currently in session memory.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Slate K:</span>
                    <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5 text-xs font-mono">
                      {[20, 50, 100, 200].map((kVal) => (
                        <button
                          key={kVal}
                          type="button"
                          onClick={() => setCandidateK(kVal)}
                          className={`px-2 py-0.5 rounded transition-all ${
                            candidateK === kVal
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {kVal}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleRunBackendEvaluation}
                      disabled={evaluating}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all disabled:opacity-50"
                    >
                      {evaluating ? (
                        <>
                          <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                          <span>Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Run Live Evaluation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* If evaluation has been executed, show live computed metrics */}
                {evaluationResult && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>
                          Evaluation completed in <strong>{evaluationResult.evaluation_time_ms}ms</strong> across{' '}
                          <strong>{evaluationResult.num_users_evaluated}</strong> active user personas with candidate slate K={evaluationResult.candidate_size_k}.
                        </span>
                      </div>
                      <span className="text-slate-400">
                        {new Date(evaluationResult.evaluated_at).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-slate-800">
                      <table className="w-full font-mono text-xs text-left">
                        <thead className="text-[10px] text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3">Architecture</th>
                            <th className="py-2.5 px-3">Hit Rate @ 10</th>
                            <th className="py-2.5 px-3">NDCG @ 10</th>
                            <th className="py-2.5 px-3">MRR</th>
                            <th className="py-2.5 px-3">Latency (ms)</th>
                            <th className="py-2.5 px-3">Runtime Complexity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-[11px]">
                          <tr className="bg-emerald-950/30 text-emerald-300 font-semibold">
                            <td className="py-2.5 px-3 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>{evaluationResult.models.jev_system1.name}</span>
                            </td>
                            <td className="py-2.5 px-3 text-emerald-400">
                              {(evaluationResult.models.jev_system1.hitRate10 * 100).toFixed(1)}%
                            </td>
                            <td className="py-2.5 px-3 text-emerald-400 font-bold">
                              {evaluationResult.models.jev_system1.ndcg10.toFixed(3)}
                            </td>
                            <td className="py-2.5 px-3">
                              {evaluationResult.models.jev_system1.mrr.toFixed(3)}
                            </td>
                            <td className="py-2.5 px-3 text-emerald-300">
                              {evaluationResult.models.jev_system1.latencyMs} ms
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">
                              {evaluationResult.models.jev_system1.scaling_profile}
                            </td>
                          </tr>
                          <tr className="text-slate-300">
                            <td className="py-2.5 px-3">{evaluationResult.models.pointwise_llm.name}</td>
                            <td className="py-2.5 px-3">
                              {(evaluationResult.models.pointwise_llm.hitRate10 * 100).toFixed(1)}%
                            </td>
                            <td className="py-2.5 px-3">
                              {evaluationResult.models.pointwise_llm.ndcg10.toFixed(3)}
                            </td>
                            <td className="py-2.5 px-3">
                              {evaluationResult.models.pointwise_llm.mrr.toFixed(3)}
                            </td>
                            <td className="py-2.5 px-3 text-rose-400 font-medium">
                              {evaluationResult.models.pointwise_llm.latencyMs} ms
                            </td>
                            <td className="py-2.5 px-3 text-rose-400">
                              {evaluationResult.models.pointwise_llm.scaling_profile}
                            </td>
                          </tr>
                          <tr className="text-slate-400">
                            <td className="py-2.5 px-3">{evaluationResult.models.popularity_baseline.name}</td>
                            <td className="py-2.5 px-3">
                              {(evaluationResult.models.popularity_baseline.hitRate10 * 100).toFixed(1)}%
                            </td>
                            <td className="py-2.5 px-3">
                              {evaluationResult.models.popularity_baseline.ndcg10.toFixed(3)}
                            </td>
                            <td className="py-2.5 px-3">
                              {evaluationResult.models.popularity_baseline.mrr.toFixed(3)}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">
                              {evaluationResult.models.popularity_baseline.latencyMs} ms
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">
                              {evaluationResult.models.popularity_baseline.scaling_profile}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Per-User Ranking Breakdown */}
                    {evaluationResult.user_evaluations && evaluationResult.user_evaluations.length > 0 && (
                      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 space-y-2">
                        <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                          <span>User Persona Holdout Rank Comparison:</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            Rank 1 = Top Recommended (Lower is better)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                          {evaluationResult.user_evaluations.slice(0, 6).map((ur: any) => (
                            <div
                              key={ur.userId}
                              className="rounded border border-slate-800 bg-slate-950 p-2.5 space-y-1.5"
                            >
                              <div className="flex items-center justify-between font-mono">
                                <span className="font-bold text-white truncate text-[11px]">{ur.userName}</span>
                                <span className="text-[10px] text-indigo-400 uppercase">{ur.domain}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                Target: <span className="text-slate-200">{ur.targetTitle || ur.targetItem}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-800">
                                <span className="text-emerald-400 font-bold">
                                  Jev: Rank #{ur.jevRank}
                                </span>
                                <span className="text-slate-400">Pointwise: #{ur.pointRank}</span>
                                <span className="text-slate-500">Pop: #{ur.popRank}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Research Baseline Reference Table */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  <span>Published Decision-Oriented Benchmarks (Table 2 Reference):</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-xs text-left">
                    <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Architecture</th>
                        <th className="py-2 px-3">Latency at K=50</th>
                        <th className="py-2 px-3">Latency at K=200</th>
                        <th className="py-2 px-3">NDCG@10</th>
                        <th className="py-2 px-3">Context Scaling Behavior</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      <tr className="bg-emerald-950/20 text-emerald-300 font-semibold">
                        <td className="py-2 px-3">Jev System 1 (Ours)</td>
                        <td className="py-2 px-3">640 ms</td>
                        <td className="py-2 px-3">&lt;890 ms (Flat)</td>
                        <td className="py-2 px-3">0.612</td>
                        <td className="py-2 px-3 text-emerald-400">Flat sub-900ms scaling with zero context collapse</td>
                      </tr>
                      <tr className="text-slate-300">
                        <td className="py-2 px-3">Pointwise LLM (Qwen 7B)</td>
                        <td className="py-2 px-3">3,810 ms</td>
                        <td className="py-2 px-3 text-rose-400">14,840 ms (Bottleneck)</td>
                        <td className="py-2 px-3">0.548</td>
                        <td className="py-2 px-3 text-slate-400">Exponential token blowup (~74ms/candidate)</td>
                      </tr>
                      <tr className="text-slate-300">
                        <td className="py-2 px-3">Listwise LLM (Qwen 7B)</td>
                        <td className="py-2 px-3">980 ms</td>
                        <td className="py-2 px-3">1,420 ms</td>
                        <td className="py-2 px-3 text-amber-400">0.512</td>
                        <td className="py-2 px-3 text-slate-400">Position collapse &amp; 28.5% NDCG degradation</td>
                      </tr>
                      <tr className="text-slate-300">
                        <td className="py-2 px-3">SASRec Sequential</td>
                        <td className="py-2 px-3">22 ms</td>
                        <td className="py-2 px-3">34 ms</td>
                        <td className="py-2 px-3">0.485</td>
                        <td className="py-2 px-3 text-slate-400">Ultra-fast embeddings, lacks discrete choice reasoning</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Backend Pipeline Audit Tasks Log */}
              {datasetStats.recentTasks && datasetStats.recentTasks.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Recent Backend Pipeline Activity Audit:</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-normal">
                      Live Server In-Memory Log
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px]">
                    {datasetStats.recentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start justify-between gap-3 rounded bg-slate-900/70 p-2 border border-slate-800/80 text-slate-300"
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] text-indigo-300 font-bold uppercase shrink-0">
                            {task.action}
                          </span>
                          <span className="truncate">{task.detail}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {new Date(task.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDataIngested('usr_bob_gitrec');
                  }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/50 transition-all"
                >
                  <Sliders className="h-4 w-4" />
                  <span>Launch Playground with Custom Evaluator</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
