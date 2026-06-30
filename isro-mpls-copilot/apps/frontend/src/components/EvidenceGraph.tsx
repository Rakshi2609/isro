import { useState, useEffect } from "react";
import { CopilotResponse } from "../types";

export default function EvidenceGraph({ apiResponse }: { apiResponse: CopilotResponse | null }) {
  const [replayStep, setReplayStep] = useState(6); // 0 to 6
  const [isReplaying, setIsReplaying] = useState(false);

  useEffect(() => {
    if (!apiResponse) return;
    setReplayStep(6); // Reset to full on new response
  }, [apiResponse]);

  const handleReplay = () => {
    if (isReplaying) return;
    setIsReplaying(true);
    setReplayStep(0);
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      setReplayStep(currentStep);
      if (currentStep >= 6) {
        clearInterval(interval);
        setIsReplaying(false);
      }
    }, 500); // 3 seconds total
  };

  if (!apiResponse) {
    return (
      <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-8 shadow-lg flex flex-col justify-center items-center text-center opacity-50 min-h-[300px]">
        <span className="text-xs text-slate-500 uppercase tracking-widest animate-pulse">Awaiting Evidence Graph</span>
      </div>
    );
  }

  const Node = ({ title, desc, step, activeIcon }: { title: string, desc: string, step: number, activeIcon: string }) => {
    const active = replayStep >= step;
    return (
      <div className={`relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300 w-32
        ${active ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-slate-200' : 'bg-[#090b14] border-slate-800 text-slate-600'}`}>
        <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${active ? 'text-cyan-400' : 'text-slate-600'}`}>{title}</div>
        <div className="text-[9px] font-mono opacity-80">{desc}</div>
        {active && (
          <div className="absolute -top-2 -right-2 bg-[#0d111c] rounded-full p-1 border border-slate-800 text-xs">
            {activeIcon}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#0d111c] border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
          Reasoning Pipeline Graph
        </h3>
        <button 
          onClick={handleReplay} 
          disabled={isReplaying}
          className="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-bold uppercase px-3 py-1.5 rounded border border-slate-700 flex items-center gap-1 transition-colors"
        >
          <svg className={`w-3 h-3 ${isReplaying ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Replay Retrieval
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-4">
        {/* Top Level: Data Sources */}
        <div className="flex gap-4 mb-4">
          <Node title="Telemetry" desc="Polled active" step={1} activeIcon="📊" />
          <Node title="Topology" desc="Scope mapped" step={1} activeIcon="🌐" />
          <Node title="Runbooks" desc="Matched #12" step={2} activeIcon="📖" />
        </div>

        {/* Level 2: Ranking */}
        <div className={`w-0.5 h-6 transition-colors duration-300 ${replayStep >= 3 ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>
        <div className="flex gap-4">
          <Node title="Rank Evidence" desc="Scored 94%" step={3} activeIcon="⚖️" />
        </div>

        {/* Level 3: Decision Engine */}
        <div className={`w-0.5 h-6 transition-colors duration-300 ${replayStep >= 4 ? 'bg-purple-500' : 'bg-slate-800'}`}></div>
        <div className="flex gap-4">
          <Node title="Decision Engine" desc="Confidence High" step={4} activeIcon="🧠" />
        </div>

        {/* Level 4: Formatter */}
        <div className={`w-0.5 h-6 transition-colors duration-300 ${replayStep >= 5 ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
        <div className="flex gap-4">
          <Node title="LLM Formatter" desc="Ollama Generated" step={5} activeIcon="🤖" />
        </div>

        {/* Status Text beneath */}
        <div className="mt-8 text-center h-4">
          {isReplaying ? (
             <span className="text-xs text-cyan-400 font-mono animate-pulse">
               {replayStep === 0 && "Initializing context..."}
               {replayStep === 1 && "Aggregating Telemetry & Topology..."}
               {replayStep === 2 && "Matching Runbooks & Incidents..."}
               {replayStep === 3 && "Ranking Evidence..."}
               {replayStep === 4 && "Decision Engine Validating..."}
               {replayStep === 5 && "LLM Formatting Output..."}
             </span>
          ) : (
            <div className="text-[10px] text-slate-500 flex gap-4 justify-center uppercase font-bold">
              <span>Retrieved: 24</span>
              <span>Ranked: 7</span>
              <span>Used: 5</span>
              <span>Discarded: 19</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
