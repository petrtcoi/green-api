
import { useCallback, useEffect, useState } from "react"
import { useAtom } from "jotai"

import { receiveNotification } from "@/shared/services/greenApi"
import { deleteNotification } from "@/shared/services/greenApi"
import { isError } from "@/shared/types/result"

import { chatListAtom } from "@/entities/chats"
import { messageListAtom } from '@/entities/messages'
import { idInstanceAtom, apiTokenInstanceAtom } from "@/entities/credentials"

const REFRESH_PERIOD_SECONDS = 3 * 1000


/** Must be invoked only once at App level */            //TODO use as react-singleton-hook ?
export function useMessagesList () {

  const [ chatList ] = useAtom(chatListAtom)
  const [ idInstance ] = useAtom(idInstanceAtom)
  const [ apiTokenInstance ] = useAtom(apiTokenInstanceAtom)
  const [ , setMessagesList ] = useAtom(messageListAtom)

  const [ badCredentialsError, setBadCredentialsError ] = useState<boolean>(false)



  /** Recursive function get and delete last notification */
  const updateMessages = useCallback(async (_idInstance = '', _apiTokenInstance = '') => {

    if (!_idInstance || !_apiTokenInstance) return
    if (badCredentialsError) return

    /** Get Last Notification */
    const receiveNotificationQuery = await receiveNotification({
      idInstance: _idInstance,
      apiTokenInstance: _apiTokenInstance
    })
    if (isError(receiveNotificationQuery)) {
      if (receiveNotificationQuery.payload.code === 'Unauthorized') setBadCredentialsError(true)
      return
    }

    const { message, receiptId } = receiveNotificationQuery.payload

    if (message) {
      setMessagesList(prev => {
        const isInList = prev.find(m => m.receiptId === message.receiptId)
        return isInList ? prev : [ ...prev, message ]
      })
    }

    if (receiptId) {
      await deleteNotification({                  // TODO add deleteNotification error handler ?
        idInstance: _idInstance,
        apiTokenInstance: _apiTokenInstance,
        receiptId
      })
      updateMessages()
    }

    return
  }, [ badCredentialsError, setMessagesList ])

  /** Credentials updated */
  useEffect(() => {
    setBadCredentialsError(false)
  }, [ idInstance, apiTokenInstance ])


  /** Check new messages each N seconds */
  useEffect(() => {
    if (!chatList.length) return
    if (badCredentialsError) return

    const interval = setInterval(
      async () => await updateMessages(idInstance ?? '', apiTokenInstance ?? ''),
      REFRESH_PERIOD_SECONDS
    )

    return () => clearInterval(interval)
  }, [ chatList, badCredentialsError, idInstance, apiTokenInstance, updateMessages ])


}