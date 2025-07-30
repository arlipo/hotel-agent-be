import { RequestHandler } from "express";
import { getAgentDb, getAgentsDb } from "../database/repository";
import { handleApiError } from "../utils/apiUtils";
import { errored, isErrored, zodSafeParse } from "../utils/probablyUtils";
import { AgentDtoSchema, AgentQuestionSchema } from "../types/agents";
import { askAgent, createAgent } from "../services/agents";


export const getAgentsController: RequestHandler = async (req, res, next) => {
    const agentsPr = await getAgentsDb()

    if (isErrored(agentsPr)) {
        handleApiError(agentsPr, "Failed to retrieve agents: ")(req, res, next)
        return
    }

    res.status(200).json({ agents: agentsPr.returned });
}

export const getAgentController: RequestHandler = async (req, res, next) => {
    const { id } = req.params;

    // Validate inputs
    if (!id) {
        handleApiError(errored('Invalid input. Agent ID is required.'))(req, res, next)
        return
    }

    const agentPr = await getAgentDb(id)

    if (isErrored(agentPr)) {
        handleApiError(agentPr, "Failed to retrieve agent: ")(req, res, next)
        return
    }

    if (!agentPr.returned) {
        handleApiError(errored('Agent not found', 'expected'))(req, res, next)
        return
    }

    res.status(200).json({ agent: agentPr.returned })
}

export const createAgentController: RequestHandler = async (req, res, next) => {
    const body = req.body;

    const agentDataPr = zodSafeParse(AgentDtoSchema, body)

    // Validate inputs
    if (isErrored(agentDataPr)) {
        handleApiError(agentDataPr, "Invalid body: ")(req, res, next)
        return
    }

    const insertResult = await createAgent(agentDataPr.returned)

    if (isErrored(insertResult)) {
        handleApiError(insertResult, "Failed to create agent: ")(req, res, next)
        return
    }

    res.status(201).json({ agent: insertResult.returned })
}

export const askAgentController: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;

    const requestDataPr = zodSafeParse(AgentQuestionSchema, body)

    // Validate inputs
    if (isErrored(requestDataPr)) {
        handleApiError(requestDataPr, "Invalid body: ")(req, res, next)
        return
    }

    if (!id) {
        handleApiError(errored('Invalid input. Agent ID is required.'))(req, res, next)
        return
    }

    const agentFromDbPr = await getAgentDb(id)

    if (isErrored(agentFromDbPr)) {
        handleApiError(agentFromDbPr, "Failed to retrieve agent: ")(req, res, next)
        return
    }

    if (!agentFromDbPr.returned) {
        handleApiError(errored('Agent not found'))(req, res, next)
        return
    }

    const answerPr = await askAgent(agentFromDbPr.returned, requestDataPr.returned.question)


    if (isErrored(answerPr)) {
        handleApiError(answerPr, "Failed to ask agent: ")(req, res, next)
        return
    }

    res.status(200).json({ answer: answerPr.returned })
}