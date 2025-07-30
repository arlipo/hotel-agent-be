export type Probably<T> = 
    Succeeded<T> | Errored

export type Succeeded<T> = {
    resultType: 'success',
    returned: T 
}

export type Errored = {
    resultType: 'error',
    message: string,
    errorType: ErrorType
}

export type ErrorType = 'expected' | 'unexpected'