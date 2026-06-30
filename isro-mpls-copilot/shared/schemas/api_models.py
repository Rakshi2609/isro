from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class ChatRequest(BaseModel):
    query: str = Field(..., description="The operator's query or problem statement.")
    telemetry: Optional[Dict[str, Any]] = Field(default=None, description="Current telemetry data context.")
    prediction_data: Optional[Dict[str, Any]] = Field(default=None, description="Data from the predictive engine.")
    
class RecommendationRequest(BaseModel):
    incident_id: str = Field(..., description="ID of the incident to get recommendations for.")
    
class ChatResponse(BaseModel):
    prediction: str
    confidence: str
    evidence: str
    root_cause: str
    affected_scope: str
    recommended_actions: List[str]
    cli_commands: List[str]
    rollback_plan: str
    references: List[str]
    
class HealthResponse(BaseModel):
    status: str = "ok"
    
class ContextResponse(BaseModel):
    loaded_documents: int
    vector_db_status: str
