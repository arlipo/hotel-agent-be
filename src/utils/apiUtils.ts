import { RequestHandler } from "express"
import { Errored } from "../types/common"
import { logError } from "./logger"



export function handleApiError(err: Errored, prefix: string = ''): RequestHandler {
    return async (req, res) => {
        logError(err, prefix)
        const isExpected = err.errorType == 'expected'
        const code = isExpected ? 400 : 500
        const message = isExpected ? err.message : "Internal Error"
        const error = prefix + message
    
        res.status(code).json({ error });
    }

}