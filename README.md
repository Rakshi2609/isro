# Air-Gapped Predictive Copilot for Secure MPLS Operations (ISRO Hackathon)

## 🚀 Overall Project Novelty
**Evidence-Driven Predictive Digital Twin for Air-Gapped MPLS Networks**

Unlike conventional NOC assistants that simply detect faults or answer questions from logs, our system combines predictive analytics, topology reasoning, evidence-backed AI, and future-state simulation into a completely offline decision-support platform.

### The 3 "Mic-Drop" Innovations
1. 🥇 **Evidence-Driven AI Copilot**: Every AI recommendation is grounded in live telemetry, topology, historical incidents, and official runbooks, eliminating unsupported recommendations.
2. 🥈 **Predictive Digital Twin**: Operators don't just see the current network—they can visualize the projected future state and evaluate remediation strategies before making changes.
3. 🥉 **Hybrid Intelligence Pipeline**: Instead of relying on an LLM alone, we combine predictive ML, graph-aware topology reasoning, hybrid retrieval, explainable AI, and an offline LLM into a single decision-support pipeline.

---

## 👥 Team Structure & Ownership

In this systems project, every module is a dependency. We divide the work by ownership, not difficulty.

### 👑 Amrutha — Network Digital Environment & Telemetry Engine
**Mission:** Build an entire enterprise MPLS + SD-WAN environment that behaves like a real ISRO network.
- **Responsibilities:** MPLS/SD-WAN topology, fault injection, traffic generation, Syslogs, NetFlow, telemetry dataset generation.
- **Novelty:** Mission-aware simulation (Satellite Launch, Earth Observation, etc.), progressive fault injection, dynamic scenario generator, multi-stage network labels.
- **Deliverables:** Network Simulator, Telemetry Pipeline, Ground Truth Dataset.

### 🧠 Hitha — Predictive Intelligence Engine
**Mission:** Build the system that answers "What is likely to fail next?" before anyone else knows.
- **Responsibilities:** Data preprocessing, feature engineering, XGBoost model training, SHAP explainability, time-to-impact estimation, Prediction APIs.
- **Novelty:** Early failure prediction, time-to-impact (ETA) estimation, advanced topology-aware feature engineering (trends, velocity), explainable AI (SHAP), blast radius analysis.
- **Deliverables:** Prediction Engine, Explainability Metrics, Prediction API.

### 🤖 Rakshith — Intelligence Layer & System Architect
**Mission:** Build the soul of the project. Answer ISRO's three questions: *What will fail? Why? What should I do?*
- **Responsibilities:** Offline LLM, Hybrid RAG, ChromaDB, Context Builder, Prompt Engineering, Incident Memory, final FastAPI integration, overall architecture and schema contracts.
- **Novelty:** Hybrid retrieval (Vector + Topology + Telemetry + Incidents), evidence-first AI, context engineering, incident memory, structured operator responses.
- **Deliverables:** Offline Copilot, Hybrid RAG, Final integrated backend.

### 🎨 Nishu — Command Center & Operator Experience
**Mission:** Build the Command Center. If NOC operators cannot understand it in 5 seconds, the AI failed.
- **Responsibilities:** React / Next.js dashboard, interactive topology map, prediction timeline, Copilot interface, incident explorer, Digital Twin visualization.
- **Novelty:** Predictive Digital Twin (Current vs. Predicted), mission-centric visualization, evidence-first UI, "What-if" analysis, workflow-first design.
- **Deliverables:** Responsive Dashboard, Digital Twin UI, Operator Workflow.

---

## 📅 Execution Phases

- **Phase 0 — Research:** Build shared understanding, final architecture, schemas, API contracts, folder structure.
- **Phase 1 — Network Foundation:** Build topology, simulate traffic, define telemetry features, gather runbooks, wireframe UX.
- **Phase 2 — Data Pipeline:** Export telemetry, create training datasets, generate embeddings (ChromaDB), start frontend routing.
- **Phase 3 — Intelligence Layer:** Train XGBoost, expose prediction API, implement Hybrid Retrieval & Copilot, integrate frontend APIs.
- **Phase 4 — Digital Twin:** Export topology graphs, predict future states, visualize impact animations, reasoning layer.
- **Phase 5 — Final Integration:** API testing, bug fixing, offline validation, UI polishing. Nobody owns individual modules anymore.
- **Phase 6 — Demo Preparation:** Perfect the demo script answering: "What will fail?", "Why?", and "What should I do?".

---

## 🛠 Architecture & Folder Structure
All source code is contained within the `isro-mpls-copilot/` directory.

- `apps/backend/`: FastAPI application containing all REST endpoints.
- `apps/frontend/`: Space reserved for React/Next.js Command Center.
- `services/copilot/`: Core AI services (RAG Pipeline, Context Builder, LLM Client).
- `services/prediction/`: XGBoost predictive models and SHAP explainers.
- `services/simulation/`: Network simulation tools & telemetry generators.
- `shared/schemas/`: Typed Pydantic models (Telemetry, Prediction, Copilot contracts).
- `knowledge/`: Raw markdown runbooks, topology JSONs, and incident logs.
- `vector_db/`: Local ChromaDB persistent storage.

---

## ⚙️ Prerequisites & Setup

- **OS:** Linux (Ubuntu 24.04 recommended) OR Windows (10/11)
- **Requirements:** Python 3.12, 16GB+ RAM, [Ollama](https://ollama.com/) installed locally.

### 1. Install Ollama and pull the model
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen2.5:7b-instruct
```

### 2. Setup Environment & Run Backend
```bash
cd isro-mpls-copilot
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export PYTHONPATH=$(pwd)
python apps/backend/main.py
```

*(See `isro-mpls-copilot/README.md` for more detailed Windows instructions and API endpoints.)*
