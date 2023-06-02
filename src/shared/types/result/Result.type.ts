export const ResultStatusValues = {
  Success: 'Success',
  Error: 'Error'
} as const

export type ResultStatus = typeof ResultStatusValues[ keyof typeof ResultStatusValues ]

export type ResultSuccess<T> = {
  status: typeof ResultStatusValues.Success
  payload: T
}
export type ResultError<T> = {
  status: typeof ResultStatusValues.Error
  payload: T
}

export type ErrorType<T> = { code: T, message?: string, status?: number }

export type Result<T, K> = ResultError<T> | ResultSuccess<K>