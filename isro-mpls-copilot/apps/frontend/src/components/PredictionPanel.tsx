import { CopilotResponse } from "../types";

export default function PredictionPanel({ apiResponse, demoActive, recoveryState }: { apiResponse: CopilotResponse | null, demoActive: boolean, recoveryState: "IDLE" | "REROUTING" | "RESOLVED" }) {
  if (!apiResponse) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl p-5 shadow-xl border bg-slate-900/40 border-slate-800/50 opacity-50 flex flex-col justify-center items-center min-h-[150px]">
          <span className="text-xs text-slate-500 uppercase tracking-widest animate-pulse">Awaiting Diagnostics</span>
        </div>
      </div>
    );
  }

  const isRed = demoActive && recoveryState !== "RESOLVED";
  const isGreen = recoveryState === "RESOLVED";

  return (
    <div className="space-y-4">
      <div className={`rounded-xl p-5 shadow-xl border transition-all duration-1000 ${isGreen ? 'bg-emerald-950/20 border-emerald-900/50' : isRed ? 'bg-red-950/20 border-red-900/50' : 'bg-slate-900/40 border-slate-800/50'}`}>
        <h3 className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Predicted Issue</h3>
        <h2 className={`text-lg font-bold mb-4 transition-colors duration-1000 ${isGreen ? 'text-emerald-400' : isRed ? 'text-red-400' : 'text-slate-300'}`}>
          {isGreen ? "Issue Resolved via Fallback" : apiResponse.prediction.issue}
        </h2>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#090b14]/50 p-3 rounded-lg border border-slate-800/50">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Time-to-Impact</div>
            <div className={`text-sm font-mono font-bold transition-colors ${isGreen || !demoActive ? 'text-slate-500' : 'text-orange-400'}`}>
              {isGreen ? "Mitigated" : !demoActive ? "N/A" : apiResponse.prediction.eta}
            </div>
          </div>
          <div className="bg-[#090b14]/50 p-3 rounded-lg border border-slate-800/50">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Severity</div>
            <div className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded transition-colors ${isGreen ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20' : !demoActive ? 'bg-slate-800 text-slate-400' : 'bg-red-500/20 text-red-500 border border-red-500/20'}`}>
              {isGreen ? "RESOLVED" : !demoActive ? "NORMAL" : apiResponse.prediction.severity}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
            <span className="text-slate-500">Risk Confidence</span>
            <span className={isGreen ? 'text-emerald-400' : isRed ? 'text-red-400' : 'text-slate-500'}>
              {isGreen ? "22%" : !demoActive ? "0%" : apiResponse.prediction.confidence}
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div className={`h-full transition-all duration-1000 ${isGreen ? 'bg-emerald-500' : isRed ? 'bg-red-500' : 'bg-slate-700'}`} style={{ width: isGreen ? '22%' : !demoActive ? '0%' : apiResponse.prediction.confidence }}></div>
          </div>
        </div>
      </div>

      <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">SHAP Evidence (Top Contributors)</h3>
        <div className="space-y-2 opacity-100 transition-opacity">
          {Object.keys(apiResponse.shap_evidence).length === 0 ? (
            <div className="text-xs text-slate-600 text-center py-4">No SHAP data returned by engine.</div>
          ) : (
            Object.entries(apiResponse.shap_evidence).map(([feature, impact]) => (
              <div key={feature} className="flex justify-between items-center text-xs">
                <span className="text-slate-300">{feature}</span>
                <span className={`font-mono text-[10px] font-bold bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 ${isGreen ? 'text-slate-500' : 'text-orange-400'}`}>
                  {isGreen ? "Neutralized" : String(impact)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
