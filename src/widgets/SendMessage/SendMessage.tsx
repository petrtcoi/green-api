import { useState } from "react"
import { useAtom } from "jotai"

import { sendMessage } from "@/shared/services/greenApi"
import { isError } from "@/shared/types/result"

import { idInstanceAtom, apiTokenInstanceAtom } from "@/entities/credentials"
import { activeChatAtom } from "@/entities/chats"
import { Message, messageListAtom } from "@/entities/messages"




export function SendMessage (): JSX.Element {

  const [ idInstance ] = useAtom(idInstanceAtom)
  const [ apiTokenInstance ] = useAtom(apiTokenInstanceAtom)
  const [ activeChat ] = useAtom(activeChatAtom)
  const [ _messageList, setMessagesList ] = useAtom(messageListAtom)


  const [ message, setMessage ] = useState<string>('')
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ errorMessage, setErrorMessage ] = useState<string>('')


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    return
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    if (!apiTokenInstance || !idInstance || !activeChat) return
    setLoading(true)

    const sendMessageQuery = await sendMessage({
      idInstance, apiTokenInstance, message, phoneNumber: activeChat
    })
    if (isError(sendMessageQuery)) {
      setErrorMessage(sendMessageQuery.payload.code)
      setLoading(false)
      return
    }
    // get timestamp now

    const newMessage: Message = {
      type: 'outgoing',
      receiptId: 0,
      timestamp: Math.floor(Date.now() / 1000),
      chatId: activeChat,
      text: message
    }
    setMessagesList(prev => [ ...prev, newMessage ])
    // TODO add checking by "idMessage": "BAE5176C5D79EC82" (optimistic UI) 
    setLoading(false)
    setMessage('')
    return
  }


  return (
    <div
      id="create-chat-form"
      className="p-5 border-b-[1px] border-gray-100"
    >
      <div className="text-xs text-gray-500 mt-2" hidden={ !loading }>loading...</div>
      <div className="text-xs text-red-500 mt-2">{ errorMessage }</div>

      <form >
        <div className="flex flex-row gap-2 items-center">
          <input
            type="text"
            placeholder="message"
            name="message"
            className="
            bg-white
            w-[400px]  rounded py-2 px-3 
            text-gray-600 font-light leading-tight text-sm
            focus:outline-none"

            value={ message ?? "" }
            onChange={ handleChange }
          />
          <div className="w-[200px] h-8">
            <button
              className="bg-green-600 hover:enabled::bg-green-700 disabled:bg-green-300 text-white text-sm h-full px-5 w-full rounded-2xl"
              disabled={ !message.length || loading || !apiTokenInstance || !idInstance || !activeChat }
              onClick={ handleSubmit }
            >
              Send Message
            </button>
          </div>
        </div>
      </form >

    </div >
  )
}

export default SendMessage