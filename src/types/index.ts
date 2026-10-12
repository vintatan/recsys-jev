/**
 * Type Definitions for recsys-jev
 */

export interface Item {
  ItemId: string;
  Domain: 'gitrec' | 'movies' | 'games' | 'books';
  Title: string;
  Subtitle: string;
  Categories: string[];
  Tags: string[];
  Features: Record<string, any>;
  PopularityScore: number;
  Vector?: number[];
  ImageUrl?: string;
}

export interface User {
  UserId: string;
  Domain: 'gitrec' | 'movies' | 'games' | 'books';
  Name: string;
  Role: string;
  AvatarUrl?: string;
  DecisionStateDescription: string;
  History: string[];
  NegativeSignals: string[];
  Preferences: Record<string, any>;
}

export interface FeedbackEvent {
  FeedbackType: 'star' | 'click' | 'read' | 'like' | 'skip';
  UserId: string;
  ItemId: string;
  Timestamp: string;
}

export interface ClusterNode {
  node_id: string;
  role: 'Master' | 'Server' | 'Vector Worker' | 'Jev Gateway';
  status: 'Healthy' | 'Degraded' | 'Offline';
  ip: string;
  cpu_percent: number;
  memory_mb: number;
  qps: number;
  p99_latency_ms: number;
}

export interface ClusterStatus {
  cluster_id: string;
  uptime_seconds: number;
  active_nodes: ClusterNode[];
  database_status: {
    redis_hot_cache: string;
    postgres_cold_storage: string;
    vector_index: string;
  };
  total_feedback_events: number;
  cache_hit_rate: number;
  system1_throughput_rps: number;
}

export interface WhySuggestedDetail {
  headline: string;
  rationale: string;
  sourceTrigger?: string;
  affinityFactors: string[];
  confidencePercent: number;
}

export interface RecommendItemResult {
  item_id: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  confidence_score: number;
  candidate_source: string;
  rank: number;
  imageUrl?: string;
  explainability?: string | null;
  why_suggested?: WhySuggestedDetail;
}

export interface RecommendResponse {
  user_id: string;
  domain: string;
  reranker_model: string;
  candidate_size_k: number;
  retrieval_latency_ms: number;
  reranking_latency_ms: number;
  explainability_latency_ms: number;
  total_latency_ms: number;
  items: RecommendItemResult[];
  pipeline_telemetry: {
    reranker: Record<string, any>;
    candidates_retrieved: number;
    top_confidence: number;
    system1_model: string;
    system2_model: string;
  };
}

export interface BenchmarkRow {
  modelName: string;
  modelType: string;
  latencyK50: number; // ms
  latencyK200: number; // ms
  ndcgGitrec: number;
  ndcgMovies: number;
  ndcgGames: number;
  ndcgBooks: number;
  hitRate10: number;
  mrr: number;
  paretoFrontier: boolean;
}
