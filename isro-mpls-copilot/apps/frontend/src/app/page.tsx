"use client";

import { useState } from "react";
import { scenarios } from "../data/scenarios";
import { CopilotResponse } from "../types";
import { useCopilot } from "../context/CopilotContext";
import MissionCard from "../components/MissionCard";
import TopologyCard from "../components/TopologyCard";

export default function Home() {
  const { 
    apiResponse, setApiResponse, 
    activeTelemetry, setActiveTelemetry, 
    demoActive, setDemoActive, 
    recoveryState, setRecoveryState, 
    addLog, clearLogs, 
    isQuerying, setIsQuerying 
  } = useCopilot();

  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const [customQuery, setCustomQuery] = useState("");

  const handleRunDemo = async () => {
    const scenarioData = scenarios.find(s => s.id === activeScenarioId);
    if (!scenarioData) return;

    setDemoActive(true);
    setRecoveryState("IDLE");
    clearLogs();
    
    // Set initial degraded telemetry for the UI
    setActiveTelemetry(scenarioData.degraded_telemetry);
    addLog(`Initiating scenario: ${scenarioData.name}`);
    addLog(`Hitting Level 1 Fast Cache...`);

    setIsQuerying(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `SCENARIO:${activeScenarioId}`,
          telemetry: scenarioData.degraded_telemetry,
          prediction_data: {},
        }),
      });
      
      const data: CopilotResponse = await response.json();
      setIsQuerying(false);
      setApiResponse(data);
      addLog(`Copilot diagnostics retrieved instantly from cache. Source: ${data.response_source}`);
    } catch (e) {
      setIsQuerying(false);
      console.error(e);
      addLog("ERROR: Connection to API failed.");
    }
  };

  const handleCustomQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    
    setDemoActive(true);
    setRecoveryState("IDLE");
    clearLogs();
    addLog(`Operator Query: ${customQuery}`);
    
    setIsQuerying(true);
    setApiResponse(null);
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
      
      const data: CopilotResponse = await response.json();
      setIsQuerying(false);
      setApiResponse(data);
      addLog(`Diagnostics generated. Source: ${data.response_source}`);
    } catch (e) {
      setIsQuerying(false);
      console.error(e);
      addLog("ERROR: Failed to connect to RAG backend.");
    }
  };

  return (
    <div className="p-4 md:p-8 flex-1 flex flex-col max-w-7xl mx-auto w-full">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Network Overview</h2>
        <p className="text-sm text-slate-500">Global air-gapped topology and live telemetry stream.</p>
        
        {apiResponse?.response_source && (
          <div className={`mt-4 inline-flex text-xs font-bold px-3 py-1 rounded border gap-2 items-center
            ${apiResponse.response_source === 'CACHED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
              'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
            <span className={`w-2 h-2 rounded-full ${apiResponse.response_source === 'CACHED' ? 'bg-emerald-500 animate-pulse' : 'bg-purple-500 animate-pulse'}`}></span>
            {apiResponse.response_source === 'CACHED' ? 'DATA SERVED FROM SEMANTIC CACHE' : 'NOVEL QUERY - FULL LLM GENERATION'}
          </div>
        )}
      </header>

      {/* CHAT BAR & DEMO ROW */}
      <div className="flex flex-col xl:flex-row gap-4 mb-8">
        <form onSubmit={handleCustomQuery} className="flex-1 relative">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <input 
             type="text" 
             value={customQuery}
             onChange={(e) => setCustomQuery(e.target.value)}
             placeholder="Ask Copilot about a live network issue (e.g., 'Why is Gi0/1 flapping?')"
             className="w-full bg-[#0d111c] border border-slate-700 text-slate-200 text-sm rounded-xl pl-12 pr-32 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
             disabled={isQuerying}
           />
           <button 
             type="submit" 
             disabled={isQuerying || !customQuery.trim()}
             className="absolute inset-y-2 right-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold px-6 rounded-lg border border-slate-600 disabled:opacity-50 transition-colors"
           >
             {isQuerying && customQuery !== "" ? 'THINKING...' : 'ANALYZE'}
           </button>
        </form>

        <div className="flex items-center gap-3 bg-[#0d111c] p-2 rounded-xl border border-slate-700 shrink-0">
          <select 
            value={activeScenarioId}
            onChange={(e) => setActiveScenarioId(e.target.value)}
            className="bg-black border border-slate-700 text-sm rounded-lg px-4 py-2.5 text-cyan-400 outline-none focus:border-cyan-500 w-[240px]"
          >
            {scenarios.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button 
            onClick={handleRunDemo}
            disabled={isQuerying}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-blue-900/20 whitespace-nowrap flex items-center gap-2 transition-all"
          >
            {isQuerying && customQuery === "" ? '...' : '▶ Run Demo'}
          </button>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="space-y-8 flex flex-col">
          <TopologyCard apiResponse={apiResponse} demoActive={demoActive} recoveryState={recoveryState} />
        </div>
        
        <div className="space-y-8 flex flex-col">
          <MissionCard apiResponse={apiResponse} demoActive={demoActive} recoveryState={recoveryState} />
          
          <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-6 shadow-lg flex-1">
             <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-2">
               <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
               Live Telemetry Stream
             </h3>
             <div className="space-y-3">
               {Object.keys(activeTelemetry).length === 0 ? (
                 <div className="text-sm text-slate-600 flex items-center justify-center h-full py-10">Waiting for stream...</div>
               ) : (
                 Object.entries(activeTelemetry).map(([key, val]) => {
                   const isDegraded = demoActive && recoveryState === 'IDLE' && String(val) !== "0" && String(val) !== "0%" && !String(val).includes("UP") && !String(val).includes("ESTAB");
                   return (
                     <div key={key} className="flex justify-between items-center text-sm font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                       <span className="text-cyan-500">{key}</span>
                       <span className={isDegraded ? 'text-red-400 font-bold' : 'text-slate-300'}>{String(val)}</span>
                     </div>
                   );
                 })
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
