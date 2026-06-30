import { CopilotResponse } from "../types";

export default function MissionCard({ apiResponse, demoActive, recoveryState }: { apiResponse: CopilotResponse | null, demoActive: boolean, recoveryState: "IDLE" | "REROUTING" | "RESOLVED" }) {
  if (!apiResponse) {
    return (
      <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-center items-center text-center opacity-50 h-full min-h-[100px]">
        <span className="text-xs text-slate-500 uppercase tracking-widest animate-pulse">Awaiting Signal</span>
      </div>
    );
  }

  // Determine Mission Status dynamically or default
  // In a full implementation, you could have the LLM return the affected mission directly.
  const missionStatus = "Active Mission Support";

  return (
    <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden h-full min-h-[100px]">
      <div className={`absolute top-0 left-0 w-full h-1 ${recoveryState === 'RESOLVED' ? 'bg-emerald-500' : demoActive ? 'bg-orange-500' : 'bg-cyan-500'} transition-colors duration-1000`}></div>
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Mission Status</h3>
      <div className={`text-lg font-bold font-mono ${recoveryState === 'RESOLVED' ? 'text-emerald-400' : demoActive ? 'text-orange-400' : 'text-cyan-400'} transition-colors duration-1000`}>
        {missionStatus}
      </div>
      <div className="text-xs text-slate-400 mt-2">
        {recoveryState === 'RESOLVED' ? "Mission Secure. Traffic stabilized." : demoActive ? "Warning: Telemetry anomaly detected." : "All systems nominal."}
      </div>
    </div>
  );
}
