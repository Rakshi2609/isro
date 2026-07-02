# Air-Gapped Predictive Copilot for Secure MPLS Operations (ISRO Hackathon)
# 📖 Project Bible & Full Architecture

This repository serves as the master Project Bible for the ISRO Hackathon. It outlines the complete end-to-end architecture, team responsibilities, execution phases, and the novelty of our **Evidence-Driven Predictive Digital Twin for Air-Gapped MPLS Networks**.

---

## 🚀 Overall Project Novelty
Unlike conventional NOC assistants that simply detect faults or answer questions from logs, our system combines predictive analytics, topology reasoning, evidence-backed AI, and future-state simulation into a completely offline decision-support platform.

### The 3 "Mic-Drop" Innovations
1. 🥇 **Evidence-Driven AI Copilot**: Every AI recommendation is grounded in live telemetry, topology, historical incidents, and official runbooks, eliminating unsupported recommendations.
2. 🥈 **Predictive Digital Twin**: Operators don't just see the current network—they can visualize the projected future state and evaluate remediation strategies before making changes.
3. 🥉 **Hybrid Intelligence Pipeline**: Instead of relying on an LLM alone, we combine predictive ML, graph-aware topology reasoning, hybrid retrieval, explainable AI, and an offline LLM into a single decision-support pipeline.

---

## 👥 Team Structure & Detailed Architecture

In a systems project like this, every module is a dependency for another module. If one person doesn't finish, the entire project suffers. So we divide it by ownership, not difficulty.

---

### 🧠 Hitha (The Leader) — Predictive Intelligence Engine
Hitha owns prediction. She is building the system that answers *"What is likely to fail next?"* before anyone else knows. Think of her as building Google's weather forecast instead of today's weather. Without predictions, there is no Copilot, no Digital Twin, no Explanation, and no Dashboard Intelligence.

**Final Architecture Pipeline:**
```text
Telemetry ➔ Cleaning ➔ Feature Engineering ➔ Prediction Models ➔ Risk Scoring ➔ Time-to-impact ➔ Explainability ➔ Prediction API
```

**Responsibilities & Phases:**
- **Phase 1 (Understand the Network):** Understand what happens *before* something fails (e.g., Packet Loss 0% ➔ 1% ➔ 2% ➔ 5% is already dangerous; Route Flapping means instability; CPU rising 40 ➔ 60 ➔ 90 means congestion incoming).
- **Phase 2 (Dataset Design):** Define the exact telemetry schema. E.g., `timestamp, router, cpu, memory, latency, packet_loss, jitter, interface_utilization, queue_length, bgp_changes, ospf_changes, tunnel_state, error_count, fault_label`. This schema becomes the contract for everyone.
- **Phase 3 (Feature Engineering):** Generate rolling averages, latency trends (+18 ms/min), CPU growth rates (+4.2% every minute), packet loss velocity, and standard deviations instead of just feeding raw values.
- **Phase 4 (Prediction Models):** Use **XGBoost** (fast, explainable, tabular data friendly, easy deployment) as primary. LightGBM as secondary. 
- **Phase 5 (Time-to-Impact):** Instead of just saying a failure will happen, output `Risk: 91%, ETA: 18 min, Confidence: 94%`.
- **Phase 6 (Explainability):** Use **SHAP**. If prediction is 91%, explain it: `CPU: 31%, Packet Loss: 26%, Queue: 18%, Latency: 17%, Tunnel: 8%`. Nobody asks "Why?"
- **Phase 7 (Blast Radius):** Input Prediction ➔ Topology ➔ Find Neighbor Routers ➔ Affected Branches ➔ Critical Services (e.g. Failure Router R4 ➔ Affects Branch 2, Mission Link, Voice Database).
- **Phase 8 (Prediction API):** Expose `/predict` returning structured JSON with risk, ETA, confidence, top features, and affected nodes.

**Biggest Mistake to Avoid:**
Optimize for *Prediction lead time* (minutes before failure), *Precision*, *Recall*, and *Time-to-impact estimation*, rather than raw accuracy on a fixed dataset.

---

### 🌍 Amrutha (The Creator) — Network Digital Environment & Telemetry Engine
Amrutha owns the data and the digital universe where our AI lives. She builds an entire enterprise MPLS + SD-WAN environment that behaves like a real ISRO network.

