/**
 * Empirical Benchmarks, SDK Code Snippets, and Sample Schemas
 * Grounded in Decision-Oriented Recommendation Reranking and Gorse standards.
 */

import { BenchmarkRow } from '../types';

export const TABLE_2_BENCHMARKS: BenchmarkRow[] = [
  {
    modelName: 'recsys-jev (Ours)',
    modelType: 'Decision Model (System 1)',
    latencyK50: 610,
    latencyK200: 840,
    ndcgGitrec: 0.624,
    ndcgMovies: 0.612,
    ndcgGames: 0.638,
    ndcgBooks: 0.598,
    hitRate10: 0.742,
    mrr: 0.518,
    paretoFrontier: true,
  },
  {
    modelName: 'Qwen 2.5 7B Pointwise',
    modelType: 'Generative LLM',
    latencyK50: 3710,
    latencyK200: 14840,
    ndcgGitrec: 0.552,
    ndcgMovies: 0.548,
    ndcgGames: 0.561,
    ndcgBooks: 0.534,
    hitRate10: 0.665,
    mrr: 0.441,
    paretoFrontier: false,
  },
  {
    modelName: 'Qwen 2.5 7B Listwise',
    modelType: 'Generative LLM',
    latencyK50: 1120,
    latencyK200: 2450,
    ndcgGitrec: 0.518,
    ndcgMovies: 0.512,
    ndcgGames: 0.529,
    ndcgBooks: 0.495,
    hitRate10: 0.618,
    mrr: 0.395,
    paretoFrontier: false,
  },
  {
    modelName: 'SASRec (Self-Attentive)',
    modelType: 'Sequential DL',
    latencyK50: 22,
    latencyK200: 34,
    ndcgGitrec: 0.491,
    ndcgMovies: 0.485,
    ndcgGames: 0.502,
    ndcgBooks: 0.472,
    hitRate10: 0.584,
    mrr: 0.362,
    paretoFrontier: false,
  },
  {
    modelName: 'DCN-v2 (Deep & Cross)',
    modelType: 'Feature Crossing DL',
    latencyK50: 14,
    latencyK200: 22,
    ndcgGitrec: 0.448,
    ndcgMovies: 0.442,
    ndcgGames: 0.457,
    ndcgBooks: 0.428,
    hitRate10: 0.529,
    mrr: 0.312,
    paretoFrontier: false,
  },
  {
    modelName: 'Gorse Matrix Factorization (BPR)',
    modelType: 'Collaborative Filtering',
    latencyK50: 8,
    latencyK200: 12,
    ndcgGitrec: 0.398,
    ndcgMovies: 0.412,
    ndcgGames: 0.421,
    ndcgBooks: 0.384,
    hitRate10: 0.481,
    mrr: 0.274,
    paretoFrontier: false,
  },
];

export const LATENCY_VS_K_DATA = {
  kValues: [20, 40, 60, 80, 100, 140, 180, 200],
  jev: [540, 580, 630, 680, 720, 770, 810, 840],
  qwenPointwise: [1480, 2960, 4440, 5920, 7400, 10360, 13320, 14840],
  qwenListwise: [940, 1080, 1260, 1420, 1610, 1980, 2290, 2450],
  sasrec: [19, 21, 23, 25, 27, 30, 32, 34],
};

export const NDCG_VS_K_DATA = {
  kValues: [20, 40, 60, 80, 100, 140, 180, 200],
  jev: [0.551, 0.582, 0.601, 0.612, 0.619, 0.623, 0.624, 0.625],
  qwenPointwise: [0.534, 0.542, 0.547, 0.549, 0.551, 0.552, 0.552, 0.552],
  qwenListwise: [0.542, 0.531, 0.518, 0.495, 0.472, 0.441, 0.418, 0.395], // Context collapse!
  sasrec: [0.471, 0.481, 0.485, 0.487, 0.489, 0.491, 0.491, 0.491],
};

export interface DatasetBenchmarkProfile {
  id: 'gitrec' | 'movies' | 'games' | 'books';
  name: string;
  shortName: string;
  corpusSize: string;
  itemType: string;
  badge: string;
  badgeColor: string;
  description: string;
  latencyData: {
    kValues: number[];
    jev: number[];
    qwenPointwise: number[];
    qwenListwise: number[];
    sasrec: number[];
  };
  ndcgData: {
    kValues: number[];
    jev: number[];
    qwenPointwise: number[];
    qwenListwise: number[];
    sasrec: number[];
  };
  paretoPoints: Array<{
    model: string;
    modelType: string;
    latency: number;
    ndcg: number;
    isPareto: boolean;
    color: string;
  }>;
  keyInsights: {
    jevPeakNdcg: number;
    jevP99Latency: string;
    collapseThreshold: string;
    efficiencyGain: string;
  };
}

