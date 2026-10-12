# recsys-jev

> **An AI-Native Evolution of the [Gorse Recommender System](https://gorse.io)**  
> Implementing **Decision-Oriented Recommendation Reranking**.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Async-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-React_19-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white)](https://docker.com)
[![Gemini](https://img.shields.io/badge/System_2-Gemini_2.5_Flash-4285F4.svg?logo=google&logoColor=white)](https://ai.google.dev)

---

## 🎯 Architecture Overview

Conventional LLM-based recommender engines suffer from two crippling failure modes:
1. **Pointwise LLM Latency Blowup**: Generating tokens sequentially per candidate results in exponential latency blowups (e.g. **14.8 seconds at $K=200$** for Qwen 2.5 7B).
2. **Listwise LLM Context Collapse**: Cramming $K > 40$ candidates into one long prompt causes severe attention dilution, primacy bias, and ranking degradation.

**recsys-jev** resolves this via a **Hybrid System 1 + System 2 RecSys Paradigm**:

```
+---------------------------------------------------------------------------------------------------+
|                                      recsys-jev Architecture                                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [User & Feedback Signals]                                                                        |
|              |                                                                                    |
|              v                                                                                    |
|  +---------------------------------------------------------------------------------------------+  |
|  | Stage 1: Gorse RecFlow Multi-Source Retrieval                                               |  |
|  | - Collaborative Filtering (BPR Factors=64)          - IVF1024-PQ32 Dense Vector Cosine      |  |
|  | - Real-time Trending Window Streams                 - Latest Freshness Feeds                 |  |
|  | Output: Candidate Pool C_u^(K) where K in [20, 200]                        (P99 < 15ms)      |  |
|  +---------------------------------------------------------------------------------------------+  |
|              |                                                                                    |
|              v                                                                                    |
|  +---------------------------------------------------------------------------------------------+  |
|  | Stage 2: Jev System 1 Decision Model                                                        |  |
|  | - Formulates User History into continuous Decision State S_u                                |  |
|  | - Projects Candidates into typed discrete Choice Alternatives C_u^(K)                       |  |
|  | - Calculates Isotropic Calibrated Softmax Probabilities P(i | S_u, C_u^(K))                 |  |
|  | Output: Calibrated Choice Distribution Vector                            (Flat P99 < 840ms) |  |
|  +---------------------------------------------------------------------------------------------+  |
|              |                                                                                    |
|              v                                                                                    |
|  +---------------------------------------------------------------------------------------------+  |
|  | Stage 3: Calibrated Confidence Gating                                                       |  |
|  | - Gating Cutoff: Eligible(i) = 1( P(i | S_u, C_u^(K)) >= 0.85 )                             |  |
|  | - Suppresses ungrounded speculative noise without hallucinating rationales                  |  |
|  +---------------------------------------------------------------------------------------------+  |
|              |                                                                                    |
|              v                                                                                    |
|  +---------------------------------------------------------------------------------------------+  |
|  | Stage 4: System 2 Gemini 2.5 Personalization (Explainability)                               |  |
|  | - Strictly synthesized on final Top-3 recommendations                                      |  |
|  | - 1-sentence "Why for you" micro-copy connecting technical intent with item attributes      |  |
|  | - Token cost savings: 98.2% vs pointwise LLM generation                                    |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## ⚡ Quickstart & Reproducibility

### Method A: One-Command Docker Compose (Recommended)
Clones and launches the full cluster (FastAPI Engine + React Web Console + Redis 7 Hot Cache):
```bash
docker compose up -d --build
```
- **Web UI & Interactive Console**: [http://localhost:8088](http://localhost:8088)
- **FastAPI OpenAPI Documentation**: [http://localhost:8088/docs](http://localhost:8088/docs)
- **Cluster Status Endpoint**: `curl http://localhost:8088/api/cluster/status`
- **Redis Cache**: `localhost:6379`

### Method B: Single Container Build & Run
```bash
# 1. Build the multi-stage image (frontend + engine)
docker build -t recsys-jev .

# 2. Run the container
docker run -d -p 8088:8088 --name recsys-engine recsys-jev

# 3. Verify health
curl -s http://localhost:8088/api/cluster/status | grep "Healthy"
```

### Method C: Standalone Python FastAPI (`main.py`)
```bash
pip install -r requirements.txt
python main.py
# Server listening on http://0.0.0.0:8088
# Interactive Swagger UI: http://localhost:8088/docs
```

### Method D: Full-Stack Node.js Dev Environment
```bash
npm install
npm run dev
# Vite Console & Express Gateway available at http://localhost:3000
```

---

## 🔬 Reproducibility Verification Checklist

Run these commands in your shell to verify the engine and benchmark outputs on your machine:

1. **Verify Cluster Readiness**:
   ```bash
   curl -s http://localhost:8088/api/cluster/status
   ```
2. **Inspect Benchmark Ground Truth (First 5 Rows of Real Corpora)**:
   ```bash
   curl -s http://localhost:8088/api/dataset/first-five
   ```
3. **Execute Jev System 1 Rerank (P99 < 900ms)**:
   ```bash
   curl -X POST http://localhost:8088/api/recommend \
     -H "Content-Type: application/json" \
     -d '{"user_id": "usr_bob_gitrec", "domain": "gitrec", "candidate_size_k": 50, "top_n": 5}'
   ```
4. **Ingest Interaction Signal (Gorse Compatible)**:
   ```bash
   curl -X POST http://localhost:8088/api/feedback \
     -H "Content-Type: application/json" \
     -d '[{"FeedbackType": "star", "UserId": "usr_bob_gitrec", "ItemId": "vllm-project/vllm"}]'
   ```

---

## 📊 Empirical Benchmarks (Table 2 Reference)

| Model Architecture | Model Class | Latency ($K=50$) | Latency ($K=200$) | NDCG@10 (GitRec) | NDCG@10 (Movies) | Hit Rate@10 | MRR |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **recsys-jev (Ours)** | **Decision Model (Sys 1)** | **610 ms** | **840 ms (Flat)** | **0.624** | **0.612** | **74.2%** | **0.518** |
| Qwen 2.5 7B Pointwise | Generative LLM | 3,710 ms | 14,840 ms (Blowup) | 0.552 | 0.548 | 66.5% | 0.441 |
| Qwen 2.5 7B Listwise | Generative LLM | 1,120 ms | 2,450 ms | 0.518 (Collapse) | 0.512 | 61.8% | 0.395 |
| SASRec | Sequential DL | 22 ms | 34 ms | 0.491 | 0.485 | 58.4% | 0.362 |
| DCN-v2 | Feature Crossing | 14 ms | 22 ms | 0.448 | 0.442 | 52.9% | 0.312 |
| Gorse BPR (MF) | Collaborative Filtering | 8 ms | 12 ms | 0.398 | 0.412 | 48.1% | 0.274 |

---

## 📡 REST API Reference

### 1. Ingest Feedback (`POST /api/feedback`)
Drop-in compatible with standard Gorse feedback signals (`star`, `like`, `read`, `click`):
```bash
curl -X POST http://localhost:8088/api/feedback \
  -H "Content-Type: application/json" \
  -d '[
    {"FeedbackType": "star", "UserId": "usr_bob_gitrec", "ItemId": "vllm-project/vllm"},
    {"FeedbackType": "like", "UserId": "usr_bob_gitrec", "ItemId": "astral-sh/uv"}
  ]'
```

### 2. High-Throughput Recommendation (`POST /api/recommend`)
```bash
curl -X POST http://localhost:8088/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "usr_bob_gitrec",
    "domain": "gitrec",
    "reranker_model": "jev",
    "candidate_size_k": 50,
    "top_n": 5,
    "enable_explainability": true
  }'
```

### 3. Cluster Telemetry (`GET /api/cluster/status`)
Retrieves live node metrics across Master, Server, Vector Worker, and Jev Gateway.

### 4. TypeSafe Jev Decision Gateway (`POST /v1/decisions`)
Accepts Decision State $S_u$ and Choice Alternatives $C_u^{(K)}$, returning isotropic calibrated probability vectors.

---

## 📜 Citation
```bibtex
@article{lyu2026decision,
  title={Decision-Oriented Recommendation Reranking: Overcoming Latency Blowup and Context Collapse},
  author={Lyu, Chen and Xia, Ming},
  journal={Meta AI Research and SMU Technical Reports},
  year={2026}
}
```

## 📄 License
Licensed under the Apache License, Version 2.0.
