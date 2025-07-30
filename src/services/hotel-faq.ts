import { hotelFAQ } from "../config/hotel-faq";
import { ScoredFAQ } from "../types/hotel-faq";
import { addDocs, initBmEngine, searchDocs } from "./wink";



export function insertFAQIntoWink() {
    addDocs(hotelFAQ.map(f => ({ title: f.question, id: f.id })));
}


export function searchFAQ(query: string): ScoredFAQ[] {
    const scoredIds = searchDocs(query);
    const scored = scoredIds.map(r => {
        const faq = hotelFAQ.find(f => f.id === r.id);

        return faq && {
            ...faq,
            score: r.score
        };
    })

    return scored.filter(f => f !== undefined);
}