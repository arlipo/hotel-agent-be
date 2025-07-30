export type FAQ = {
    id: number
    question: string
    answer: string
}

export type ScoredFAQ = FAQ & {
    score: number
}