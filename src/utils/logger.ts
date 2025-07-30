import chalk from 'chalk';
import { Errored } from '../types/common';


export function logger(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    const timestamp = chalk.cyan(`[${new Date().toISOString()}]`);

    let logMessage: string;
    switch (level) {
        case 'info':
            logMessage = chalk.blue('INFO: ') + message;
            break;
        case 'warn':
            logMessage = chalk.yellow('WARN: ') + message;
            break;
        case 'error':
            logMessage = chalk.red('ERROR: ') + message;
            break;
    }

    console.log(`${timestamp} ${logMessage}`);
};

export function logError(errored: Errored, prefix: string = '') {
    switch (errored.errorType) {
        case 'expected': logger(prefix + errored.message, 'warn'); break;
        case 'unexpected': logger(prefix + errored.message, 'error'); break;
    }
}
