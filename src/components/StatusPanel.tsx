import { AnalysisResult } from '@/types';
import { ShieldCheck, ShieldAlert, Key, Globe, EyeOff, Eye, Clock } from 'lucide-react';

function StatusItem({ label, status, icon: Icon, latency, reverseColors = false }: any) {
  const isGood = reverseColors ? !status : status;
  
  return (
    <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg border border-gray-100 flex-1 min-w-[200px]">
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${isGood ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
           <div className="text-[12px] font-semibold text-gray-700 tracking-tight leading-none">{label}</div>
           {latency !== undefined && latency > 0 && (
             <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
               <Clock className="w-3 h-3" /> {latency}ms
             </div>
           )}
        </div>
      </div>
      <div className={`text-[13px] font-semibold ${status ? (isGood ? 'text-emerald-600' : 'text-amber-600') : (isGood ? 'text-emerald-600' : 'text-rose-600')}`}>
         {status ? (label === 'Rules Visiblity' ? 'Public' : 'Allowed') : (label === 'Rules Visiblity' ? 'Hidden' : 'Denied')}
      </div>
    </div>
  );
}

export default function StatusPanel({ result }: { result: AnalysisResult }) {
  // Compute overall security score logic based on permissions
  const rulesExposed = result.rulesVisible;
  const isPublicRead = result.read;
  const isPublicWrite = result.write;

  let scoreText = 'Secure';
  let scoreColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  
  if (isPublicRead && isPublicWrite) {
    scoreText = 'Critical Risk (Open DB)';
    scoreColor = 'text-rose-600 bg-rose-50 border-rose-200';
  } else if (isPublicWrite) {
    scoreText = 'High Risk (Open Write)';
    scoreColor = 'text-rose-600 bg-rose-50 border-rose-200';
  } else if (isPublicRead) {
    scoreText = 'Warning (Public Read)';
    scoreColor = 'text-amber-600 bg-amber-50 border-amber-200';
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#fdfdfd]">
        <h2 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
          Security Findings
        </h2>
        <div className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${scoreColor}`}>
          {scoreText}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <StatusItem label="Read Access" status={result.read} latency={result.latency.read} icon={Globe} />
          <StatusItem label="Write Access" status={result.write} latency={result.latency.write} icon={Key} />
          <StatusItem label="Delete Access" status={result.delete} latency={result.latency.delete} icon={ShieldAlert} />
          <StatusItem label="Rules Visiblity" status={result.rulesVisible} reverseColors={true} icon={rulesExposed ? Eye : EyeOff} />
        </div>

        {result.notes.length > 0 && (
          <div className="bg-[#f8fafc] border border-gray-200 rounded-lg p-4">
            <h3 className="text-[13px] font-bold text-gray-700 mb-2.5 uppercase tracking-wide">
              Smart Analysis Notes
            </h3>
            <ul className="space-y-2">
              {result.notes.map((note, idx) => {
                const isRisk = note.toLowerCase().includes('open') || note.toLowerCase().includes('allowed');
                return (
                  <li key={idx} className="text-[13px] text-gray-700 flex items-start gap-2.5 leading-relaxed">
                    <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isRisk ? 'bg-amber-400' : 'bg-blue-400'}`} />
                    <span>{note}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
