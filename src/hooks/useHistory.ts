import { useState, useEffect } from 'react';

export interface HistoryItem {
  url: string;
  timestamp: number;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem('rtdb_inspector_history');
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  const addUrlToHistory = (url: string) => {
    try {
      if (typeof window === 'undefined') return;
      const stored = window.localStorage.getItem('rtdb_inspector_history');
      let currentHistory: HistoryItem[] = stored ? JSON.parse(stored) : [];
      
      // Remove if it exists to put it at the top
      currentHistory = currentHistory.filter(item => item.url !== url);
      
      const newItem = { url, timestamp: Date.now() };
      currentHistory.unshift(newItem);
      
      // Keep only last 20 items
      currentHistory = currentHistory.slice(0, 20);
      
      window.localStorage.setItem('rtdb_inspector_history', JSON.stringify(currentHistory));
      setHistory(currentHistory);
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const clearHistory = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('rtdb_inspector_history');
    }
    setHistory([]);
  };

  return { history, addUrlToHistory, clearHistory };
}
