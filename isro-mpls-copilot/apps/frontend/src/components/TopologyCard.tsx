import { Scenario } from "../types";

export default function TopologyCard({ scenario, demoActive, recoveryState }: { scenario: Scenario, demoActive: boolean, recoveryState: "IDLE" | "REROUTING" | "RESOLVED" }) {
  const isRed = demoActive && recoveryState !== "RESOLVED";
  const isGreen = recoveryState === "RESOLVED";

  return (
    <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-3 opacity-20"><svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
      <h3 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest">Network Topology</h3>
      
      <div className="flex flex-col items-center py-4 relative">
        <div className="w-32 py-2 bg-slate-800/80 border border-slate-600 rounded flex justify-center items-center z-10 text-xs font-mono font-bold transition-colors">
          {scenario.affected_scope.router}
        </div>
        
        <div className={`w-0.5 h-8 transition-colors duration-1000 ${isGreen ? 'bg-emerald-500' : isRed ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`}></div>
        
        <div className={`px-4 py-1 rounded text-xs font-bold font-mono border z-10 shadow-lg transition-colors duration-1000 ${isGreen ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : isRed ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'}`}>
          {scenario.affected_scope.interface} {isGreen ? "✓" : isRed ? "⚠" : "○"}
        </div>
        
        <div className={`w-0.5 h-8 transition-colors duration-1000 ${isGreen ? 'bg-emerald-500' : isRed ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`}></div>
        
        <div className="flex flex-wrap justify-center gap-2 z-10 w-full px-2">
          {scenario.affected_scope.sites.map((site: string, idx: number) => (
            <div key={idx} className="px-2 py-1 bg-slate-800/80 border border-slate-600 rounded flex justify-center items-center text-[10px] font-mono text-slate-300">
              {site}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/50">
        <h3 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Similar Historical Incident</h3>
        <div className="text-sm text-blue-400 font-mono mb-1">{scenario.historical_incident.incident_id}</div>
        <div className="text-[10px] text-slate-400 mb-2">Resolved by: <span className="text-slate-200">{scenario.historical_incident.resolved_by}</span></div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-slate-500 font-bold">Similarity</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">
            {scenario.historical_incident.similarity}
          </span>
        </div>
      </div>
    </div>
  );
}
