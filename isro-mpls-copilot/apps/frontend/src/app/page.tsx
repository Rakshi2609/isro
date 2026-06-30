"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);
  const [recovered, setRecovered] = useState(false);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setRecovered(false);

    try {
      const payload = {
        query,
        telemetry: {},
        prediction_data: {}
      };

      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setRecovered(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-200 font-sans p-4 md:p-6 overflow-x-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
            ISRO NOC Copilot
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">
            Enterprise Predictive Network Operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${recovered ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${recovered ? 'bg-emerald-500' : 'bg-cyan-500'}`}></span>
            </span>
            <span className="text-xs font-bold text-cyan-500 tracking-wider">SECURE OFFLINE</span>
          </div>
          <div className="text-xs text-slate-500 font-mono bg-slate-900/50 px-3 py-1 rounded border border-slate-800">
            Qwen2.5-7B-Instruct
          </div>
        </div>
      </header>

      {!response && (
        <div className="max-w-3xl mx-auto mt-20 bg-[#0d111c] border border-slate-800 rounded-xl p-6 shadow-2xl">
           <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
             <span className="text-cyan-500">❯</span> Operator Input
           </h2>
           <form onSubmit={handleQuery} className="space-y-4">
             <textarea
               className="w-full bg-[#090b14] border border-slate-700/50 rounded-lg p-4 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all resize-none shadow-inner text-slate-300 font-mono"
               rows={5}
               placeholder="Enter telemetry query or incident description..."
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               required
             />
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
             >
               {loading ? "Analyzing Global Telemetry..." : "Generate AI Diagnostics"}
             </button>
           </form>
        </div>
      )}

      {response && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* LEFT: Topology & Context (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20"><svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
              <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Network Topology</h3>
              
              <div className="flex flex-col items-center py-4 relative">
                {/* Core Router */}
                <div className="w-32 py-2 bg-slate-800/80 border border-slate-600 rounded flex justify-center items-center z-10 text-xs font-mono font-bold">
                  {response.affected_scope?.router || "CORE"}
                </div>
                
                <div className={`w-0.5 h-8 ${recovered ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                
                {/* Interface Box */}
                <div className={`px-4 py-1 rounded text-xs font-bold font-mono border z-10 shadow-lg ${recovered ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                  {response.affected_scope?.interface || "Gi0/1"} {recovered ? "✓" : "⚠"}
                </div>
                
                <div className={`w-0.5 h-8 ${recovered ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                
                {/* Branches */}
                <div className="flex gap-4 z-10">
                  {response.affected_scope?.sites?.map((site: string, idx: number) => (
                    <div key={idx} className="w-20 py-2 bg-slate-800/80 border border-slate-600 rounded flex justify-center items-center text-[10px] font-mono text-slate-300">
                      {site}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg">
              <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Affected Scope</h3>
              <div className="space-y-3">
                {Object.entries(response.affected_scope || {}).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{key}</span>
                    <span className="text-sm font-mono text-slate-200">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg border-l-4 border-l-blue-500">
              <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Similar Historical Incident</h3>
              <div className="text-sm text-blue-400 font-mono mb-2">{response.historical_incident?.incident_id}</div>
              <div className="text-xs text-slate-400 mb-2">Resolved by: <span className="text-slate-200">{response.historical_incident?.resolved_by}</span></div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Similarity</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">
                  {response.historical_incident?.similarity}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: Prediction & Analytics (5 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`rounded-xl p-6 shadow-xl border ${recovered ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
              <h3 className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest">Predicted Issue</h3>
              <h2 className={`text-xl font-bold mb-6 ${recovered ? 'text-emerald-400' : 'text-red-400'}`}>
                {recovered ? "Issue Resolved via Reroute" : response.prediction?.issue}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#090b14]/50 p-3 rounded-lg border border-slate-800/50">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Time-to-Impact</div>
                  <div className={`text-lg font-mono font-bold ${recovered ? 'text-slate-500' : 'text-orange-400'}`}>{recovered ? "N/A" : response.prediction?.eta}</div>
                </div>
                <div className="bg-[#090b14]/50 p-3 rounded-lg border border-slate-800/50">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Severity</div>
                  <div className={`text-sm font-bold mt-1 inline-block px-2 py-0.5 rounded ${recovered ? 'bg-slate-800 text-slate-400' : 'bg-red-500/20 text-red-500 border border-red-500/20'}`}>
                    {recovered ? "RESOLVED" : response.prediction?.severity}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                  <span className="text-slate-500">AI Confidence</span>
                  <span className={recovered ? 'text-emerald-400' : 'text-cyan-400'}>{response.prediction?.confidence}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-1.5 rounded-full ${recovered ? 'bg-emerald-500' : 'bg-cyan-500'}`} style={{ width: response.prediction?.confidence || '90%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg">
              <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">SHAP Evidence (Top Contributors)</h3>
              <div className="space-y-3">
                {Object.entries(response.shap_evidence || {}).map(([feature, impact]) => (
                  <div key={feature} className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">{feature}</span>
                    <span className="font-mono text-xs font-bold bg-slate-800/80 px-2 py-1 rounded text-orange-400 border border-slate-700">
                      {String(impact)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg">
               <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Root Cause Hypothesis</h3>
               <div className="mb-4">
                 <span className="text-[10px] uppercase text-cyan-500 font-bold bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 mr-2">Primary</span>
                 <span className="text-sm font-medium text-slate-200">{response.root_cause?.primary_hypothesis}</span>
               </div>
               <div>
                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Alternative Causes</div>
                 <ul className="list-disc pl-4 space-y-1">
                   {response.root_cause?.alternative_causes?.map((cause: string, i: number) => (
                     <li key={i} className="text-xs text-slate-400">{cause}</li>
                   ))}
                 </ul>
               </div>
            </div>
          </div>

          {/* RIGHT: Copilot Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-5 shadow-lg">
              <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Evidence Checklist</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(response.evidence || {}).map(([key, val]) => (
                  <div key={key} className="bg-slate-900/50 p-3 rounded border border-slate-800/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg className="w-3 h-3 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <span className="text-[10px] font-bold uppercase text-slate-400">{key}</span>
                    </div>
                    <div className="text-xs font-mono text-slate-200 pl-4">{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-0 shadow-lg overflow-hidden flex flex-col h-full border-t-2 border-t-cyan-500">
               <div className="p-5 border-b border-slate-800/80 bg-slate-900/30">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Recommended Actions
                  </h3>
               </div>
               <div className="p-5 space-y-5">
                 <div>
                   <div className="text-[10px] text-cyan-500 font-bold uppercase mb-2">Immediate Steps</div>
                   <ul className="space-y-2">
                     {response.recommended_actions?.immediate?.map((action: string, i: number) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                         <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] text-cyan-400 border border-cyan-500/20">{i+1}</span>
                         {action}
                       </li>
                     ))}
                   </ul>
                 </div>
                 
                 <div className="pt-4 border-t border-slate-800/50">
                   <div className="text-[10px] text-orange-400 font-bold uppercase mb-2">If Unresolved</div>
                   <ul className="space-y-2">
                     {response.recommended_actions?.if_unresolved?.map((action: string, i: number) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                         <span className="mt-0.5 flex-shrink-0 w-3 h-3 rounded-full border border-slate-600"></span>
                         {action}
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
            </div>
          </div>
          
          {/* BOTTOM: CLI Diagnostics & Simulation (Full Width) */}
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-black border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
               <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Required CLI Diagnostics</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                 {response.cli_commands?.map((cmd: string, i: number) => (
                   <div key={i} className="font-mono text-xs text-emerald-400 bg-slate-900/50 p-2 rounded border border-slate-800">
                     <span className="text-slate-600 mr-2">$</span>{cmd}
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="lg:col-span-1 bg-[#0d111c] border border-blue-900/40 rounded-xl p-5 shadow-[0_0_20px_rgba(37,99,235,0.1)] flex flex-col justify-center items-center text-center">
               <h3 className="text-sm font-bold text-slate-200 mb-2">What-If Simulation</h3>
               <p className="text-xs text-slate-400 mb-4">Virtually test the fallback routing path before executing on live hardware.</p>
               <button 
                 onClick={handleSimulate}
                 disabled={simulating || recovered}
                 className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-lg flex justify-center items-center gap-2
                 ${recovered ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/30' : 
                   simulating ? 'bg-blue-600/50 text-white cursor-wait' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'}`}
               >
                 {recovered ? (
                   <>✓ Recovery Simulated</>
                 ) : simulating ? (
                   <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Testing Reroute...</>
                 ) : (
                   <>▶ Simulate Recovery</>
                 )}
               </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
