import { ZodType } from "zod"
import { Succeeded, ErrorType, Errored, Probably } from "../types/common"

export function successful<T>(t: T): Succeeded<T> {
    return { resultType: 'success', returned: t }
}

export function errored(message: string, errorType: ErrorType = 'expected'): Errored {
    return { resultType: 'error', message, errorType }
}

export function isSuccessfull<T>(p: Probably<T>): p is Succeeded<T> {
    return p.resultType == 'success'
}

export function isErrored<T>(p: Probably<T>): p is Errored {
    return p.resultType == 'error'
}

export async function tryCatchProbablyAsync<T>(f: () => Promise<Probably<T>>, onErrorPrefix: string = ''): Promise<Probably<T>> {
    try {
        const t = await f()
        return t
    } catch (error) {
        const msg = error && typeof error === 'object' && 'message' in error ? error.message : "<no message>"
        return errored(onErrorPrefix + msg, 'unexpected')
    }
}

export async function tryCatchAsync<T>(f: () => Promise<T>, onErrorPrefix: string = ''): Promise<Probably<T>> {
    return tryCatchProbablyAsync(async () => successful(await f()), onErrorPrefix)
}

export function tryCatch<T>(f: () => T, onErrorPrefix: string = ''): Probably<T> {
    try {
        return successful(f())
    } catch (error) {
        const msg = error && typeof error === 'object' && 'message' in error ? error.message : "<no message>"
        return errored(onErrorPrefix + msg, 'unexpected')
    }
}

export function mapProbably<T, R>(p: Probably<T>, f: (t: T) => R): Probably<R> {
    return flatMapProbably(p, t => successful(f(t)))
}

export async function mapProbablyAsync<T, R>(p: Probably<T>, f: (t: T) => Promise<R>): Promise<Probably<R>> {
    return flatMapProbablyAsync(p, async t => {
        const r = await f(t)
        return successful(r)
    })
}

export function flatMapProbably<T, R>(p: Probably<T>, f: (t: T) => Probably<R>): Probably<R> {
    if (isSuccessfull(p)) {
        return f(p.returned)
    }

    return p
}

export async function flatMapProbablyAsync<T, R>(p: Probably<T>, f: (t: T) => Promise<Probably<R>>): Promise<Probably<R>> {
    if (isSuccessfull(p)) {
        const probablyR = await f(p.returned)
        return probablyR
    }

    return p
}

export function zodSafeParse<T>(zodType: ZodType<T>, obj: unknown): Probably<T> {
    const parseResult = zodType.safeParse(obj)
    if (parseResult.success) return successful(parseResult.data)
    return errored(parseResult.error.message)
}