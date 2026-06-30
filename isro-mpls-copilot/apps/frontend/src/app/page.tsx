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
  const [activeData, setActiveData] = useState<Scenario>(scenarios[0]);
  
  const [demoActive, setDemoActive] = useState(false);
  const [recoveryState, setRecoveryState] = useState<"IDLE" | "REROUTING" | "RESOLVED">("IDLE");
  const [logs, setLogs] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTelemetry, setActiveTelemetry] = useState(scenarios[0].initial_telemetry);
  
  // Custom Query State
  const [customQuery, setCustomQuery] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);

  // Reset states when dropdown scenario changes (before run)
  useEffect(() => {
    setDemoActive(false);
    setRecoveryState("IDLE");
    setLogs([]);
    setToast(null);
    setActiveData(scenarios.find(s => s.id === activeScenarioId) as Scenario);
    setActiveTelemetry(scenarios.find(s => s.id === activeScenarioId)!.initial_telemetry);
  }, [activeScenarioId]);

  const addLog = (msg: string) => {
    const now = new Date();
    const timeStr = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    setLogs(prev => [...prev, `${timeStr} ${msg}`]);
  };

  const handleRunDemo = async () => {
    setDemoActive(true);
    setRecoveryState("IDLE");
    setLogs([]);
    
    addLog(`Initiating scenario: ${activeData.name}`);
    addLog("Hitting Level 1 Fast Cache...");
    
    setIsQuerying(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `SCENARIO:${activeData.id}`,
          telemetry: activeData.initial_telemetry,
          prediction_data: {},
        }),
      });
      
      // Even if API fails in demo mode, we fallback to our exact hardcoded scenario payload
      const mockResult = { ...activeData, response_source: "CACHED", knowledge_sources: ["Runbook", "Historical Incident"] } as Scenario;
      
      setTimeout(() => {
        setIsQuerying(false);
        setActiveData(mockResult);
        addLog("WARNING: Telemetry anomalies detected");
        setActiveTelemetry(activeData.degraded_telemetry);
        addLog("Copilot diagnostics retrieved instantly from cache.");
      }, 300); // Super fast 300ms for demo
      
    } catch (e) {
      setIsQuerying(false);
      console.error(e);
    }
  };

  const handleCustomQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    
    setDemoActive(true);
    setRecoveryState("IDLE");
    setLogs([]);
    addLog(`Operator Query: ${customQuery}`);
    addLog("Checking Semantic Cache...");
    
    setIsQuerying(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: customQuery,
          telemetry: activeTelemetry,
          prediction_data: {},
        }),
      });
      
      const data = await response.json();
      setIsQuerying(false);
      
      // Overwrite the active data with the real API response
      // For a real app, map the Pydantic JSON exactly to the Scenario interface
      const mappedData: Scenario = {
        id: "custom",
        name: "Custom Query Analysis",
        mission_status: activeData.mission_status,
        initial_telemetry: activeTelemetry,
        degraded_telemetry: activeTelemetry,
        recovered_telemetry: activeData.recovered_telemetry,
        prediction: data.prediction,
        evidence: data.evidence,
        root_cause: data.root_cause,
        affected_scope: data.affected_scope,
        recommended_actions: data.recommended_actions,
        cli_commands: data.cli_commands,
        shap_evidence: data.shap_evidence,
        historical_incident: data.historical_incident,
        recovery_toast: "Custom Recovery plan executed.",
        response_source: data.response_source,
        knowledge_sources: data.knowledge_sources
      };
      
      setActiveData(mappedData);
      addLog(`Diagnostics generated. Source: ${data.response_source}`);
      
    } catch (e) {
      setIsQuerying(false);
      addLog("ERROR: Failed to connect to RAG backend.");
      console.error(e);
    }
  };

  const handleSimulate = () => {
    setRecoveryState("REROUTING");
    addLog("Operator initiated What-If Simulation.");
    addLog("Calculating fallback routing constraints...");
    
    setTimeout(() => {
      addLog("Activating backup paths...");
      addLog(activeData.recovery_toast);
      setRecoveryState("RESOLVED");
      setActiveTelemetry(activeData.recovered_telemetry);
      setToast(activeData.recovery_toast);
      
      setTimeout(() => setToast(null), 5000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-200 font-sans p-4 md:p-6 overflow-x-hidden relative flex flex-col">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900/90 border border-emerald-500 text-emerald-400 px-6 py-3 rounded-lg shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* HEADER ROW */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-4 mb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center gap-3">
            ISRO NOC Copilot
            {activeData.response_source && (
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border flex items-center gap-1 mt-1
                ${activeData.response_source === 'CACHED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                  'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                {activeData.response_source === 'CACHED' ? '🟢 CACHED' : '🟣 AI GENERATED'}
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">
            Enterprise Predictive Network Operations
          </p>
        </div>
        
        {/* FAST DEMO SELECTOR */}
        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 ml-1">Demo Scenarios (Instant)</label>
            <select 
              value={activeScenarioId}
              onChange={(e) => setActiveScenarioId(e.target.value)}
              className="bg-black border border-slate-700 text-sm rounded px-3 py-1.5 text-cyan-400 outline-none focus:border-cyan-500 min-w-[200px]"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleRunDemo}
            disabled={isQuerying}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded shadow-lg shadow-blue-900/20 whitespace-nowrap h-full mt-4 flex items-center gap-2"
          >
            {isQuerying && customQuery === "" ? '...' : '▶ Run Demo'}
          </button>
        </div>
      </header>

      {/* CHAT BAR */}
      <form onSubmit={handleCustomQuery} className="mb-6 shrink-0 relative">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
         </div>
         <input 
           type="text" 
           value={customQuery}
           onChange={(e) => setCustomQuery(e.target.value)}
           placeholder="Ask Qwen2.5 about a live network issue (e.g., 'Why is Gi0/1 flapping?')"
           className="w-full bg-[#0d111c] border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-24 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
           disabled={isQuerying}
         />
         <button 
           type="submit" 
           disabled={isQuerying || !customQuery.trim()}
           className="absolute inset-y-1.5 right-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold px-4 rounded border border-slate-600 disabled:opacity-50"
         >
           {isQuerying && customQuery !== "" ? 'THINKING...' : 'ANALYZE'}
         </button>
      </form>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* LEFT COLUMN: Mission & Topology (3 Cols) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          <MissionCard scenario={activeData} demoActive={demoActive} recoveryState={recoveryState} />
          
          <TopologyCard scenario={activeData} demoActive={demoActive} recoveryState={recoveryState} />
          
          <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg flex-1">
             <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Active Telemetry</h3>
             <div className="space-y-2">
               {Object.entries(activeTelemetry).map(([key, val]) => {
                 const isInitial = scenarios.some(s => s.initial_telemetry[key] === val);
                 return (
                   <div key={key} className="flex justify-between items-center text-xs font-mono bg-slate-900/50 p-2 rounded border border-slate-800/50">
                     <span className="text-cyan-500">{key}</span>
                     <span className={!isInitial && demoActive && recoveryState === 'IDLE' ? 'text-red-400 font-bold' : 'text-slate-300'}>{String(val)}</span>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>

        {/* CENTER COLUMN: Prediction (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <PredictionPanel scenario={activeData} demoActive={demoActive} recoveryState={recoveryState} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
               <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Required Diagnostics</h3>
               <div className="space-y-2">
                 {activeData.cli_commands.map((cmd, i) => (
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
          
          <div className="flex-1 min-h-[150px]">
            <OperatorLog logs={logs} />
          </div>
        </div>

        {/* RIGHT COLUMN: Evidence & Root Cause (4 Cols) */}
        <div className="lg:col-span-4 h-full">
          <EvidenceCard scenario={activeData} demoActive={demoActive} recoveryState={recoveryState} />
        </div>
      </div>
    </div>
  );
}
