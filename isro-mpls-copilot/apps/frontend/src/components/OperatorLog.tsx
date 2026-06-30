export default function OperatorLog({ logs }: { logs: string[] }) {
  return (
    <div className="bg-black border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
      <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        Operator Log
      </h3>
      
      <div className="flex-1 bg-[#090b14] border border-slate-800 rounded p-3 font-mono text-xs overflow-y-auto space-y-2 max-h-48">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic">No events logged for current session.</div>
        ) : (
          logs.map((log, i) => {
            const timeStr = log.substring(0, 7);
            const msgStr = log.substring(8);
            return (
              <div key={i} className="flex gap-2 animate-in fade-in duration-300">
                <span className="text-slate-500">{timeStr}</span>
                <span className="text-emerald-400">{msgStr}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
