import { Scenario } from "../types";

export default function EvidenceCard({ scenario, demoActive, recoveryState }: { scenario: Scenario, demoActive: boolean, recoveryState: "IDLE" | "REROUTING" | "RESOLVED" }) {
  if (!demoActive && recoveryState === "IDLE") {
    return (
      <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-8 shadow-lg h-full flex flex-col justify-center items-center text-center opacity-50">
        <svg className="w-12 h-12 text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
        <h3 className="text-sm font-bold text-slate-500 mb-2">Awaiting Telemetry</h3>
        <p className="text-xs text-slate-600">Copilot diagnostics will appear here once an anomaly is triggered.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Evidence Checklist</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(scenario.evidence).map(([key, val]) => (
            <div key={key} className="bg-slate-900/50 p-2.5 rounded border border-slate-800/50">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3 h-3 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span className="text-[10px] font-bold uppercase text-slate-400">{key}</span>
              </div>
              <div className="text-xs font-mono text-slate-200 pl-4.5">{String(val)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg">
         <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Root Cause Hypothesis</h3>
         <div className="mb-4">
           <span className="text-[10px] uppercase text-cyan-500 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 mr-2">Primary</span>
           <span className="text-sm font-medium text-slate-200">{scenario.root_cause.primary_hypothesis}</span>
         </div>
         <div>
           <div className="text-[10px] text-slate-500 uppercase font-bold mb-1.5">Alternative Causes</div>
           <ul className="list-disc pl-4 space-y-1">
             {scenario.root_cause.alternative_causes.map((cause: string, i: number) => (
               <li key={i} className="text-xs text-slate-400">{cause}</li>
             ))}
           </ul>
         </div>
      </div>

      <div className="bg-[#0d111c] border border-slate-800 rounded-xl overflow-hidden shadow-lg border-t-2 border-t-cyan-500">
         <div className="p-4 border-b border-slate-800/80 bg-slate-900/30">
            <h3 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Recommended Actions
            </h3>
         </div>
         <div className="p-4 space-y-4">
           <div>
             <div className="text-[10px] text-cyan-500 font-bold uppercase mb-2">Immediate Steps</div>
             <ul className="space-y-1.5">
               {scenario.recommended_actions.immediate.map((action: string, i: number) => (
                 <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                   <span className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-full bg-cyan-500/10 flex items-center justify-center text-[8px] font-bold text-cyan-400 border border-cyan-500/20">{i+1}</span>
                   {action}
                 </li>
               ))}
             </ul>
           </div>
           <div className="pt-3 border-t border-slate-800/50">
             <div className="text-[10px] text-orange-400 font-bold uppercase mb-2">If Unresolved</div>
             <ul className="space-y-1.5">
               {scenario.recommended_actions.if_unresolved.map((action: string, i: number) => (
                 <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                   <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full border border-slate-600"></span>
                   {action}
                 </li>
               ))}
             </ul>
           </div>
         </div>
      </div>
    </div>
  );
}
