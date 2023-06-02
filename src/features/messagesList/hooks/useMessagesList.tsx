
import { useEffect, useState } from "react"
import { useAtom } from "jotai"

import { receiveNotification } from "@/shared/services/greenApi"
import { deleteNotification } from "@/shared/services/greenApi"
import { isError } from "@/shared/types/result"

import { chatListAtom } from "@/entities/chats"
import { messageListAtom } from '@/entities/messages'
import { idInstanceAtom, apiTokenInstanceAtom } from "@/entities/credentials"

const REFRESH_PERIOD_SECONDS = 5 * 1000


//TODO use as react-singleton-hook ?

/** Must be invoked only once at App level */
export function useMessagesList () {
  const [ chatList ] = useAtom(chatListAtom)
  const [ idInstance ] = useAtom(idInstanceAtom)
  const [ apiTokenInstance ] = useAtom(apiTokenInstanceAtom)
  const [ _messageList, setMessagesList ] = useAtom(messageListAtom)

  const [ isUpdating, setIsUpdating ] = useState<boolean>(false)
  const [ errorMessage, setErrorMessage ] = useState<string>('')
  const [ badCredentialsError, setBadCredentialsError ] = useState<boolean>(false)



  /** Recursive function get and delete last notification */
  async function updateMessages () {
    if (!idInstance || !apiTokenInstance) return
    if (badCredentialsError) return

    setErrorMessage('')
    setIsUpdating(true)

    /** Get Last Notification */
    const receiveNotificationQuery = await receiveNotification({ idInstance, apiTokenInstance })

    if (isError(receiveNotificationQuery)) {
      if (receiveNotificationQuery.payload.code === 'Unauthorized') {
        setErrorMessage('Please check idInstance and apiTokenInstance')
        setBadCredentialsError(true)
        return
      }
      setErrorMessage(receiveNotificationQuery.payload.code)  // TODO function convert code to message
      return
    }

    const data = receiveNotificationQuery.payload
    const { message, receiptId } = data

    if (message) {
      setMessagesList(prev => {
        const isInList = prev.find(m => m.receiptId === message.receiptId)
        return isInList ? prev : [ ...prev, message ]
      })
    }

    // Delete last message
    if (receiptId) {
      // TODO add delete notification handler ?
      const deleteNotificationQuery = await deleteNotification({ idInstance, apiTokenInstance, receiptId })
      if (isError(deleteNotificationQuery)) {
        setErrorMessage(`Error delete notification: ${ deleteNotificationQuery.payload.code }`)
      }
      updateMessages() /** If is was not last message - check for next one */
    }


    setIsUpdating(false)
    return
  }

  /** Credentials updated */
  useEffect(() => {
    setBadCredentialsError(false)
  }, [ idInstance, apiTokenInstance ])


  /** Check new messages each N seconds */
  useEffect(() => {
    if (!chatList.length || isUpdating) return
    const interval = setInterval(updateMessages, REFRESH_PERIOD_SECONDS)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ chatList ])

  useEffect(() => {
    console.log('messageList', _messageList)
  }, [ _messageList ])


}