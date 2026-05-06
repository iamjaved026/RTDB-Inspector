import { Database, Search, ShieldAlert, CheckCircle2, Activity, Clock, X, Info } from 'lucide-react';
import { HistoryItem } from '@/hooks/useHistory';

export type TabKey = 'analyzer' | 'explorer' | 'rules';

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  isConnected: boolean;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  history?: HistoryItem[];
  onSelectHistory?: (url: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isConnected, isOpen = false, setIsOpen, history = [], onSelectHistory }: SidebarProps) {
  return (
    <aside className={`w-[240px] border-r border-gray-200 bg-[#fafafa] flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-gray-900 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
            <img src="/logo.png" alt="RTDB Inspector Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-semibold text-[14px] tracking-tight text-gray-900">RTDB Inspector</h1>
        </div>
        <button 
          onClick={() => setIsOpen?.(false)}
          className="md:hidden p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 mt-1">
        <div className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">App Menu</div>
        
        <button 
          onClick={() => setActiveTab('analyzer')}
          className={`w-full flex items-center gap-3 px-2 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'analyzer' ? 'bg-gray-200/60 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-200/40 hover:text-gray-900'}`}
        >
          <Search className="w-4 h-4" />
          Analyzer
        </button>
        
        <button 
          onClick={() => setActiveTab('explorer')}
          className={`w-full flex items-center gap-3 px-2 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'explorer' ? 'bg-gray-200/60 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-200/40 hover:text-gray-900'}`}
        >
          <Database className="w-4 h-4" />
          Data Explorer
        </button>

        <button 
          onClick={() => setActiveTab('rules')}
          className={`w-full flex items-center gap-3 px-2 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'rules' ? 'bg-gray-200/60 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-200/40 hover:text-gray-900'}`}
        >
          <ShieldAlert className="w-4 h-4" />
          Rules Viewer
        </button>
      </nav>

      {history && history.length > 0 && (
        <div className="px-3 py-2 flex-1 overflow-y-auto">
          <div className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Recent Results
          </div>
          <div className="space-y-1.5">
            {history.slice(0, 5).map((item, idx) => {
              let name = item.url;
              try {
                const urlObj = new URL(item.url);
                name = urlObj.hostname.split('.')[0];
              } catch (e) {
                // Ignore parsing error, just use the raw string
              }
              return (
                <button
                  key={idx}
                  onClick={() => onSelectHistory?.(item.url)}
                  className="w-full text-left p-2 rounded-md bg-white border border-gray-100 shadow-sm hover:border-gray-300 hover:shadow transition-all group"
                  title={item.url}
                >
                  <p className="text-[13px] font-medium text-gray-800 truncate">{name}</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.url}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-3 py-4 border-t border-gray-200 mt-auto">
        <div className="flex flex-col gap-1">
          <div className="bg-orange-50 border border-orange-100 rounded-md p-2 mb-2 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-orange-800 leading-tight">
              Disclaimer: Use this tool responsibly. Do not access databases you do not own.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium text-gray-500 w-full mt-2">
            {isConnected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600">Connected</span>
              </>
            ) : (
              <>
                <Activity className="w-3.5 h-3.5 text-gray-400" />
                <span>Not Analyzed</span>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
