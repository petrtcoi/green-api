import {
  success,
  error,
  type Result,
  type ErrorType
} from "@/shared/types/result"


type ResultSuccess = 'deleted' | 'empty'

export type ErrorCode = 'Unknown' | 'Unauthorized' | 'InvalidResponseData'
type ResultError = ErrorType<ErrorCode>

type ReceiveNotificationResult = Result<ResultError, ResultSuccess>


export async function deleteNotification (
  props: {
    receiptId: number
    idInstance: string
    apiTokenInstance: string
  }
): Promise<ReceiveNotificationResult> {

  const { idInstance, apiTokenInstance, receiptId } = props

  const response = await fetch(
    `https://api.green-api.com/waInstance${ idInstance }/deleteNotification/${ apiTokenInstance }/${ receiptId }`,
    { method: 'DELETE', })
  console.log('response', response)
  if (!response.ok) {
    if (response.status === 401) return error<ResultError>({ code: 'Unauthorized' })
    return error<ResultError>({ code: 'Unknown' })
  }
  const data = await response.json()
  console.log('data', data)

  if (data?.result) return success('deleted' as const)
  return success('empty' as const)
}