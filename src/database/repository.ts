import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import PQueue from 'p-queue'
import path from 'path'
import { Probably } from '../types/common'
import { errored, mapProbably, successful, tryCatchAsync, tryCatchProbablyAsync } from '../utils/probablyUtils'
import { Agent, Data } from '../types/repository'

const dbPath = path.join(process.cwd(), 'data', 'db.json')
const adapter = new JSONFile<Data>(dbPath)
const db = new Low<Data>(adapter, { agents: [] })
const writeQueue = new PQueue({ concurrency: 1 })

async function updateData<T>(updater: (data: Data) => Probably<T>): Promise<Probably<T>> {
    const result = await writeQueue.add(() =>
        tryCatchProbablyAsync(async () => {
            await db.read()
            const updateResult = updater(db.data)
            await db.write()
            return updateResult
        }, 'Database update failed: ')
    )

    if (!result) {
        return errored('Failed to update database, update was interrupted', 'unexpected')
    }

    return result
}

async function readData(): Promise<Probably<Data>> {
    return tryCatchAsync(async () => {
        await db.read()
        return db.data
    }, 'Failed to read database: ')
}

export const initDb = async (): Promise<Probably<void>> => {
    return tryCatchAsync(async () => {
        const fs = await import('fs/promises')
        const dataDir = path.dirname(dbPath)

        try {
            await fs.access(dataDir)
        } catch {
            await fs.mkdir(dataDir, { recursive: true })
        }

        await db.read()
        db.data ||= { agents: [] }
        await db.write()
    }, 'Database initialization failed: ')
}

export async function insertAgentDb(agent: Agent): Promise<Probably<Agent>> {
    return updateData(data => {
        if (data.agents.some(existingAgent => existingAgent.id === agent.id)) {
            return errored(`Agent with id ${agent.id} already exists`)
        }
        data.agents.push(agent)
        return successful(agent)
    })
}

export async function getAgentsDb(): Promise<Probably<Agent[]>> {
    const data = await readData()

    return mapProbably(data, d => d.agents)
}

export async function getAgentDb(id: string): Promise<Probably<Agent | undefined>> {
    const data = await readData()

    return mapProbably(data, d => d.agents.find(agent => agent.id === id))
}