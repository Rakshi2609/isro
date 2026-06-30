"use client";

import { useState, useEffect } from "react";
import { scenarios } from "../data/scenarios";
import { CopilotResponse } from "../types";
import MissionCard from "../components/MissionCard";
import TopologyCard from "../components/TopologyCard";
import PredictionPanel from "../components/PredictionPanel";
import EvidenceCard from "../components/EvidenceCard";
import OperatorLog from "../components/OperatorLog";

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const [demoActive, setDemoActive] = useState(false);
  const [recoveryState, setRecoveryState] = useState<"IDLE" | "REROUTING" | "RESOLVED">("IDLE");
  const [logs, setLogs] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  
  // Custom Query State
  const [customQuery, setCustomQuery] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);

  // The true backend response state
  const [apiResponse, setApiResponse] = useState<CopilotResponse | null>(null);
  const [selectedRecoveryOption, setSelectedRecoveryOption] = useState<string>("");

  const activeScenarioFallback = scenarios.find(s => s.id === activeScenarioId);
  const initialTelemetry = activeScenarioFallback ? activeScenarioFallback.initial_telemetry : {};
  const [activeTelemetry, setActiveTelemetry] = useState(initialTelemetry);

  useEffect(() => {
    // Just resetting the local UI state when selecting a different dropdown option
    setDemoActive(false);
    setRecoveryState("IDLE");
    setLogs([]);
    setToast(null);
    setApiResponse(null);
    if (activeScenarioFallback) {
      setActiveTelemetry(activeScenarioFallback.initial_telemetry);
    }
  }, [activeScenarioId]);

  const addLog = (msg: string) => {
    const now = new Date();
    const timeStr = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    setLogs(prev => [...prev, `${timeStr} ${msg}`]);
  };

  const executeApiCall = async (query: string, telemetry: any) => {
    setIsQuerying(true);
    setApiResponse(null);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          telemetry: telemetry,
          prediction_data: {},
        }),
      });
      
      const data: CopilotResponse = await response.json();
      setIsQuerying(false);
      setApiResponse(data);
      if (data.recovery_options && data.recovery_options.length > 0) {
        setSelectedRecoveryOption(data.recovery_options[0]);
      } else {
        setSelectedRecoveryOption("Generic Sub-50ms Reroute");
      }
      return data;
    } catch (e) {
      setIsQuerying(false);
      console.error(e);
      addLog("ERROR: Connection to API failed.");
      return null;
    }
  };

  const handleRunDemo = async () => {
    setDemoActive(true);
    setRecoveryState("IDLE");
    setLogs([]);
    addLog(`Initiating backend fetch for scenario...`);
    
    // Simulate anomaly
    if (activeScenarioFallback) {
      setActiveTelemetry(activeScenarioFallback.degraded_telemetry);
    }
    
    const data = await executeApiCall(`SCENARIO:${activeScenarioId}`, activeTelemetry);
    if (data) {
      addLog(`Diagnostics generated. Source: ${data.response_source}`);
    }
  };

  const handleCustomQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    
    setDemoActive(true);
    setRecoveryState("IDLE");
    setLogs([]);
    addLog(`Operator Query: ${customQuery}`);
    
    const data = await executeApiCall(customQuery, activeTelemetry);
    if (data) {
      addLog(`Diagnostics generated. Source: ${data.response_source}`);
    }
  };

  const handleSimulate = () => {
    setRecoveryState("REROUTING");
    addLog(`Operator initiated recovery: ${selectedRecoveryOption}`);
    addLog("Calculating dynamic fallback routing constraints...");
    
    setTimeout(() => {
      addLog("Activating backup paths...");
      const successMsg = `Action '${selectedRecoveryOption}' simulated successfully.`;
      addLog(successMsg);
      setRecoveryState("RESOLVED");
      
      // Generic telemetry recovery
      const recovered = { ...activeTelemetry };
      for (const k in recovered) {
        if (k.includes("Loss") || k.includes("Drops") || k.includes("Errors")) recovered[k] = "0";
        if (k.includes("CPU")) recovered[k] = "40%";
        if (k.includes("State")) recovered[k] = "UP/ESTAB";
      }
      setActiveTelemetry(recovered);
      setToast(successMsg);
      
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
            {apiResponse?.response_source && (
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border flex items-center gap-1 mt-1
                ${apiResponse.response_source === 'CACHED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                  'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                {apiResponse.response_source === 'CACHED' ? '🟢 CACHED' : '🟣 AI GENERATED'}
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
          <MissionCard apiResponse={apiResponse} demoActive={demoActive} recoveryState={recoveryState} />
          
          <TopologyCard apiResponse={apiResponse} demoActive={demoActive} recoveryState={recoveryState} />
          
          <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg flex-1">
             <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Active Telemetry</h3>
             <div className="space-y-2">
               {Object.entries(activeTelemetry).map(([key, val]) => {
                 // For UI styling, if it's degraded we want to show it red. 
                 // Since we don't know the exact "initial" value generically, we'll just check if demo is active and idle.
                 const isDegraded = demoActive && recoveryState === 'IDLE' && String(val) !== "0" && String(val) !== "0%" && !String(val).includes("UP") && !String(val).includes("ESTAB");
                 return (
                   <div key={key} className="flex justify-between items-center text-xs font-mono bg-slate-900/50 p-2 rounded border border-slate-800/50">
                     <span className="text-cyan-500">{key}</span>
                     <span className={isDegraded ? 'text-red-400 font-bold' : 'text-slate-300'}>{String(val)}</span>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>

        {/* CENTER COLUMN: Prediction (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <PredictionPanel apiResponse={apiResponse} demoActive={demoActive} recoveryState={recoveryState} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
               <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Required Diagnostics</h3>
               <div className="space-y-2">
                 {apiResponse ? apiResponse.cli_commands.map((cmd, i) => (
                   <div key={i} className="font-mono text-[10px] text-emerald-400 bg-slate-900/50 p-2 rounded border border-slate-800 overflow-x-auto whitespace-nowrap">
                     <span className="text-slate-600 mr-2">$</span>{cmd}
                   </div>
                 )) : (
                   <div className="text-xs text-slate-600 italic">Awaiting AI diagnostic commands...</div>
                 )}
               </div>
            </div>
            
            <div className="bg-[#0d111c] border border-blue-900/40 rounded-xl p-5 shadow-[0_0_20px_rgba(37,99,235,0.1)] flex flex-col justify-center items-center text-center">
               <h3 className="text-sm font-bold text-slate-200 mb-2">What-If Simulation</h3>
               
               {apiResponse && apiResponse.recovery_options && apiResponse.recovery_options.length > 0 ? (
                 <select 
                   value={selectedRecoveryOption}
                   onChange={(e) => setSelectedRecoveryOption(e.target.value)}
                   disabled={!demoActive || recoveryState !== "IDLE"}
                   className="w-full bg-slate-900 border border-slate-700 text-[10px] rounded p-2 text-cyan-400 outline-none focus:border-cyan-500 mb-3"
                 >
                   {apiResponse.recovery_options.map((opt, i) => (
                     <option key={i} value={opt}>{opt}</option>
                   ))}
                 </select>
               ) : (
                 <p className="text-[10px] text-slate-400 mb-4">Virtually test the fallback routing path before executing on live hardware.</p>
               )}

               <button 
                 onClick={handleSimulate}
                 disabled={!apiResponse || recoveryState !== "IDLE"}
                 className={`w-full py-2.5 rounded font-bold text-xs uppercase tracking-wide transition-all flex justify-center items-center gap-2
                 ${recoveryState === 'RESOLVED' ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/30' : 
                   recoveryState === 'REROUTING' ? 'bg-blue-600/50 text-white cursor-wait' : 
                   apiResponse ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
               >
                 {recoveryState === 'RESOLVED' ? (
                   <>✓ Recovery Simulated</>
                 ) : recoveryState === 'REROUTING' ? (
                   <><svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Testing Reroute...</>
                 ) : (
                   <>▶ Simulate Action</>
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
          <EvidenceCard apiResponse={apiResponse} demoActive={demoActive} recoveryState={recoveryState} />
        </div>
      </div>
    </div>
  );
}
