import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ModalWrapperProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function ModalWrapper({ title, isOpen, onClose, children }: ModalWrapperProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AddFieldModal({ isOpen, onClose, onConfirm, parentPath }: any) {
  const [key, setKey] = useState('');
  const [type, setType] = useState('string');
  const [value, setValue] = useState('');

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setKey('');
      setValue('');
      setType('string');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    
    let finalValue: any = value;
    if (type === 'number') finalValue = Number(value);
    if (type === 'boolean') finalValue = value === 'true';
    if (type === 'object') {
      try { finalValue = JSON.parse(value); } 
      catch { finalValue = {}; }
    }
    
    onConfirm(key, finalValue);
    onClose();
  };

  return (
    <ModalWrapper title="Add child node" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Key Name</label>
          <input required type="text" value={key} onChange={e => setKey(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm" placeholder="e.g. status" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm bg-white">
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="object">JSON / Object</option>
            </select>
          </div>
          
          <div>
             <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
             {type === 'boolean' ? (
                <select value={value} onChange={e => setValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm bg-white">
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
             ) : (
                <input required type="text" value={value} onChange={e => setValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm" placeholder={type === 'object' ? '{"a": 1}' : "Value"} />
             )}
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
           Path: <span className="font-mono">{parentPath === '/' ? `/${key}` : `${parentPath}/${key}`}</span>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">Cancel</button>
          <button type="submit" className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none disabled:opacity-50">Add</button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export function EditValueModal({ isOpen, onClose, onConfirm, path, currentValue, currentType }: any) {
  const [value, setValue] = useState(String(currentValue));
  const [type, setType] = useState(currentType || 'string');

  useEffect(() => {
    if (isOpen) {
      if (currentType === 'object' || currentType === 'array') {
        setValue(JSON.stringify(currentValue));
      } else {
        setValue(String(currentValue));
      }
      setType(currentType || 'string');
    }
  }, [isOpen, currentValue, currentType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalValue: any = value;
    if (type === 'number') finalValue = Number(value);
    if (type === 'boolean') finalValue = value === 'true';
    if (type === 'object' || type === 'array') {
      try { finalValue = JSON.parse(value); } 
      catch { finalValue = value; } // Fallback to raw string if bad JSON
    }
    onConfirm(finalValue);
    onClose();
  };

  return (
    <ModalWrapper title="Edit value" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <div className="text-xs font-medium text-gray-500 mb-2 truncate">
              Path: <span className="font-mono text-gray-900">{path}</span>
           </div>
           
           <div className="grid grid-cols-3 gap-3 mb-3">
             <div className="col-span-1">
               <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
               <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm bg-white">
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="object">JSON</option>
               </select>
             </div>
             <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                {type === 'boolean' ? (
                  <select value={value} onChange={e => setValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm bg-white">
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                ) : (
                  <input required type="text" value={value} onChange={e => setValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm" />
                )}
             </div>
           </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">Cancel</button>
          <button type="submit" className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">Save Changes</button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, path }: any) {
  return (
    <ModalWrapper title="Confirm Deletion" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center py-2">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-1">Delete Node?</h4>
        <p className="text-sm text-gray-500 mb-4 px-4 leading-relaxed">
          You are about to permanently delete all data at:<br/>
          <code className="bg-gray-100 text-red-600 px-2 py-0.5 rounded mt-2 block break-all">{path}</code>
        </p>
        <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded mb-4 font-medium">This action cannot be undone manually unless you restore from a backup.</p>

        <div className="flex w-full gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={() => { onConfirm(); onClose(); }} className="flex-1 px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700">Delete</button>
        </div>
      </div>
    </ModalWrapper>
  );
}
