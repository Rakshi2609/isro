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
        logger.info(f"Processing query: {request.query}")
        
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
            topology_metadata=None, # Assuming we fetch this from a topology service
            historical_incidents=historical_incidents,
            retrieved_runbooks=retrieved_runbooks
        )
        
        # 4. Get System Prompt
        system_prompt = get_system_prompt()
        
        # 5. Generate Response via LLM
        raw_response_dict = self.llm_client.generate_response(system_prompt, context)
        
        # 6. Parse and validate into ChatResponse model
        try:
            return ChatResponse(**raw_response_dict)
        except Exception as e:
            logger.error(f"Failed to map LLM response to Schema: {e}")
            return ChatResponse(
                prediction="Output format error",
                confidence="Low",
                evidence="LLM generated invalid schema keys",
                root_cause=str(e),
                affected_scope="Backend",
                recommended_actions=["Check LLM instruction adherence"],
                cli_commands=[],
                rollback_plan="N/A",
                references=[]
            )
