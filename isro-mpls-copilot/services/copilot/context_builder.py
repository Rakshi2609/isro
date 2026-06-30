import json
from typing import Dict, Any, List

class ContextBuilder:
    """
    Merges various offline sources (Prediction JSON, Telemetry JSON, 
    Topology JSON, Historical Incidents, Retrieved Documents) 
    into one structured prompt.
    """
    def __init__(self):
        pass

    def build_context(
        self,
        query: str,
        telemetry: Dict[str, Any] = None,
        prediction_data: Dict[str, Any] = None,
        topology_metadata: Dict[str, Any] = None,
        historical_incidents: List[Dict[str, Any]] = None,
        retrieved_runbooks: List[str] = None
    ) -> str:
        
        context_parts = []
        
        context_parts.append(f"OPERATOR QUERY:\n{query}\n")
        
        if prediction_data:
            context_parts.append(f"PREDICTION ENGINE OUTPUT:\n{json.dumps(prediction_data, indent=2)}\n")
            
        if telemetry:
            context_parts.append(f"CURRENT TELEMETRY:\n{json.dumps(telemetry, indent=2)}\n")
            
        if topology_metadata:
            context_parts.append(f"TOPOLOGY METADATA:\n{json.dumps(topology_metadata, indent=2)}\n")
            
        if historical_incidents:
            incidents_str = json.dumps(historical_incidents, indent=2)
            context_parts.append(f"HISTORICAL SIMILAR INCIDENTS:\n{incidents_str}\n")
            
        if retrieved_runbooks:
            runbooks_str = "\n---\n".join(retrieved_runbooks)
            context_parts.append(f"RETRIEVED RUNBOOKS & PLAYBOOKS:\n{runbooks_str}\n")
            
        return "\n=================================================\n".join(context_parts)
