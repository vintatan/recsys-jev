# ==============================================================================
# recsys-jev Production Container
# Multi-stage Dockerfile for AI-Native Gorse Recommendation Engine
# Builds high-throughput System 1 Decision Model + React UI Console
# ==============================================================================

FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PORT=8088

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py recsys-jev.toml ./
COPY --from=frontend-builder /app/dist ./static

EXPOSE 8088

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8088/api/cluster/status || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8088"]