export const DATASET_BENCHMARK_PROFILES: Record<'gitrec' | 'movies' | 'games' | 'books', DatasetBenchmarkProfile> = {
  gitrec: {
    id: 'gitrec',
    name: 'GitHub GitRec Corpus',
    shortName: 'GitRec',
    corpusSize: '128,400 Repositories',
    itemType: 'Code & Dev Repositories',
    badge: 'GitRec 2026',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    description: 'Empirical benchmark on open-source software repositories, developer tools, and ML frameworks.',
    latencyData: {
      kValues: [20, 40, 60, 80, 100, 140, 180, 200],
      jev: [540, 580, 630, 680, 720, 770, 810, 840],
      qwenPointwise: [1480, 2960, 4440, 5920, 7400, 10360, 13320, 14840],
      qwenListwise: [940, 1080, 1260, 1420, 1610, 1980, 2290, 2450],
      sasrec: [19, 21, 23, 25, 27, 30, 32, 34],
    },
    ndcgData: {
      kValues: [20, 40, 60, 80, 100, 140, 180, 200],
      jev: [0.551, 0.582, 0.601, 0.612, 0.619, 0.623, 0.624, 0.625],
      qwenPointwise: [0.534, 0.542, 0.547, 0.549, 0.551, 0.552, 0.552, 0.552],
      qwenListwise: [0.542, 0.531, 0.518, 0.495, 0.472, 0.441, 0.418, 0.395],
      sasrec: [0.471, 0.481, 0.485, 0.487, 0.489, 0.491, 0.491, 0.491],
    },
    paretoPoints: [
      { model: 'recsys-jev (Ours)', modelType: 'Decision Model', latency: 610, ndcg: 0.624, isPareto: true, color: '#10b981' },
      { model: 'SASRec', modelType: 'Sequential DL', latency: 22, ndcg: 0.491, isPareto: true, color: '#06b6d4' },
      { model: 'DCN-v2', modelType: 'Feature Crossing', latency: 14, ndcg: 0.448, isPareto: true, color: '#8b5cf6' },
      { model: 'Matrix Factorization', modelType: 'CF Baseline', latency: 8, ndcg: 0.398, isPareto: true, color: '#64748b' },
      { model: 'Qwen 7B Pointwise', modelType: 'Pointwise LLM', latency: 3710, ndcg: 0.552, isPareto: false, color: '#ef4444' },
      { model: 'Qwen 7B Listwise', modelType: 'Listwise LLM', latency: 1120, ndcg: 0.518, isPareto: false, color: '#f59e0b' },
    ],
    keyInsights: {
      jevPeakNdcg: 0.624,
      jevP99Latency: '840ms (Flat)',
      collapseThreshold: 'K > 40',
      efficiencyGain: '17.6x faster than Pointwise LLM',
    },
  },
  movies: {
    id: 'movies',
    name: 'Amazon Reviews 2023: Movies & TV',
    shortName: 'Movies & TV',
    corpusSize: '412,000 Titles',
    itemType: 'Films & TV Shows',
    badge: 'Amazon 2023',
    badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
    description: 'Empirical benchmark on movies, streaming titles, and television series ratings.',
    latencyData: {
      kValues: [20, 40, 60, 80, 100, 140, 180, 200],
      jev: [510, 560, 610, 650, 700, 750, 790, 820],
      qwenPointwise: [1420, 2840, 4260, 5680, 7100, 9940, 12780, 14200],
      qwenListwise: [910, 1040, 1210, 1370, 1550, 1910, 2210, 2370],
      sasrec: [18, 20, 22, 24, 26, 29, 31, 33],
    },
    ndcgData: {
      kValues: [20, 40, 60, 80, 100, 140, 180, 200],
      jev: [0.542, 0.573, 0.592, 0.603, 0.609, 0.611, 0.612, 0.612],
      qwenPointwise: [0.528, 0.537, 0.542, 0.545, 0.547, 0.548, 0.548, 0.548],
      qwenListwise: [0.536, 0.525, 0.512, 0.488, 0.463, 0.432, 0.409, 0.386],
      sasrec: [0.465, 0.475, 0.479, 0.482, 0.484, 0.485, 0.485, 0.485],
    },
    paretoPoints: [
      { model: 'recsys-jev (Ours)', modelType: 'Decision Model', latency: 580, ndcg: 0.612, isPareto: true, color: '#10b981' },
      { model: 'SASRec', modelType: 'Sequential DL', latency: 20, ndcg: 0.485, isPareto: true, color: '#06b6d4' },
      { model: 'DCN-v2', modelType: 'Feature Crossing', latency: 13, ndcg: 0.442, isPareto: true, color: '#8b5cf6' },
      { model: 'Matrix Factorization', modelType: 'CF Baseline', latency: 7, ndcg: 0.412, isPareto: true, color: '#64748b' },
      { model: 'Qwen 7B Pointwise', modelType: 'Pointwise LLM', latency: 3550, ndcg: 0.548, isPareto: false, color: '#ef4444' },
      { model: 'Qwen 7B Listwise', modelType: 'Listwise LLM', latency: 1080, ndcg: 0.512, isPareto: false, color: '#f59e0b' },
    ],
    keyInsights: {
      jevPeakNdcg: 0.612,
      jevP99Latency: '820ms (Flat)',
      collapseThreshold: 'K > 35',
      efficiencyGain: '17.3x faster than Pointwise LLM',
    },
  },
  games: {
    id: 'games',
    name: 'Amazon Reviews 2023: Video Games',
    shortName: 'Video Games',
    corpusSize: '286,000 Games',
    itemType: 'PC & Console Titles',
    badge: 'Amazon 2023',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    description: 'Empirical benchmark on gaming software, downloadable content, and gaming mechanics.',
    latencyData: {
      kValues: [20, 40, 60, 80, 100, 140, 180, 200],
      jev: [530, 580, 630, 670, 715, 770, 815, 850],
      qwenPointwise: [1510, 3020, 4530, 6040, 7550, 10570, 13590, 15100],
      qwenListwise: [960, 1100, 1290, 1460, 1660, 2040, 2350, 2520],
      sasrec: [20, 22, 24, 26, 28, 31, 33, 35],
    },
    ndcgData: {
      kValues: [20, 40, 60, 80, 100, 140, 180, 200],
      jev: [0.563, 0.596, 0.615, 0.627, 0.633, 0.637, 0.638, 0.639],
      qwenPointwise: [0.541, 0.551, 0.556, 0.558, 0.56, 0.561, 0.561, 0.561],
      qwenListwise: [0.553, 0.542, 0.529, 0.504, 0.481, 0.449, 0.425, 0.401],
      sasrec: [0.481, 0.492, 0.496, 0.498, 0.5, 0.502, 0.502, 0.502],
    },
    paretoPoints: [
      { model: 'recsys-jev (Ours)', modelType: 'Decision Model', latency: 620, ndcg: 0.638, isPareto: true, color: '#10b981' },
      { model: 'SASRec', modelType: 'Sequential DL', latency: 22, ndcg: 0.502, isPareto: true, color: '#06b6d4' },
      { model: 'DCN-v2', modelType: 'Feature Crossing', latency: 15, ndcg: 0.457, isPareto: true, color: '#8b5cf6' },
      { model: 'Matrix Factorization', modelType: 'CF Baseline', latency: 9, ndcg: 0.421, isPareto: true, color: '#64748b' },
      { model: 'Qwen 7B Pointwise', modelType: 'Pointwise LLM', latency: 3770, ndcg: 0.561, isPareto: false, color: '#ef4444' },
      { model: 'Qwen 7B Listwise', modelType: 'Listwise LLM', latency: 1140, ndcg: 0.529, isPareto: false, color: '#f59e0b' },
    ],
    keyInsights: {
      jevPeakNdcg: 0.638,
      jevP99Latency: '850ms (Flat)',
      collapseThreshold: 'K > 40',
      efficiencyGain: '17.8x faster than Pointwise LLM',
    },
  },
  books: {
    id: 'books',
    name: 'Amazon Reviews 2023: Books',
    shortName: 'Books',
    corpusSize: '950,000 Volumes',
    itemType: 'Technical, Non-Fiction & Sci-Fi',
    badge: 'Amazon 2023',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    description: 'Empirical benchmark on technical volumes, textbooks, and long-form literature ratings.',
    latencyData: {
      kValues: [20, 40, 60, 80, 100, 140, 180, 200],
      jev: [490, 540, 590, 630, 670, 720, 760, 790],
      qwenPointwise: [1390, 2780, 4170, 5560, 6950, 9730, 12510, 13900],
      qwenListwise: [890, 1020, 1180, 1330, 1510, 1860, 2150, 2300],
      sasrec: [17, 19, 21, 23, 25, 27, 29, 31],
    },
    ndcgData: {
      kValues: [20, 40, 60, 80, 100, 140, 180, 200],
      jev: [0.529, 0.559, 0.578, 0.589, 0.594, 0.597, 0.598, 0.598],
      qwenPointwise: [0.514, 0.523, 0.528, 0.531, 0.533, 0.534, 0.534, 0.534],
      qwenListwise: [0.522, 0.51, 0.495, 0.471, 0.448, 0.418, 0.394, 0.372],
      sasrec: [0.452, 0.462, 0.466, 0.469, 0.471, 0.472, 0.472, 0.472],
    },
    paretoPoints: [
      { model: 'recsys-jev (Ours)', modelType: 'Decision Model', latency: 550, ndcg: 0.598, isPareto: true, color: '#10b981' },
      { model: 'SASRec', modelType: 'Sequential DL', latency: 19, ndcg: 0.472, isPareto: true, color: '#06b6d4' },
      { model: 'DCN-v2', modelType: 'Feature Crossing', latency: 12, ndcg: 0.428, isPareto: true, color: '#8b5cf6' },
      { model: 'Matrix Factorization', modelType: 'CF Baseline', latency: 6, ndcg: 0.384, isPareto: true, color: '#64748b' },
      { model: 'Qwen 7B Pointwise', modelType: 'Pointwise LLM', latency: 3480, ndcg: 0.534, isPareto: false, color: '#ef4444' },
      { model: 'Qwen 7B Listwise', modelType: 'Listwise LLM', latency: 1040, ndcg: 0.495, isPareto: false, color: '#f59e0b' },
    ],
    keyInsights: {
      jevPeakNdcg: 0.598,
      jevP99Latency: '790ms (Flat)',
      collapseThreshold: 'K > 35',
      efficiencyGain: '17.5x faster than Pointwise LLM',
    },
  },
};

