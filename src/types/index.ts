export interface AnalysisResult {
  read: boolean;
  write: boolean;
  delete: boolean;
  patch: boolean;
  rulesVisible: boolean;
  latency: {
    read: number;
    write: number;
    delete: number;
    patch: number;
  };
  dbSize?: string;
  notes: string[];
}

export type TreeNodeType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

export interface TreeNodeData {
  key: string;
  value: any;
  path: string;
  type: TreeNodeType;
  children?: TreeNodeData[];
  isLeaf: boolean;
  isLoaded: boolean;
}

export interface FirebaseSafeTestResult {
  success: boolean;
  error?: string;
  latency?: number;
}
