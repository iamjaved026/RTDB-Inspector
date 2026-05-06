import { useState } from 'react';

export function useFirebaseActions(url: string | null) {
  const [isProcessing, setIsProcessing] = useState(false);

  const addField = async (path: string, key: string, value: any) => {
    if (!url || !path) {
      alert("❌ Error: Invalid URL or Path");
      return false;
    }
    setIsProcessing(true);
    
    // Construct the path for the new child
    const childPath = path === '/' ? `/${key}` : `${path}/${key}`;

    console.log("WRITE:", url, childPath, value);

    try {
      const resp = await fetch('/api/write', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          path: childPath,
          value
        })
      });

      if (!resp.ok) {
         const errorData = await resp.json();
         throw new Error(errorData.error || 'Operation failed');
      }

      alert("✅ Success: Field added successfully");
      setIsProcessing(false);
      return true;
    } catch (e: any) {
      console.error('Failed to add field:', e);
      alert(`❌ Error: ${e.message}`);
      setIsProcessing(false);
      return false;
    }
  };

  const editValue = async (path: string, newValue: any) => {
    if (!url || !path) {
      alert("❌ Error: Invalid URL or Path");
      return false;
    }
    setIsProcessing(true);

    console.log("WRITE (EDIT):", url, path, newValue);

    try {
      const resp = await fetch('/api/write', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          path,
          value: newValue
        })
      });

      if (!resp.ok) {
         const errorData = await resp.json();
         throw new Error(errorData.error || 'Operation failed');
      }

      alert("✅ Success: Value updated successfully");
      setIsProcessing(false);
      return true;
    } catch (e: any) {
      console.error('Failed to edit value:', e);
      alert(`❌ Error: ${e.message}`);
      setIsProcessing(false);
      return false;
    }
  };

  const deleteNode = async (path: string) => {
    if (!url || !path) {
      alert("❌ Error: Invalid URL or Path");
      return false;
    }
    if (path === '/') {
      alert("❌ Error: Deleting the root path is not permitted.");
      return false;
    }
    
    setIsProcessing(true);

    console.log("DELETE:", url, path);

    try {
      const resp = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          path
        })
      });

      if (!resp.ok) {
         const errorData = await resp.json();
         throw new Error(errorData.error || 'Operation failed');
      }

      alert("✅ Success: Node deleted successfully");
      setIsProcessing(false);
      return true;
    } catch (e: any) {
      console.error('Failed to delete node:', e);
      alert(`❌ Error: ${e.message}`);
      setIsProcessing(false);
      return false;
    }
  };

  return { addField, editValue, deleteNode, isProcessing };
}
