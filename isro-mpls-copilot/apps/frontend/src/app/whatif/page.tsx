"use client";

import { useState } from "react";
import { useCopilot } from "../../context/CopilotContext";
import OperatorLog from "../../components/OperatorLog";

export default function WhatIfPage() {
  const { 
    apiResponse, 
    demoActive, 
    recoveryState, 
    setRecoveryState, 
    activeTelemetry, 
    setActiveTelemetry,
    addLog,
    logs
  } = useCopilot();

  const [selectedRecoveryOption, setSelectedRecoveryOption] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);

  const handleSimulate = () => {
    if (!apiResponse) return;
    
    const action = selectedRecoveryOption || apiResponse.recovery_options[0] || "Generic Mitigation";
    
    setRecoveryState("REROUTING");
    addLog(`Operator initiated recovery: ${action}`);
    addLog("Calculating dynamic fallback routing constraints...");
    
    setTimeout(() => {
      addLog("Activating backup paths...");
      const successMsg = `Action '${action}' simulated successfully.`;
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
    <div className="p-4 md:p-8 flex-1 flex flex-col max-w-7xl mx-auto w-full relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900/90 border border-emerald-500 text-emerald-400 px-6 py-3 rounded-lg shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      <header className="mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">What-If Simulation Engine</h2>
        <p className="text-sm text-slate-500">Pre-compute network states and execute safe rollbacks before committing to production.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        
        <div className="space-y-8 flex flex-col">
          <div className="bg-black border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden flex flex-col">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
             <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-2">
               <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               Required Pre-Flight Diagnostics
             </h3>
             <div className="space-y-3">
               {apiResponse ? apiResponse.cli_commands.map((cmd, i) => (
                 <div key={i} className="font-mono text-xs text-emerald-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800 overflow-x-auto whitespace-nowrap">
                   <span className="text-slate-600 mr-3">$</span>{cmd}
                 </div>
               )) : (
                 <div className="text-sm text-slate-600 italic py-6 text-center">Awaiting AI diagnostic commands...</div>
               )}
             </div>
          </div>
          
          <div className="bg-[#0d111c] border border-blue-900/40 rounded-xl p-8 shadow-[0_0_30px_rgba(37,99,235,0.1)] flex flex-col justify-center items-center text-center flex-1">
             <h3 className="text-lg font-bold text-slate-200 mb-3">Execute What-If Simulation</h3>
             
             {apiResponse && apiResponse.recovery_options && apiResponse.recovery_options.length > 0 ? (
               <div className="w-full max-w-md mt-4 mb-6">
                 <label className="block text-left text-[10px] text-slate-500 uppercase font-bold mb-2">Select Remediation Plan</label>
                 <select 
                   value={selectedRecoveryOption || apiResponse.recovery_options[0]}
                   onChange={(e) => setSelectedRecoveryOption(e.target.value)}
                   disabled={!demoActive || recoveryState !== "IDLE"}
                   className="w-full bg-slate-900 border border-slate-700 text-sm rounded-lg p-3 text-cyan-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-shadow"
                 >
                   {apiResponse.recovery_options.map((opt, i) => (
                     <option key={i} value={opt}>{opt}</option>
                   ))}
                 </select>
               </div>
             ) : (
               <p className="text-sm text-slate-400 mb-8 max-w-sm">Virtually test the fallback routing path before executing on live hardware.</p>
             )}

             <button 
               onClick={handleSimulate}
               disabled={!apiResponse || recoveryState !== "IDLE"}
               className={`w-full max-w-md py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex justify-center items-center gap-3
               ${recoveryState === 'RESOLVED' ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/30' : 
                 recoveryState === 'REROUTING' ? 'bg-blue-600/50 text-white cursor-wait' : 
                 apiResponse ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:-translate-y-1' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
             >
               {recoveryState === 'RESOLVED' ? (
                 <>
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                   Recovery Simulated
                 </>
               ) : recoveryState === 'REROUTING' ? (
                 <>
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 
                   Testing Reroute...
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Simulate Action
                 </>
               )}
             </button>
          </div>
        </div>

        <div className="space-y-8 flex flex-col">
          <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-6 shadow-lg flex-1 min-h-[400px] flex flex-col">
             <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">NOC Operator Log</h3>
             <div className="flex-1 overflow-y-auto">
               <OperatorLog logs={logs} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
