import { CopilotResponse } from "../types";

export default function MissionCard({ apiResponse, demoActive, recoveryState }: { apiResponse: CopilotResponse | null, demoActive: boolean, recoveryState: "IDLE" | "REROUTING" | "RESOLVED" }) {
  if (!apiResponse) {
    return (
      <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-center items-center text-center opacity-50 h-full min-h-[100px]">
        <span className="text-xs text-slate-500 uppercase tracking-widest animate-pulse">Awaiting Signal</span>
      </div>
    );
  }

  const isResolved = recoveryState === 'RESOLVED';
  const isDanger = demoActive && !isResolved;

  return (
    <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden h-full min-h-[100px]">
      <div className={`absolute top-0 left-0 w-full h-1 ${isResolved ? 'bg-emerald-500' : isDanger ? 'bg-orange-500' : 'bg-cyan-500'} transition-colors duration-1000`}></div>
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Mission Impact Analysis</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Operation Phase</span>
            <span className="text-sm font-mono text-slate-300">Satellite Launch (GSAT-20)</span>
          </div>
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Ground Segment</span>
            <span className="text-sm font-mono text-slate-300">MCF Hassan / ISTRAC</span>
          </div>
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Telemetry Link</span>
            <span className="text-sm font-mono text-slate-300">S-Band / C-Band Uplink</span>
          </div>
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Network Anomaly Impact</span>
            <span className={`text-sm font-bold ${isResolved ? 'text-emerald-500' : isDanger ? 'text-orange-500' : 'text-slate-400'}`}>
              {isResolved ? 'SECURE' : isDanger ? 'CRITICAL DELAY' : 'NOMINAL'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
