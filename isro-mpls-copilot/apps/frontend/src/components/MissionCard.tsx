import { Scenario } from "../types";

export default function MissionCard({ scenario, demoActive, recoveryState }: { scenario: Scenario, demoActive: boolean, recoveryState: "IDLE" | "REROUTING" | "RESOLVED" }) {
  return (
    <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 ${recoveryState === 'RESOLVED' ? 'bg-emerald-500' : demoActive ? 'bg-orange-500' : 'bg-cyan-500'} transition-colors duration-1000`}></div>
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Mission Status</h3>
      <div className={`text-lg font-bold font-mono ${recoveryState === 'RESOLVED' ? 'text-emerald-400' : demoActive ? 'text-orange-400' : 'text-cyan-400'} transition-colors duration-1000`}>
        {scenario.mission_status}
      </div>
      <div className="text-xs text-slate-400 mt-2">
        {recoveryState === 'RESOLVED' ? "Mission Secure. Traffic stabilized." : demoActive ? "Warning: Telemetry anomaly detected." : "All systems nominal."}
      </div>
    </div>
  );
}
