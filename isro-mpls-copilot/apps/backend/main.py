from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from shared.schemas.api_models import ChatRequest, ChatResponse, RecommendationRequest, HealthResponse, ContextResponse
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
    
    # Process through the RAG pipeline
    response = rag_pipeline.process_query(request)
    return response

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
