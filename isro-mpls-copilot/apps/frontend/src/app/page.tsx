"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      // Mock telemetry for the hackathon
      const payload = {
        query,
        telemetry: {
          "Gi0/1": { errors: 500, status: "up" },
          "CPU": { utilization: "95%" }
        },
        prediction_data: { anomaly: true, confidence: 0.92 }
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
      setResponse({
        prediction: "Error communicating with backend.",
        confidence: "N/A",
        evidence: "Check if the FastAPI backend is running on port 8000.",
        root_cause: "Connection Error",
        affected_scope: "Frontend Dashboard",
        recommended_actions: ["Run python apps/backend/main.py"],
        cli_commands: [],
        rollback_plan: "N/A",
        references: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              ISRO MPLS Copilot
            </h1>
            <p className="text-slate-400 mt-1">Air-Gapped Predictive Network Operations</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-sm font-medium text-cyan-400 tracking-wider">SECURE OFFLINE MODE</span>
          </div>
        </header>

        {/* Main Interface */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-xl">
              <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Operator Input
              </h2>
              <form onSubmit={handleQuery} className="space-y-4">
                <textarea
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none shadow-inner text-slate-300"
                  rows={4}
                  placeholder="Describe the network anomaly (e.g. 'Interface Gi0/1 is showing high errors...')"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Telemetry...
                    </>
                  ) : (
                    <>
                      Generate Diagnostics
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Mock Telemetry Widget */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-xl">
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                 <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 Active Telemetry Stream
              </h3>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-slate-950/50 border border-slate-800/50">
                  <span className="text-cyan-400">Gi0/1_ERR</span>
                  <span className="text-red-400">500 pkt/s</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-950/50 border border-slate-800/50">
                  <span className="text-cyan-400">CPU_UTIL</span>
                  <span className="text-orange-400">95%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-950/50 border border-slate-800/50">
                  <span className="text-cyan-400">BGP_STATE</span>
                  <span className="text-emerald-400">ESTAB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-2 space-y-6">
            {response ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Core Diagnostic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-xl">
                    <h3 className="text-sm font-semibold text-cyan-500 mb-2 uppercase tracking-wider">Prediction</h3>
                    <p className="text-slate-200">{response.prediction}</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-xl">
                    <h3 className="text-sm font-semibold text-orange-500 mb-2 uppercase tracking-wider">Root Cause</h3>
                    <p className="text-slate-200">{response.root_cause}</p>
                  </div>
                </div>

                {/* Evidence & Scope */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 mb-1">Evidence</h3>
                    <p className="text-slate-300 text-sm bg-slate-950 p-3 rounded-lg border border-slate-800">{response.evidence}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 mb-1">Affected Scope</h3>
                    <p className="text-slate-300 text-sm bg-slate-950 p-3 rounded-lg border border-slate-800">{response.affected_scope}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
                    <span className="text-sm text-slate-500">Confidence Score:</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {response.confidence}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-slate-900/50 border border-blue-900/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Recommended Actions</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <ul className="space-y-3">
                      {response.recommended_actions?.map((action: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-300">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-medium text-xs border border-blue-500/20">
                            {i + 1}
                          </span>
                          <span className="pt-0.5">{action}</span>
                        </li>
                      ))}
                    </ul>

                    {response.cli_commands?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Required CLI Commands</h4>
                        <div className="bg-black/60 rounded-lg p-3 font-mono text-sm text-emerald-400 border border-slate-800">
                          {response.cli_commands.map((cmd: string, i: number) => (
                            <div key={i} className="flex gap-2">
                              <span className="text-slate-600 select-none">$</span>
                              {cmd}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20 shadow-inner">
                <svg className="w-16 h-16 text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <h3 className="text-lg font-medium text-slate-400 mb-2">Awaiting Telemetry Query</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Input network anomalies or symptoms in the operator panel to generate an AI-driven investigation plan using offline data.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
