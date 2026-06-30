from langchain_community.llms import Ollama
import json
import logging

logger = logging.getLogger(__name__)

class LLMClient:
    """
    Offline LLM Client wrapping the local Ollama instance.
    Enforces JSON output format for structured prediction/recommendation generation.
    """
    def __init__(self, model_name: str = "qwen2.5:7b-instruct"):
        self.model_name = model_name
        # Using format="json" forces Ollama to output valid JSON
        self.llm = Ollama(model=self.model_name, format="json", temperature=0.1)

    def generate_response(self, system_prompt: str, context: str) -> dict:
        full_prompt = f"{system_prompt}\n\n{context}"
        try:
            logger.info(f"Sending prompt to local Ollama model {self.model_name}")
            response = self.llm.invoke(full_prompt)
            # Ensure it's parsed as JSON
            return json.loads(response)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON from LLM: {e}")
            logger.error(f"Raw response: {response}")
            return {
                "prediction": "Error parsing LLM response",
                "confidence": "Low",
                "evidence": str(e),
                "root_cause": "JSON Parsing Error",
                "affected_scope": "Copilot System",
                "recommended_actions": ["Check LLM output format constraints"],
                "cli_commands": [],
                "rollback_plan": "N/A",
                "references": []
            }
        except Exception as e:
            logger.error(f"LLM Generation Error: {e}")
            # Fallback safe error struct
            return {
                "prediction": "LLM Inference Failed",
                "confidence": "None",
                "evidence": str(e),
                "root_cause": "Offline Inference Error",
                "affected_scope": "System",
                "recommended_actions": ["Check Ollama service status"],
                "cli_commands": ["systemctl status ollama"],
                "rollback_plan": "N/A",
                "references": []
            }
