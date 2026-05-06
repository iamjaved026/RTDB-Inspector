import { useState } from 'react';
import { HistoryItem } from '@/hooks/useHistory';

interface URLInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  history?: HistoryItem[];
}

export default function URLInput({ onAnalyze, isLoading, history = [] }: URLInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze(url.trim());
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full relative shadow-sm rounded-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="block w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-xl leading-5 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-shadow"
          placeholder="https://your-project-default-rtdb.firebaseio.com"
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze URL'
            )}
          </button>
        </div>
      </form>
      
      {history.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Recent:</span>
          {history.slice(0, 3).map((item, idx) => {
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
                onClick={() => {
                  setUrl(item.url);
                  onAnalyze(item.url);
                }}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
