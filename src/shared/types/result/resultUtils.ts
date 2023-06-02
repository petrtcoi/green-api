import {
  ResultStatusValues,
  type ResultError,
  type ResultSuccess
} from './Result.type'


export function isSuccess (res: any): res is ResultSuccess<any> {
  return res.status === ResultStatusValues.Success
}
export function isError (res: any): res is ResultError<any> {
  return !isSuccess(res)
}

export function success<T> (data: T): ResultSuccess<T> {
  return ({
    status: ResultStatusValues.Success,
    payload: data
  })
}
export function error<T> (data: T): ResultError<T> {
  return ({
    status: ResultStatusValues.Error,
    payload: data
  })
}