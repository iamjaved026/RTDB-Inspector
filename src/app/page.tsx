'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar, { TabKey } from '@/components/Sidebar';
import URLInput from '@/components/URLInput';
import StatusPanel from '@/components/StatusPanel';
import DataViewer from '@/components/DataViewer';
import WarningBanner from '@/components/WarningBanner';
import RulesViewer from '@/components/RulesViewer';

import { useAnalyze } from '@/hooks/useAnalyze';
import { useTreeData } from '@/hooks/useTreeData';
import { useHistory } from '@/hooks/useHistory';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>('analyzer');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { analyze, result, isLoading: isAnalyzing, error } = useAnalyze();
  const { data, fetchRootData, expandNode, refreshNode, localUpdate, localDelete } = useTreeData();
  const { history, addUrlToHistory } = useHistory();

  const handleAnalyze = async (rawUrl: string) => {
    let url = rawUrl.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    try {
      new URL(url); // Validate
    } catch (e) {
      alert("Invalid URL format. Please enter a valid Firebase Realtime Database URL.");
      return;
    }

    setCurrentUrl(url);
    addUrlToHistory(url);
    const analysisResult = await analyze(url);
    if (analysisResult && analysisResult.read) {
      await fetchRootData(url);
    }
  };

  const isConnected = !!result;

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isConnected={isConnected} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        history={history}
        onSelectHistory={(url) => {
          handleAnalyze(url);
          setIsSidebarOpen(false);
        }}
      />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col md:ml-[240px] min-h-screen max-w-full">
        <Header 
          url={currentUrl} 
          isReadPublic={result?.read} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full flex flex-col">
          {activeTab === 'analyzer' && (
            <div className="max-w-4xl mx-auto w-full space-y-6 flex-1">
              <div className="mb-6 md:mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Analyzer</h2>
                <p className="text-gray-500">Scan a Realtime Database to determine its security posture and rule states.</p>
              </div>
              <WarningBanner />
              <URLInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} history={history} />
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl shadow-sm text-sm animate-in fade-in">
                  <p className="font-semibold mb-1">Analysis Error</p>
                  <p>{error}</p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <StatusPanel result={result} />
                  {result.read && (
                    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
                      <button 
                        onClick={() => setActiveTab('explorer')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                      >
                        Explore Data
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'explorer' && (
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              <div className="mb-4">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Data Explorer</h2>
                <p className="text-gray-500">Interact with your database. Permissions strictly match your analysis results.</p>
              </div>
              
              <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <DataViewer 
                  data={data} 
                  onExpandNode={expandNode} 
                  canWrite={result?.write || false}
                  currentUrl={currentUrl}
                  refreshNode={refreshNode}
                  localUpdate={localUpdate}
                  localDelete={localDelete}
                />
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="max-w-4xl mx-auto w-full space-y-6 flex-1">
               <div className="mb-4">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Rules Viewer</h2>
                <p className="text-gray-500">Inspect the database security rules if they are publicly exposed.</p>
              </div>
              
              <RulesViewer currentUrl={currentUrl} result={result} />
            </div>
          )}
          
          <footer className="mt-auto py-6 border-t border-gray-100 text-center text-sm text-gray-500 w-full mt-12">
            Made with <span className="text-red-500">❤️</span> by{' '}
            <a 
              href="https://github.com/iamjaved026" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
            >
              Javed Hussain
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
