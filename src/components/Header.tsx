import { Globe, Lock, Unlock, Menu } from 'lucide-react';

interface HeaderProps {
  url?: string;
  isReadPublic?: boolean;
  onMenuClick?: () => void;
}

export default function Header({ url, isReadPublic, onMenuClick }: HeaderProps) {
  return (
    <header className="h-14 border-b border-gray-200 bg-white sticky top-0 z-40 flex items-center px-4 md:px-6 justify-between flex-shrink-0 w-full">
      <div className="flex items-center gap-3 w-2/3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-1.5 -ml-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        {url ? (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md max-w-full overflow-hidden">
            <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate font-mono text-[13px]">{url}</span>
          </div>
        ) : (
          <div className="text-sm text-gray-400 font-medium tracking-tight">RTDB Inspector Dashboard</div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {url && isReadPublic !== undefined && (
          <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${isReadPublic ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
            {isReadPublic ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {isReadPublic ? 'Public Read' : 'Restricted'}
          </div>
        )}
      </div>
    </header>
  );
}
