# Air-Gapped Predictive Copilot for Secure MPLS Operations (ISRO Hackathon)

## Overview
This project is an enterprise-grade, fully offline AI Copilot designed for ISRO's secure MPLS network operations. It utilizes a local Large Language Model (Qwen2.5:7b-instruct) and a Hybrid RAG pipeline to provide predictive insights, root cause analysis, and actionable recommendations without relying on cloud inference.

The intelligence of the system stems from the orchestrated context merging of:
- Prediction Engine Output
- Telemetry Data
- Topology Metadata
- Historical Incidents
- Official Runbooks and Playbooks

## Architecture

```
Operator Query
      ↓
Prediction Output + Telemetry + Topology + Incident Memory + Runbooks
      ↓
Context Builder
      ↓
Prompt Builder (Strict JSON Schema)
      ↓
Offline LLM (Qwen2.5 / Ollama)
      ↓
Structured JSON Response (Prediction, Confidence, Evidence, Root Cause, etc.)
```

## Folder Structure
All source code is contained within the `isro-mpls-copilot/` directory.

- `isro-mpls-copilot/apps/backend/`: FastAPI application containing all REST endpoints.
- `isro-mpls-copilot/apps/frontend/`: Space reserved for an optional React/Vite UI.
- `isro-mpls-copilot/services/copilot/`: Core AI services including the RAG Pipeline, Context Builder, LLM Client, and Recommendation Engine.
- `isro-mpls-copilot/services/prediction/`: Services interacting with local AI prediction models.
- `isro-mpls-copilot/services/simulation/`: Network simulation tools.
- `isro-mpls-copilot/shared/schemas/`: Typed Pydantic models enforcing strict API contracts.
- `isro-mpls-copilot/knowledge/`: Raw markdown runbooks, topology JSONs, and incident logs.
- `isro-mpls-copilot/vector_db/`: Local ChromaDB persistent storage for vector embeddings.
- `isro-mpls-copilot/models/`: Storage for downloaded open-source model files if not managed by Ollama.
- `isro-mpls-copilot/data/`: General application data/cache.

## Prerequisites
- Linux (Ubuntu 24.04 recommended) OR Windows (10/11)
- Python 3.12
- Docker (optional, for deployment)
- 16GB+ RAM
- [Ollama](https://ollama.com/) installed and running locally

## Installation & Setup

### 1. Install Ollama and pull the model
The system requires the local `qwen2.5:7b-instruct` model to function.

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen2.5:7b-instruct
```

**Windows:**
1. Download the Ollama Windows installer from [ollama.com](https://ollama.com/download/windows).
2. Run the installer and open a Command Prompt or PowerShell.
3. Run the following command:
```powershell
ollama pull qwen2.5:7b-instruct
```

### 2. Setup Python Environment

**Linux:**
```bash
cd isro-mpls-copilot
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Windows (PowerShell):**
```powershell
cd isro-mpls-copilot
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Run the Backend API

**Linux:**
```bash
cd isro-mpls-copilot
export PYTHONPATH=$(pwd)
python apps/backend/main.py
```

**Windows (PowerShell):**
```powershell
cd isro-mpls-copilot
$env:PYTHONPATH = (Get-Location).Path
python apps\backend\main.py
```

## API Documentation

### `GET /health`
Checks API status.
**Response:** `{"status": "ok"}`

### `POST /chat`
Main Copilot interaction endpoint.
**Payload:**
```json
{
  "query": "Interface Gi0/1 is showing high errors.",
  "telemetry": {"Gi0/1": {"errors": 500, "status": "up"}},
  "prediction_data": {"anomaly": true, "confidence": 0.9}
}
```
**Returns:** Highly structured JSON including `prediction`, `confidence`, `root_cause`, `recommended_actions`, and `rollback_plan`.

### `POST /recommend`
Generates deep recommendations for a specific incident ID.

### `GET /context`
Retrieves vector database status.
