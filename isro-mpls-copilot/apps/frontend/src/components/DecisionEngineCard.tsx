import { CopilotResponse } from "../types";

export default function DecisionEngineCard({ apiResponse, demoActive, recoveryState }: { apiResponse: CopilotResponse | null, demoActive: boolean, recoveryState: "IDLE" | "REROUTING" | "RESOLVED" }) {
  if (!apiResponse) return null;

  return (
    <div className="bg-[#0d111c] border border-blue-900/40 rounded-xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <h3 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-2">
        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        AI Decision Engine
      </h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Sufficient Evidence Aggregated
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Confidence Threshold Met (&gt;85%)
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Runbook Match Verified
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Topology Filter Applied
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
          ✓ Proceeding to LLM Formatter
        </span>
      </div>
    </div>
  );
}
