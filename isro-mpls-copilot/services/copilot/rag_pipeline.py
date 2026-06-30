import logging
from typing import Dict, Any

from shared.schemas.api_models import ChatRequest, ChatResponse
from services.copilot.incident_memory import IncidentMemory
from services.copilot.llm_client import LLMClient
from services.copilot.context_builder import ContextBuilder
from services.copilot.system_prompt import get_system_prompt

logger = logging.getLogger(__name__)

class CopilotRAGPipeline:
    """
    Core engine combining Prediction Output + Telemetry + Topology + Historical Incidents + Runbooks.
    """
    def __init__(self, db_path: str = "vector_db", model_name: str = "qwen2.5:7b-instruct"):
        logger.info("Initializing Hybrid RAG Pipeline...")
        self.memory = IncidentMemory(db_path=db_path)
        self.llm_client = LLMClient(model_name=model_name)
        self.context_builder = ContextBuilder()
        logger.info("RAG Pipeline initialization complete.")

    def process_query(self, request: ChatRequest) -> ChatResponse:
        import json
        logger.info(f"Processing query: {request.query}")
        
        # LEVEL 1: Fast Path Demo Scenarios
        if request.query.startswith("SCENARIO:"):
            # For hackathon demo, we just echo back the request payload if it already contains the scenario structure
            # but ideally the frontend just relies on the backend cache. We will let the frontend handle the exact 
            # scenario data and just return a generic success if it hits this path, or frontend can bypass.
            # To be robust, let's fall through to Level 2/3 if not explicitly handled.
            pass
            
        # LEVEL 2: Semantic Cache (Similar Previous Queries)
        cached_json_str = self.memory.check_semantic_cache(request.query, threshold=0.90)
        if cached_json_str:
            try:
                cached_data = json.loads(cached_json_str)
                cached_data["response_source"] = "CACHED"
                cached_data["knowledge_sources"] = ["Historical Cache", "Live Telemetry"]
                logger.info("Level 2: Semantic Cache HIT!")
                return ChatResponse(**cached_data)
            except Exception as e:
                logger.warning(f"Cache parse failed: {e}")

        logger.info("Level 3: Cache MISS. Generating via Ollama...")
        # 1. Retrieve similar incidents and runbooks
        incident_results = self.memory.retrieve_similar_incidents(request.query)
        runbook_results = self.memory.retrieve_runbooks(request.query)
        
        # 2. Extract retrieved texts safely
        historical_incidents = []
        if incident_results and incident_results.get('documents') and incident_results['documents'][0]:
            for doc in incident_results['documents'][0]:
                historical_incidents.append({"description": doc})
                
        retrieved_runbooks = []
        if runbook_results and runbook_results.get('documents') and runbook_results['documents'][0]:
            retrieved_runbooks = runbook_results['documents'][0]

        # 3. Build structured context prompt
        context = self.context_builder.build_context(
            query=request.query,
            telemetry=request.telemetry,
            prediction_data=request.prediction_data,
            topology_metadata=None,
            historical_incidents=historical_incidents,
            retrieved_runbooks=retrieved_runbooks
        )
        
        # 4. Get System Prompt
        system_prompt = get_system_prompt()
        
        # 5. Generate Response via LLM
        raw_response_dict = self.llm_client.generate_response(system_prompt, context)
        
        raw_response_dict["response_source"] = "AI_GENERATED"
        raw_response_dict["knowledge_sources"] = ["Runbook", "Historical Incident", "Live Telemetry", "LLM"]
        
        # 6. Parse and validate
        try:
            response_obj = ChatResponse(**raw_response_dict)
            # LEVEL 3: Store to Cache for future
            self.memory.store_in_cache(request.query, json.dumps(raw_response_dict))
            return response_obj
        except Exception as e:
            logger.error(f"Failed to map LLM response to Schema: {e}")
            return ChatResponse(
                prediction={"issue": "Format Error", "eta": "N/A", "confidence": "Low", "severity": "MEDIUM"},
                confidence="Low",
                evidence={"error": "LLM generated invalid schema keys"},
                root_cause={"primary_hypothesis": str(e), "alternative_causes": []},
                affected_scope={"router": "Backend", "interface": "API", "sites": [], "services": [], "impact": "LOW"},
                recommended_actions={"immediate": ["Check LLM instruction adherence"], "if_unresolved": []},
                cli_commands=[],
                shap_evidence={},
                historical_incident={"incident_id": "N/A", "resolved_by": "N/A", "similarity": "0%"}
            )
