"use client";

import { useState, useEffect } from "react";
import { scenarios } from "../data/scenarios";
import { Scenario } from "../types";
import MissionCard from "../components/MissionCard";
import TopologyCard from "../components/TopologyCard";
import PredictionPanel from "../components/PredictionPanel";
import EvidenceCard from "../components/EvidenceCard";
import OperatorLog from "../components/OperatorLog";

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const scenario = scenarios.find(s => s.id === activeScenarioId) as Scenario;
  
  const [demoActive, setDemoActive] = useState(false);
  const [recoveryState, setRecoveryState] = useState<"IDLE" | "REROUTING" | "RESOLVED">("IDLE");
  const [logs, setLogs] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const [activeTelemetry, setActiveTelemetry] = useState(scenario.initial_telemetry);

  // Reset states when scenario changes
  useEffect(() => {
    setDemoActive(false);
    setRecoveryState("IDLE");
    setLogs([]);
    setToast(null);
    setActiveTelemetry(scenario.initial_telemetry);
  }, [activeScenarioId, scenario]);

  const addLog = (msg: string) => {
    const now = new Date();
    const timeStr = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    setLogs(prev => [...prev, `${timeStr} ${msg}`]);
  };

  const handleRunDemo = () => {
    setDemoActive(true);
    setRecoveryState("IDLE");
    setLogs([]);
    
    addLog(`Initiating scenario: ${scenario.name}`);
    addLog("Monitoring telemetry stream...");
    
    // Simulate telemetry degradation over 3 seconds
    setTimeout(() => {
      addLog("WARNING: Telemetry anomalies detected");
      setActiveTelemetry(scenario.degraded_telemetry);
    }, 1500);
    
    setTimeout(() => {
      addLog("Copilot diagnostics generated successfully");
    }, 3000);
  };

  const handleSimulate = () => {
    setRecoveryState("REROUTING");
    addLog("Operator initiated What-If Simulation.");
    addLog("Calculating fallback routing constraints...");
    
    setTimeout(() => {
      addLog("Activating backup paths...");
      addLog(scenario.recovery_toast);
      setRecoveryState("RESOLVED");
      setActiveTelemetry(scenario.recovered_telemetry);
      setToast(scenario.recovery_toast);
      
      setTimeout(() => setToast(null), 5000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-200 font-sans p-4 md:p-6 overflow-x-hidden relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900/90 border border-emerald-500 text-emerald-400 px-6 py-3 rounded-lg shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
            ISRO NOC Copilot
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">
            Enterprise Predictive Network Operations
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 ml-1">Incident Scenario</label>
            <select 
              value={activeScenarioId}
              onChange={(e) => setActiveScenarioId(e.target.value)}
              className="bg-black border border-slate-700 text-sm rounded px-3 py-1.5 text-cyan-400 outline-none focus:border-cyan-500 min-w-[250px]"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={handleRunDemo}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded transition-colors shadow-lg shadow-blue-900/20 whitespace-nowrap h-full mt-4 flex items-center gap-2"
          >
            ▶ Run Demo
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Mission & Topology (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <MissionCard scenario={scenario} demoActive={demoActive} recoveryState={recoveryState} />
          
          <TopologyCard scenario={scenario} demoActive={demoActive} recoveryState={recoveryState} />
          
          <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg">
             <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Active Telemetry Stream</h3>
             <div className="space-y-2">
               {Object.entries(activeTelemetry).map(([key, val]) => {
                 const isDegraded = demoActive && recoveryState === 'IDLE' && scenario.degraded_telemetry[key] !== scenario.initial_telemetry[key];
                 return (
                   <div key={key} className="flex justify-between items-center text-xs font-mono bg-slate-900/50 p-2 rounded border border-slate-800/50 transition-colors">
                     <span className="text-cyan-500">{key}</span>
                     <span className={`${isDegraded ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{val}</span>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>

        {/* CENTER COLUMN: Prediction (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <PredictionPanel scenario={scenario} demoActive={demoActive} recoveryState={recoveryState} />
          
          {/* CLI & Simulation Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
               <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Required Diagnostics</h3>
               <div className="space-y-2">
                 {scenario.cli_commands.map((cmd, i) => (
                   <div key={i} className="font-mono text-[10px] text-emerald-400 bg-slate-900/50 p-2 rounded border border-slate-800 overflow-x-auto whitespace-nowrap">
                     <span className="text-slate-600 mr-2">$</span>{cmd}
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="bg-[#0d111c] border border-blue-900/40 rounded-xl p-5 shadow-[0_0_20px_rgba(37,99,235,0.1)] flex flex-col justify-center items-center text-center">
               <h3 className="text-sm font-bold text-slate-200 mb-2">What-If Simulation</h3>
               <p className="text-[10px] text-slate-400 mb-4">Virtually test the fallback routing path before executing on live hardware.</p>
               <button 
                 onClick={handleSimulate}
                 disabled={!demoActive || recoveryState !== "IDLE"}
                 className={`w-full py-2.5 rounded font-bold text-xs uppercase tracking-wide transition-all flex justify-center items-center gap-2
                 ${recoveryState === 'RESOLVED' ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/30' : 
                   recoveryState === 'REROUTING' ? 'bg-blue-600/50 text-white cursor-wait' : 
                   demoActive ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
               >
                 {recoveryState === 'RESOLVED' ? (
                   <>✓ Recovery Simulated</>
                 ) : recoveryState === 'REROUTING' ? (
                   <><svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Testing Reroute...</>
                 ) : (
                   <>▶ Simulate Recovery</>
                 )}
               </button>
            </div>
          </div>
          
          <div className="h-48">
            <OperatorLog logs={logs} />
          </div>
        </div>

        {/* RIGHT COLUMN: Evidence & Root Cause (4 Cols) */}
        <div className="lg:col-span-4">
          <EvidenceCard scenario={scenario} demoActive={demoActive} recoveryState={recoveryState} />
        </div>
      </div>
    </div>
  );
}
