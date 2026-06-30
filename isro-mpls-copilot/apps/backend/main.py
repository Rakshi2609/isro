from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from shared.schemas.api_models import (
    ChatRequest, ChatResponse, RecommendationRequest, HealthResponse, ContextResponse,
    PredictionSchema, RootCauseSchema, AffectedScopeSchema, RecommendedActionsSchema, HistoricalIncidentSchema
)
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ISRO Air-Gapped Network Operations Copilot", 
    description="Predictive Copilot for Secure MPLS Operations. Runs completely offline.",
    version="1.0.0"
)

from services.copilot.rag_pipeline import CopilotRAGPipeline

# Initialize RAG Pipeline
# Note: In a real app we might use FastAPI lifespan for initialization
rag_pipeline = CopilotRAGPipeline()

# Add CORS Middleware to allow Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to actual origin e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify API status."""
    return HealthResponse(status="ok")

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint. Processes operator queries through the Hybrid RAG pipeline.
    Expects JSON containing query and optional telemetry/prediction data.
    """
    logger.info(f"Received query: {request.query}")
    
    # Return highly structured mock data for frontend testing
    return ChatResponse(
        prediction=PredictionSchema(
            issue="Interface Gi0/1 degradation",
            eta="18 minutes",
            confidence="93%",
            severity="CRITICAL"
        ),
        evidence={
            "CRC Errors": "500 errors/sec ↑",
            "CPU Utilization": "95%",
            "Interface Flapping": "7 events in last 4 min",
            "BGP Stability": "Stable",
            "Packet Loss": "3.2%",
            "Historical Match": "92% similarity to Incident #145"
        },
        root_cause=RootCauseSchema(
            primary_hypothesis="Faulty SFP / Fiber",
            alternative_causes=["Duplex mismatch", "Failing interface", "Driver issue"]
        ),
        affected_scope=AffectedScopeSchema(
            router="CORE-RTR-01",
            interface="Gi0/1",
            sites=["Branch-2", "Branch-5"],
            services=["MPLS VPN A"],
            impact="HIGH"
        ),
        recommended_actions=RecommendedActionsSchema(
            immediate=["Verify fiber integrity", "Replace SFP", "Check duplex", "Monitor CRC trend"],
            if_unresolved=["Shift traffic to backup path", "Open hardware replacement ticket"]
        ),
        cli_commands=[
            "show interfaces Gi0/1",
            "show interfaces counters errors",
            "show controllers Gi0/1",
            "show logging",
            "show processes cpu sorted",
            "show ip bgp summary"
        ],
        shap_evidence={
            "CPU Utilization": "+41%",
            "CRC Errors": "+33%",
            "Queue Length": "+12%",
            "Interface Flaps": "+8%",
            "Packet Loss": "+6%"
        },
        historical_incident=HistoricalIncidentSchema(
            incident_id="Incident #142",
            resolved_by="Replacing faulty SFP.",
            similarity="96%"
        )
    )

@app.post("/recommend")
async def recommend_endpoint(request: RecommendationRequest):
    """Generates recommendations based on a specific incident ID."""
    return {"message": f"Generating recommendations for incident {request.incident_id}"}

@app.post("/evidence")
async def evidence_endpoint(request: dict):
    """Retrieves evidence related to a prediction or anomaly."""
    return {"message": "Evidence retrieval mock"}

@app.get("/context", response_model=ContextResponse)
async def context_endpoint():
    """Returns the current state of the vector database and loaded context."""
    return ContextResponse(loaded_documents=0, vector_db_status="Pending RAG Initialization")

if __name__ == "__main__":
    import uvicorn
    # Make sure we run on 0.0.0.0 for docker/external access if needed, but this is an offline tool
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
