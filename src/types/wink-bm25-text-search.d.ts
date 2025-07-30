declare module 'wink-bm25-text-search' {
    type Doc = Record<string, any>;
  
    type PrepTask = (text: string) => string[];
  
    interface BM25Engine {
      defineConfig: (config: { fldWeights: Record<string, number> }) => void;
      definePrepTasks: (tasks: PrepTask[]) => void;
      addDoc: (doc: Doc, id: number) => void;
      consolidate: () => void;
      search: (query: string) => Array<[string, number]>;
      reset: () => void;
    }
  
    export default function winkBM25(): BM25Engine;
  }