**Final Architecture Pipeline:**
```text
MPLS Topology ➔ Traffic Generation ➔ Fault Injection ➔ Telemetry Collection ➔ Logs ➔ Dataset Export ➔ Everyone Else
```

**Responsibilities & Phases:**
- **Phase 1 (Learn the Network):** Understand Routers, Switches, MPLS, CE, PE, P Router, SD-WAN, OSPF, BGP.
- **Phase 2 (Build Topology):** Build a realistic enterprise topology: `Datacenter ➔ MPLS Core Network ➔ Branches ➔ Backup SD-WAN`.
- **Phase 3 (Traffic Generation):** Generate realistic traffic mixing VoIP (low latency, high priority), Database (high reliability), and Mission Data (continuous, critical), each behaving differently.
- **Phase 4 (Fault Injection):** Inject realistic, progressive faults. Example: Traffic ➔ Bandwidth 95% ➔ Queue ➔ Latency ➔ Packet Loss. Inject BGP Flapping, Tunnel Degradation, Interface CRC Errors, Policy Misconfigurations.
- **Phase 5 (Telemetry Engine):** Generate real-time telemetry matching Hitha's exact schema every few seconds.
- **Phase 6 (Logs):** Generate Syslogs (BGP Neighbor Down, OSPF Adjacency Lost, Queue Overflow) for Rakshith's RAG pipeline.
- **Phase 7 (Ground Truth):** Label every event meticulously: `{failure: true, failure_type: "Tunnel", eta: 15, severity: "Critical"}` so ML can train.
- **Phase 8 (Export):** Produce Telemetry JSON, CSVs, Logs, Topology Graph, and Ground Truth for the rest of the team.

**Novelty:**
- **Mission Profiles:** Simulate Mission-specific behavior. *Satellite Launch Mode* (ultra-low latency telemetry), *Earth Observation Mode* (high-bandwidth images), *Deep Space Communication*.
- **Time Evolution:** Failures evolve (Healthy ➔ Congestion ➔ Packet Loss ➔ Failure).
- **Scenario Generator:** Random combinations of faults (Congestion + Tunnel Loss + High CPU).

---

### 🎨 Nishu (The Ruler) — Command Center & Operator Experience
Nishu owns the Operator Experience. It's not a dashboard; it's a Command Center (NASA Mission Control / Cisco NOC style).

**Final Architecture Workflow:**
```text
Is everything okay? ➔ If not, Where? ➔ Why? ➔ What happens next? ➔ How do I fix it?
```

**Responsibilities & Phases:**
- **Phase 1-3 (Operator Research & Dashboard Layout):** Clean, dark theme. Color only for meaning (green/yellow/orange/red). Everything on one screen: Current Network, Predicted Network, Mission Status, Copilot, Timeline.
- **Phase 4 (Topology View):** Interactive topology. The real novelty is the Split Screen: `CURRENT NETWORK` vs `PREDICTED NETWORK (15 mins later)`.
- **Phase 5 (Prediction Timeline):** A timeline showing the evolution of the fault: `10:00 Healthy ➔ 10:10 CPU Rising ➔ 10:15 Latency ➔ 10:20 Prediction ➔ 10:30 Failure`.
- **Phase 6 (Copilot Interface):** Professional suggested prompts instead of a blank chat window: `What will fail? ➔ Why? ➔ Show Evidence ➔ Generate Fix ➔ Simulate Recovery`.
- **Phase 7 (Evidence Panel):** Immediately show the SHAP evidence next to predictions so the judge instantly trusts the AI.
- **Phase 8 (Mission Impact):** Instead of "Router R3 Down", show "Satellite Telemetry: At Risk, Image Transfer: Healthy".
- **Phase 9 (Digital Twin):** Animate the traffic congestion growing. Animate the operator moving traffic to a backup tunnel and the network returning to healthy.
- **Phase 10 (Recovery Simulation):** Operator clicks "Move Traffic ➔ Tunnel 2". Animation shows the network recovering.
- **Phase 11-12 (Incident Explorer & Reports):** Log every incident like Git history. Generate PDF reports.

**Biggest Mistake to Avoid:**
Don't build analytics. Build *workflow*. Operators don't care about graphs; they care about answers.

---

