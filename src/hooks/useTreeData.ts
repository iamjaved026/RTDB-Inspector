import { useState } from 'react';

// Helper to set a nested value safely
function setNestedValue(obj: any, path: string, value: any) {
  if (!obj) obj = {};
  if (path === '/') return value; // Replacing root
  
  const parts = path.split('/').filter(Boolean);
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof current[parts[i]] !== 'object' || current[parts[i]] === null) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  
  current[parts[parts.length - 1]] = value;
  return obj;
}

// Helper to delete nested value
function deleteNestedValue(obj: any, path: string) {
  if (path === '/') return null; 
  
  const parts = path.split('/').filter(Boolean);
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) return obj;
    current = current[parts[i]];
  }
  
  delete current[parts[parts.length - 1]];
  return obj;
}

export function useTreeData() {
  const [data, setData] = useState<any>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const fetchRootData = async (url: string) => {
    setCurrentUrl(url);
    try {
      // First root fetch is shallow to avoid downloading massive DBs
      const resp = await fetch(`/api/data?url=${encodeURIComponent(url)}&shallow=true`);
      const result = await resp.json();
      if (resp.ok) {
        setData(result.data);
      }
    } catch (e) {
      console.error("Root fetch failed:", e);
      setData(null);
    }
  };

  const expandNode = async (path: string) => {
    if (!currentUrl) return;
    try {
      // Deep fetch for exactly this path (not shallow) so we get keys AND primitive values instantly!
      const resp = await fetch(`/api/data?url=${encodeURIComponent(currentUrl)}&path=${encodeURIComponent(path)}`);
      const result = await resp.json();
      
      if (resp.ok) {
        setData((prevData: any) => {
          const newData = JSON.parse(JSON.stringify(prevData || {}));
          return setNestedValue(newData, path, result.data);
        });
      }
    } catch (e) {
      console.error("Expand node failed:", e);
    }
  };

  const refreshNode = async (path: string) => {
     await expandNode(path);
  };

  const localUpdate = (path: string, newValue: any) => {
    setData((prevData: any) => {
      const newData = JSON.parse(JSON.stringify(prevData || {}));
      return setNestedValue(newData, path, newValue);
    });
  };

  const localDelete = (path: string) => {
     setData((prevData: any) => {
      const newData = JSON.parse(JSON.stringify(prevData || {}));
      return deleteNestedValue(newData, path);
    });
  };

  return { data, fetchRootData, expandNode, refreshNode, localUpdate, localDelete };
}
