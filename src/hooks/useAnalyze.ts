import { useState } from 'react';
import { AnalysisResult } from '@/types';

export function useAnalyze() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || data.details || 'Analysis failed');
      }

      setResult(data);
      return data;
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
        setError('Please check the URL. The database might not exist, could be shut down, or is unreachable.');
      } else {
        setError(err.message || 'An unexpected error occurred during analysis');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { analyze, result, isLoading, error };
}
