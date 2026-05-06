import { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Terminal } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface RulesViewerProps {
  currentUrl: string;
  result: AnalysisResult | null;
}

export default function RulesViewer({ currentUrl, result }: RulesViewerProps) {
  const [rules, setRules] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUrl || !result?.rulesVisible) return;

    const fetchRules = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await fetch(`/api/data?url=${encodeURIComponent(currentUrl)}&path=/.settings/rules.json`);
        const json = await resp.json();
        
        if (resp.ok && json.data) {
          // Format the rules nicely
          setRules(JSON.stringify(json.data, null, 2));
        } else {
          setError("Rules are visible, but couldn't be parsed correctly.");
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRules();
  }, [currentUrl, result]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white border border-gray-200 rounded-xl">
        <Terminal className="w-10 h-10 mb-3 text-gray-300" />
        <p className="text-[13px] font-medium">Analyze a database first</p>
      </div>
    );
  }

  if (!result.rulesVisible) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center flex flex-col items-center justify-center h-64 shadow-sm">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border border-emerald-200 shadow-sm">
           <ShieldCheck className="w-7 h-7 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-emerald-900 mb-2">Rules Protected</h3>
        <p className="text-emerald-700 max-w-md text-[14px] leading-relaxed">
           Security rules are not publicly accessible via the REST API. This is expected and secure behavior. Unauthorized users cannot inspect your rules mapping.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-[#333]">
         <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="text-[13px] font-mono text-gray-300">rules.json</span>
         </div>
         <button 
           onClick={() => {
              if (rules) navigator.clipboard.writeText(rules);
              alert('Copied to clipboard!');
           }} 
           className="text-gray-400 hover:text-white transition-colors p-1"
           title="Copy Rules"
         >
            <Copy className="w-4 h-4" />
         </button>
      </div>
      
      <div className="p-4 overflow-x-auto min-h-[300px]">
        {isLoading ? (
           <div className="animate-pulse flex flex-col gap-2">
              <div className="h-4 bg-gray-700/50 rounded w-1/3"></div>
              <div className="h-4 bg-gray-700/50 rounded w-1/2 ml-4"></div>
              <div className="h-4 bg-gray-700/50 rounded w-2/3 ml-8"></div>
           </div>
        ) : error ? (
           <div className="text-red-400 font-mono text-sm">{error}</div>
        ) : (
           <pre className="text-[13px] font-mono text-[#d4d4d4] leading-relaxed">
             {rules}
           </pre>
        )}
      </div>
    </div>
  );
}
