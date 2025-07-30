import winkNLP, { ItsFunction } from 'wink-nlp';
import winkBM25 from "wink-bm25-text-search";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// You must install the model with:
// node -e "require('wink-nlp/models/install')('wink-eng-lite-model')"
const model = require('wink-eng-lite-model');

const nlp = winkNLP(model);
const its = nlp.its;

// Initialize BM25 engine
const bm25 = winkBM25();


export function initBmEngine() {
    bm25.reset();

    bm25.defineConfig({ fldWeights: { title: 1 } });

    // Preprocessing using wink-nlp with enhanced fuzzy matching
    const preprocess = (text: string): string[] => {
        const doc = nlp.readDoc(text);
        const tokens = doc.tokens()
            .filter((t) => t.out(its.type) === 'word' && !t.out(its.stopWordFlag));
        
        const stems = tokens.out(its.stem as ItsFunction<string>);
        const normalTokens = tokens.out(its.normal as ItsFunction<string>);
        
        // Generate n-grams for fuzzy matching (2-grams and 3-grams)
        const generateNGrams = (str: string, n: number): string[] => {
            if (str.length < n) return [str];
            const ngrams: string[] = [];
            for (let i = 0; i <= str.length - n; i++) {
                ngrams.push(str.slice(i, i + n));
            }
            return ngrams;
        };
        
        // Add character n-grams for fuzzy matching
        const ngrams: string[] = [];
        normalTokens.forEach(token => {
            if (token.length > 3) { // Only add n-grams for longer words
                ngrams.push(...generateNGrams(token.toLowerCase(), 2));
                ngrams.push(...generateNGrams(token.toLowerCase(), 3));
            }
        });
        
        // Combine stems, normal tokens, and n-grams for better fuzzy matching
        return [...stems, ...normalTokens, ...ngrams].filter(Boolean);
    };

    bm25.definePrepTasks([preprocess]);
}

export function addDocs(docs: { title: string, id: number }[]) {
    docs.forEach(doc => {
        bm25.addDoc(doc, doc.id);
    });
    bm25.consolidate();
}

export function searchDocs(query: string) {
    const searchResults = bm25.search(query);
    return searchResults.map(([docId, score]) => {
        const id = parseInt(docId, 10);
        return {
            id,
            score
        }
    });
}