### 🤖 Rakshith (The Conqueror) — Intelligence Layer & System Architect
Rakshith is building the soul of the project. He integrates outputs from everyone to answer ISRO's three questions: *What will fail? Why? What should I do?*

**Final Architecture Pipeline:**
```text
Prediction Output + Telemetry + Topology + Incident Memory + Runbooks ➔ Hybrid Retrieval Engine ➔ Context Builder ➔ Prompt Builder ➔ Offline LLM ➔ Structured JSON Response
```

**Responsibilities & Phases:**
- **Phase 1 (Build the Knowledge Base):** Collect Cisco docs, runbooks, RFCs, troubleshooting manuals, and past incidents.
- **Phase 2 (Document Processing):** Chunk them semantically (e.g., entire BGP failure scenario is one chunk).
- **Phase 3 (Embeddings):** Use fast, offline embedding models (`bge-small-en-v1.5` or `MiniLM`) and store in ChromaDB.
- **Phase 4 (Hybrid Retrieval):** The LLM never searches. YOU search. Retrieve Vector Search + Prediction + Topology + Telemetry + Historical Incidents simultaneously.
- **Phase 5 (Context Builder):** Merge all evidence. E.g., Risk 91% + Router R4 + R4 is connected to Mission Gateway + Runbook Tunnel Congestion + Incident #53 (92% Similar).
- **Phase 6 (Prompt Engineering):** Merge all evidence into a strict prompt. The LLM is instructed: *Never guess. Only answer using provided evidence.* Always return Prediction, Confidence, Evidence, Root Cause, Recommended Actions.
- **Phase 7-8 (Reasoning Pipeline):** `Prediction ➔ Topology Analysis ➔ Historical Similarity ➔ Runbook Retrieval ➔ Prompt Builder ➔ LLM`. The LLM is just the final communicator.
- **Phase 9 (Incident Memory):** Store every solved incident into ChromaDB. Future predictions search this memory.
- **Phase 10 (Action-Oriented Copilot):** Produce Problem ➔ Explanation ➔ CLI Commands ➔ Risk ➔ Rollback. *Never auto-execute.*
- **Phase 11 (API Layer):** Expose `/chat`, `/context`, `/recommendation` as the API Gateway.

**Biggest Mistake to Avoid:**
Don't just do `context = retriever(question); answer = llm(context)`. Enterprise AI builds context first, then asks.

---

## 📅 Global Execution Phases

- **Phase 0 — Research (Everyone):** Build shared understanding. Define architecture, schemas, and API contracts. No coding yet.
- **Phase 1 — Network Foundation (Amrutha Leads):** Build MPLS topology, configure routers, simulate traffic, generate telemetry. Hitha defines required features. Rakshith gathers runbooks. Nishu wireframes the UX.
- **Phase 2 — Data Pipeline (Everyone Simultaneous):** Amrutha exports datasets. Hitha builds preprocessing/train splits. Rakshith creates ChromaDB embeddings. Nishu starts frontend routing/auth.
- **Phase 3 — Intelligence Layer:** Hitha trains XGBoost & exposes `/predict`. Rakshith implements Hybrid Retrieval & offline `/chat`. Nishu integrates APIs.
- **Phase 4 — Digital Twin:** Amrutha exports topology. Hitha provides future states. Rakshith creates "What-if" reasoning. Nishu visualizes Current ➔ Predicted networks.
- **Phase 5 — Final Integration:** Nobody owns individual modules. Everyone does API testing, bug fixing, offline validation, and UI polishing.
- **Phase 6 — Demo Preparation:** Practice answering: What will fail? Why? What should I do? Demo realistic fault scenarios.

---

## 🛠 System Contracts & Tech Stack

**Tech Stack Lock:**
- **Frontend:** Next.js / React
- **Backend:** FastAPI
- **Database:** SQLite
- **Vector DB:** ChromaDB
- **LLM:** Qwen2.5:7b-instruct (via Ollama)
- **ML:** XGBoost

**Strict Rules (Do's & Don'ts):**
- **DO:** Keep every AI response evidence-backed. Build offline from day one. Use a single telemetry JSON schema across all modules.
- **DON'T:** Auto-execute configuration changes. Don't let the LLM invent facts. Don't overload the dashboard with useless charts. Don't add stretch goals (like GNNs) until the core is done.

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
*(See `isro-mpls-copilot/README.md` for more detailed instructions.)*
