import { FALLBACK_ANSWER } from "../config/hotel-faq";
import { insertAgentDb } from "../database/repository";
import { AgentDto } from "../types/agents";
import { Probably } from "../types/common";
import { Agent } from "../types/repository";
import { logger } from "../utils/logger";
import { errored, flatMapProbably, mapProbably, successful } from "../utils/probablyUtils";
import { searchFAQ } from "./hotel-faq";



export async function createAgent(agentData: AgentDto) {
    const newAgent: Agent = {
        ...agentData,
        id: generateId(),
    };

    return insertAgentDb(newAgent);
}

export function validateAgentForQuestion(agent: Agent): Probably<void> {
    if (agent.type !== 'Support') {
        return errored('Only support agents can answer questions')
    }

    if (agent.status !== 'Active') {
        return errored('Inactive agents cannot answer questions')
    }

    return successful(undefined);
}

export function askAgent(agent: Agent, question: string): Probably<string> {
    return mapProbably(validateAgentForQuestion(agent), () => {
        const answers = searchFAQ(question)
        const filteredAnswers = answers.filter(a => a.score > 5);
        const bestAnswer = filteredAnswers.length > 0 && filteredAnswers.sort((a, b) => b.score - a.score)[0]
        const bestAnswerLog = bestAnswer ? `Best answer: ${bestAnswer.id} with score ${bestAnswer.score}` : 'No suitable answer found';

        logger(`Agent ${agent.id} received question: ${question}. ${bestAnswerLog}`, 'info');

        const finalAnswer = bestAnswer ? bestAnswer.answer : FALLBACK_ANSWER;
        return finalAnswer;
    })
}

function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}