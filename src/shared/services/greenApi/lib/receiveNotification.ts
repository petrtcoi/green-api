import {
  success,
  error,
  type Result,
  type ErrorType
} from "@/shared/types/result"
import { type Message } from "@/entities/messages"

const INCOMING_MESSAGE_STATUS = 'incomingMessageReceived'
const PHONE_NUMBER_LENGTH = 11



type ResultSuccess = {
  receiptId?: number
  message?: Message
}

export type ErrorCode = 'Unknown' | 'Unauthorized' | 'InvalidResponseData'
type ResultError = ErrorType<ErrorCode>

type ReceiveNotificationResult = Result<ResultError, ResultSuccess>


export async function receiveNotification (
  props: {
    idInstance: string
    apiTokenInstance: string
  }
): Promise<ReceiveNotificationResult> {

  const { idInstance, apiTokenInstance } = props

  const response = await fetch(
    `https://api.green-api.com/waInstance${ idInstance }/receiveNotification/${ apiTokenInstance }`,
    { method: 'GET' })

  if (!response.ok) {
    if (response.status === 401) return error<ResultError>({ code: 'Unauthorized' })
    return error<ResultError>({ code: 'Unknown' })
  }

  const data = await response.json()
  console.log('receive data', data)
  if (data === null) return success({})
  if (data.body.typeWebhook !== INCOMING_MESSAGE_STATUS) {
    return success({ receiptId: data.receiptId })
  }


  // TODO - need some decent type checking here Typebox?
  if (!data.receiptId
    || !data?.body?.instanceData?.wid
    || !data?.body?.timestamp
    || !data?.body?.senderData?.chatId
  ) {
    return error<ResultError>({ code: 'InvalidResponseData' })
  }


  return success({
    receiptId: data.receiptId,
    message: {
      type: 'incoming' as const,
      receiptId: data.receiptId,
      chatId: data.body.senderData.chatId.slice(0, PHONE_NUMBER_LENGTH),
      timestamp: data.body.timestamp,
      text: data.body.messageData.textMessageData.textMessage,
    }
  })
}