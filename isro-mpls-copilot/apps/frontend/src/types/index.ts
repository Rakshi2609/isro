export interface CopilotResponse {
  prediction: {
    issue: string;
    eta: string;
    confidence: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "RESOLVED";
  };
  evidence: Record<string, string>;
  root_cause: {
    primary_hypothesis: string;
    alternative_causes: string[];
  };
  affected_scope: {
    router: string;
    interface: string;
    sites: string[];
    services: string[];
    impact: string;
  };
  recommended_actions: {
    immediate: string[];
    if_unresolved: string[];
  };
  cli_commands: string[];
  shap_evidence: Record<string, string>;
  historical_incident: {
    incident_id: string;
    resolved_by: string;
    similarity: string;
  };
  recovery_options: string[];
  response_source: "CACHED" | "AI_GENERATED" | "SIMILAR";
  knowledge_sources: string[];
}

export interface Scenario extends Omit<CopilotResponse, "response_source" | "knowledge_sources" | "recovery_options"> {
  id: string;
  name: string;
  mission_status: string;
  initial_telemetry: Record<string, string>;
  degraded_telemetry: Record<string, string>;
  recovered_telemetry: Record<string, string>;
  recovery_toast: string;
}
