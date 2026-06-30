from services.copilot.llm_client import LLMClient
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class RecommendationEngine:
    """
    Dedicated engine for generating deep actionable recommendations
    based on historical incidents and current state.
    """
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def generate_recommendations(self, incident_context: str) -> Dict[str, Any]:
        logger.info("Generating standalone recommendations")
        system_prompt = """You are an ISRO Operations Copilot.
Generate recommendations based on the provided incident context.
CRITICAL INSTRUCTION: Never hallucinate. Output must be valid JSON.
{
  "investigation_steps": ["step 1", "step 2"],
  "cli_commands": ["command 1"],
  "rollback_procedure": "procedure details to revert actions safely",
  "risk_level": "High/Medium/Low",
  "expected_outcome": "what the operator should expect after execution"
}"""
        try:
            return self.llm_client.generate_response(system_prompt, incident_context)
        except Exception as e:
            logger.error(f"Error in RecommendationEngine: {e}")
            return {
                "investigation_steps": ["Manual investigation required due to offline error"],
                "cli_commands": [],
                "rollback_procedure": "N/A",
                "risk_level": "Unknown",
                "expected_outcome": "System error"
            }
