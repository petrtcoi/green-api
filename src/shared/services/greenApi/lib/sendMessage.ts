import {
  success,
  error,
  type Result,
  type ErrorType
} from "@/shared/types/result"


type ResultSuccess = {
  idMessage: string
}

type ErrorCode = 'Unknown' | 'Unauthorized' | 'InvalidResponseData'
type ResultError = ErrorType<ErrorCode>

type SendMessageResult = Result<ResultError, ResultSuccess>


export async function sendMessage (
  props: {
    phoneNumber: string
    idInstance: string
    apiTokenInstance: string
    message: string
  }
): Promise<SendMessageResult> {

  const { idInstance, apiTokenInstance, message, phoneNumber } = props
  const chatId = `${ phoneNumber }@c.us`

  const body = JSON.stringify({ chatId, message })

  try {
    const response = await fetch(
      `https://api.green-api.com/waInstance${ idInstance }/sendMessage/${ apiTokenInstance }`,
      {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
        body,
      })
    if (!response.ok) {
      if (response.status === 401) return error<ResultError>({ code: 'Unauthorized' })
      return error<ResultError>({ code: 'Unknown' })
    }
    const data = await response.json()
    if (!data.idMessage) return error<ResultError>({ code: 'InvalidResponseData' })
    return success({ idMessage: data.idMessage })

  } catch (err) {
    // TODO Cant get proper information about error if wrong credentials
    return error<ResultError>({ code: 'Unauthorized' })
  }
}