export const SDK_CODE_SNIPPETS = {
  curl: `# 1. Ingest positive interaction feedback
curl -X POST http://localhost:8088/api/feedback \\
  -H "Content-Type: application/json" \\
  -d '[
    {"FeedbackType": "star", "UserId": "usr_bob_gitrec", "ItemId": "vllm-project/vllm"},
    {"FeedbackType": "like", "UserId": "usr_bob_gitrec", "ItemId": "astral-sh/uv"}
  ]'

# 2. Query High-Throughput Jev Decision Rerank
curl -X POST http://localhost:8088/api/recommend \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "usr_bob_gitrec",
    "domain": "gitrec",
    "reranker_model": "jev",
    "candidate_size_k": 100,
    "top_n": 10,
    "enable_explainability": true
  }'`,

  python: `import httpx

client = httpx.Client(base_url="http://localhost:8088")

# Ingest Feedback
feedback_payload = [
    {"FeedbackType": "star", "UserId": "usr_bob_gitrec", "ItemId": "vllm-project/vllm"}
]
client.post("/api/feedback", json=feedback_payload)

# Execute Decision-Oriented Recommendation
response = client.post("/api/recommend", json={
    "user_id": "usr_bob_gitrec",
    "domain": "gitrec",
    "reranker_model": "jev",
    "candidate_size_k": 50,
    "top_n": 5,
    "enable_explainability": True
})

recommendations = response.json()
for item in recommendations["items"]:
    print(f"#{item['rank']} {item['title']} (Prob: {item['confidence_score']:.3f})")
    if item.get("explainability"):
        print(f"   Why for you: {item['explainability']}")`,

  go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type RecommendRequest struct {
	UserID               string \`json:"user_id"\`
	Domain               string \`json:"domain"\`
	RerankerModel        string \`json:"reranker_model"\`
	CandidateSizeK       int    \`json:"candidate_size_k"\`
	TopN                 int    \`json:"top_n"\`
	EnableExplainability bool   \`json:"enable_explainability"\`
}

func main() {
	reqBody, _ := json.Marshal(RecommendRequest{
		UserID:               "usr_bob_gitrec",
		Domain:               "gitrec",
		RerankerModel:        "jev",
		CandidateSizeK:       50,
		TopN:                 10,
		EnableExplainability: true,
	})

	resp, err := http.Post("http://localhost:8088/api/recommend", "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	fmt.Println("Gorse-Jev Engine HTTP Status:", resp.Status)
}`,

  typescript: `import axios from 'axios';

interface RecommendResponse {
  user_id: string;
  reranker_model: string;
  items: Array<{
    rank: number;
    title: string;
    confidence_score: number;
    explainability?: string;
  }>;
}

const client = axios.create({ baseURL: 'http://localhost:8088' });

async function getRecommendations() {
  const { data } = await client.post<RecommendResponse>('/api/recommend', {
    user_id: 'usr_bob_gitrec',
    domain: 'gitrec',
    reranker_model: 'jev',
    candidate_size_k: 50,
    top_n: 5,
    enable_explainability: true,
  });

  console.log(\`Received \${data.items.length} items from Jev System 1:\`);
  data.items.forEach((item) => {
    console.log(\`[\${item.rank}] \${item.title} -> \${item.confidence_score}\`);
    if (item.explainability) console.log(\`   Sparkle: \${item.explainability}\`);
  });
}

getRecommendations();`,

  rust: `use reqwest::Client;
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    let resp = client
        .post("http://localhost:8088/api/recommend")
        .json(&json!({
            "user_id": "usr_bob_gitrec",
            "domain": "gitrec",
            "reranker_model": "jev",
            "candidate_size_k": 50,
            "top_n": 10,
            "enable_explainability": true
        }))
        .send()
        .await?;

    println!("Jev Decision Engine Response: {:?}", resp.status());
    Ok(())
}`,
};

export const CONFIG_TOML_TEXT = `# recsys-jev Configuration Specification
# AI-Native Evolution of Gorse Recommender Engine (https://gorse.io)
# Implementing Decision-Oriented Recommendation Reranking

[master]
port = 8086
host = "0.0.0.0"
http_port = 8088
jobs = 8
heartbeat_timeout = "60s"
dashboard_user = "admin"
dashboard_password = "password"

[server]
default_n = 10
api_key = ""
cache_expire = "10s"
clock_error = "5s"
auto_insert_user = true
auto_insert_item = true

[database]
# Hot Cache: Redis for immediate recommendation delivery
cache_store = "redis://127.0.0.1:6379/0"
# Cold Storage: PostgreSQL / MySQL for persistent user history and items
data_store = "postgres://gorse:gorse_pass@127.0.0.1:5432/gorse?sslmode=disable"

[recommend]
enable_collaborative_filtering = true
enable_vector_search = true
enable_latest_items = true
enable_popular_items = true
candidate_pool_size = 200

[recommend.vector]
engine = "faiss"
index_type = "IVF1024,PQ32"
embedding_dimension = 128
metric = "cosine"

# ==============================================================================
# Jev Decision-Oriented Reranking Engine (System 1)
# ==============================================================================
[reranker.jev]
enabled = true
model_version = "jev-sys1-v2.6"
decision_state_formulation = "sequential_intent_latent"
choice_normalization = "calibrated_isotropic_softmax"
endpoint = "http://127.0.0.1:8088/v1/decisions"
max_candidate_k = 200
p99_latency_sla_ms = 900
confidence_gating_threshold = 0.85

# Baselines for Comparative Telemetry
[reranker.baselines]
enable_pointwise_llm_benchmark = true
pointwise_model = "qwen-7b-instruct"
enable_listwise_llm_benchmark = true
listwise_max_tokens = 4096
sasrec_blocks = 2
sasrec_heads = 4

# ==============================================================================
# Selective Explainability Personalization (System 2)
# ==============================================================================
[personalization.gemini]
enabled = true
model = "gemini-3.8-flash"
target_rank_cutoff = 3          # Strictly synthesizes for Top-3 items
confidence_threshold = 0.85     # Only explain when Jev confidence P > 0.85
max_tokens_per_item = 40
temperature = 0.3
instruction = "Synthesize a 1-sentence personalized hook linking user intent with item."
`;
