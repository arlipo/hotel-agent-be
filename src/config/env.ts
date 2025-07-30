import { Probably } from "../types/common";
import { errored, isErrored, successful } from "../utils/probablyUtils";
import dotenv from 'dotenv';

dotenv.config();

type Config = {
    ADMIN_TOKEN: string,
}

function readConfig(): Probably<Config> {
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

    if (!ADMIN_TOKEN) return errored("Missing env vars for Admin", 'unexpected')

    return successful({ ADMIN_TOKEN })
}

export const config = (() => {
    const pr = readConfig()
    if (isErrored(pr)) throw new Error("Config read failure")
    return pr.returned
})()