from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Any, Dict, Union

class ChatRequest(BaseModel):
    query: str = Field(..., description="The operator's query or problem statement.")
    telemetry: Optional[Dict[str, Any]] = Field(default=None, description="Current telemetry data context.")
    prediction_data: Optional[Dict[str, Any]] = Field(default=None, description="Data from the predictive engine.")
    
class RecommendationRequest(BaseModel):
    incident_id: str = Field(..., description="ID of the incident to get recommendations for.")

class PredictionSchema(BaseModel):
    issue: str = "Unknown Issue"
    eta: str = "N/A"
    confidence: str = "N/A"
    severity: str = "UNKNOWN"

class RootCauseSchema(BaseModel):
    primary_hypothesis: str = "Unknown"
    alternative_causes: List[str] = Field(default_factory=list)

class AffectedScopeSchema(BaseModel):
    router: str = "N/A"
    interface: str = "N/A"
    sites: List[str] = Field(default_factory=list)
    services: List[str] = Field(default_factory=list)
    impact: str = "N/A"

class RecommendedActionsSchema(BaseModel):
    immediate: List[str] = Field(default_factory=list)
    if_unresolved: List[str] = Field(default_factory=list)

class HistoricalIncidentSchema(BaseModel):
    incident_id: str = "N/A"
    resolved_by: str = "N/A"
    similarity: str = "N/A"

class ChatResponse(BaseModel):
    prediction: PredictionSchema
    evidence: Dict[str, str] = Field(default_factory=dict)
    root_cause: RootCauseSchema
    affected_scope: AffectedScopeSchema
    recommended_actions: RecommendedActionsSchema
    cli_commands: List[str] = Field(default_factory=list)
    shap_evidence: Dict[str, str] = Field(default_factory=dict)
    historical_incident: HistoricalIncidentSchema
    recovery_options: List[str] = Field(default_factory=list, description="Specific actions the user can simulate")
    response_source: str = "AI_GENERATED"
    knowledge_sources: List[str] = Field(default_factory=list)
    
class HealthResponse(BaseModel):
    status: str = "ok"
    
class ContextResponse(BaseModel):
    loaded_documents: int
    vector_db_status: str
