import { useState } from 'react';
import { TreeNodeData } from '@/types';
import { ChevronRight, Plus, Pencil, Trash2, Copy, AlertCircle } from 'lucide-react';
import { AddFieldModal, EditValueModal, ConfirmDeleteModal } from './modals/ActionModals';

interface TreeNodeProps {
  node: TreeNodeData;
  onExpand?: (path: string) => Promise<void>;
  level?: number;
  isLast?: boolean;
  canWrite?: boolean;
  onUpdate?: (path: string, newValue: any) => void;
  onDelete?: (path: string) => void;
  onAddChild?: (path: string, key: string, value: any) => void;
  searchTerm?: string;
}

const SENSITIVE_KEYS = ['email', 'password', 'token', 'secret', 'apikey', 'key', 'auth', 'session', 'credential', 'stripe'];

function isSensitive(key: string) {
  const k = String(key).toLowerCase();
  return SENSITIVE_KEYS.some(sk => k.includes(sk));
}

function getValueColor(type: string) {
  switch (type) {
    case 'string': return 'text-emerald-600 font-medium';
    case 'number': return 'text-blue-600 font-medium';
    case 'boolean': return 'text-purple-600 font-medium';
    case 'null': return 'text-gray-400 italic';
    default: return 'text-gray-900';
  }
}

export default function TreeNode({ node, onExpand, level = 0, isLast = true, canWrite, onUpdate, onDelete, onAddChild, searchTerm }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Modal States
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [renderLimit, setRenderLimit] = useState(50);

  const indent = level * 24;
  const isObj = node.type === 'object' || node.type === 'array';
  
  // Apply filtering if searchTerm is provided
  const childKeys = (node.children || []).filter(child => {
    if (!searchTerm) return true;
    return child.key.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Provide a heuristic preview of items
  const childrenCount = childKeys.length;
  
  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpanded && onExpand && !node.isLeaf && (!node.isLoaded || childrenCount === 0)) {
      setIsLoading(true);
      try {
        await onExpand(node.path);
      } finally {
        setIsLoading(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(node.value));
  };

  const renderValue = () => {
    if (isObj) {
      if (isExpanded) {
        return <span className="text-gray-400 text-[13px] ml-1">{node.type === 'array' ? '[' : '{'}</span>;
      } else {
        const previewText = childrenCount > 0 ? `${childrenCount} ${childrenCount === 1 ? 'item' : 'items'}` : 'expand';
        return (
           <span className="text-gray-500 text-[12px] ml-1 bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer hover:bg-gray-200 transition-colors" onClick={handleToggle}>
             {node.type === 'array' ? `[ ${previewText} ]` : `{ ${previewText} }`}
           </span>
        );
      }
    }
    
    let displayValue = String(node.value);
    if (node.type === 'string') displayValue = `"${displayValue}"`;
    if (node.type === 'null') displayValue = 'null';
    
    return <span className={`text-[13px] ${getValueColor(node.type)} ml-1`}>{displayValue}</span>;
  };

  const sensitive = isSensitive(node.key);

  const visibleChildren = childKeys.slice(0, renderLimit);
  const hasMore = childKeys.length > renderLimit;

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      <div 
        className="flex items-center hover:bg-[#f1f5f9] py-1 rounded transition-colors group relative -ml-2 pr-2"
        style={{ paddingLeft: `${indent + 8}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
           className="w-5 flex items-center justify-center flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600" 
           onClick={!node.isLeaf ? handleToggle : undefined}
        >
          {!node.isLeaf && (
            isLoading ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
            ) : (
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-gray-600' : ''}`} />
            )
          )}
        </div>
        
        <div className="flex items-center min-w-0 pr-2 cursor-pointer" onClick={isObj ? handleToggle : () => setShowEdit(true)}>
          <span 
            className={`font-semibold mr-0.5 truncate max-w-xs ${sensitive ? 'bg-red-50 text-red-700 px-1 rounded-sm border border-red-100 flex items-center gap-1' : 'text-[#1e293b]'}`}
            title={sensitive ? 'Protected/Sensitive Key' : ''}
          >
            {sensitive && <AlertCircle className="w-3 h-3 text-red-500 inline-block" />}
            {node.key === '/' ? 'root' : `${node.key}`}
          </span>
          <span className="text-gray-400 font-medium">:</span>
          {renderValue()}
          {!isLast && !isExpanded && <span className="text-gray-400 font-medium select-none">,</span>}
        </div>

        {/* Hover Actions */}
        <div className={`absolute right-2 flex items-center gap-1 bg-white shadow-sm border border-gray-200 rounded-md py-0.5 px-1 transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button onClick={handleCopy} className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded transition-colors" title="Copy Value">
             <Copy className="w-3.5 h-3.5" />
          </button>
          
          {canWrite && (
             <>
               {isObj && (
                 <button onClick={() => setShowAdd(true)} className="p-1 hover:bg-emerald-50 text-emerald-500 rounded transition-colors" title="Add Child">
                   <Plus className="w-3.5 h-3.5" />
                 </button>
               )}
               <button onClick={() => setShowEdit(true)} className="p-1 hover:bg-blue-50 text-blue-500 rounded transition-colors" title="Edit">
                 <Pencil className="w-3.5 h-3.5" />
               </button>
               {node.path !== '/' && (
                 <button onClick={() => setShowDelete(true)} className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors" title="Delete">
                   <Trash2 className="w-3.5 h-3.5" />
                 </button>
               )}
             </>
          )}
        </div>
      </div>

      {isExpanded && !node.isLeaf && (
        <div className="border-l border-gray-100 relative left-[10px] ml-[24px]">
          {visibleChildren.map((child, idx) => (
            <TreeNode 
              key={`${child.path}-${idx}`} 
              node={child} 
              onExpand={onExpand} 
              level={level + 1} 
              isLast={idx === visibleChildren.length - 1 && !hasMore}
              canWrite={canWrite}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
              searchTerm={searchTerm}
            />
          ))}
          {hasMore && (
            <button 
              onClick={() => setRenderLimit(prev => prev + 50)}
              style={{ marginLeft: `${indent + 24}px` }}
              className="mt-1 px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
            >
              Load {Math.min(50, childKeys.length - renderLimit)} more...
            </button>
          )}
          <div style={{ paddingLeft: `${indent + 24}px` }} className="text-gray-400 text-[13px] absolute -bottom-5 -ml-[34px]">
            {node.type === 'array' ? ']' : '}'}{!isLast && ','}
          </div>
        </div>
      )}
      
      {/* Spacer for the closing brace if expanded */}
      {isExpanded && !node.isLeaf && <div className="h-5" />}

      {/* Modals */}
      {canWrite && (
         <>
          <AddFieldModal isOpen={showAdd} onClose={() => setShowAdd(false)} parentPath={node.path} onConfirm={(key: string, val: any) => onAddChild?.(node.path, key, val)} />
          <EditValueModal isOpen={showEdit} onClose={() => setShowEdit(false)} path={node.path} currentValue={node.value} currentType={node.type} onConfirm={(val: any) => onUpdate?.(node.path, val)} />
          <ConfirmDeleteModal isOpen={showDelete} onClose={() => setShowDelete(false)} path={node.path} onConfirm={() => onDelete?.(node.path)} />
         </>
      )}
    </div>
  );
}
