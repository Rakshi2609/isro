"use client";

import { useCopilot } from "../../context/CopilotContext";
import PredictionPanel from "../../components/PredictionPanel";
import EvidenceCard from "../../components/EvidenceCard";
import EvidenceGraph from "../../components/EvidenceGraph";
import DecisionEngineCard from "../../components/DecisionEngineCard";

export default function DiagnosticsPage() {
  const { apiResponse, demoActive, recoveryState } = useCopilot();

  return (
    <div className="p-4 md:p-8 flex-1 flex flex-col max-w-7xl mx-auto w-full">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Deep Diagnostics</h2>
        <p className="text-sm text-slate-500">Root cause analysis, confidence scoring, and supporting evidence.</p>
      </header>

      {/* Top Section: Evidence Graph (Full Width) */}
      <div className="mb-8 w-full">
        <EvidenceGraph apiResponse={apiResponse} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="space-y-8 flex flex-col">
          <PredictionPanel apiResponse={apiResponse} demoActive={demoActive} recoveryState={recoveryState} />
          <DecisionEngineCard apiResponse={apiResponse} demoActive={demoActive} recoveryState={recoveryState} />
        </div>
        
        <div className="space-y-8 flex flex-col h-full">
          <EvidenceCard apiResponse={apiResponse} demoActive={demoActive} recoveryState={recoveryState} />
        </div>
      </div>
    </div>
  );
}
