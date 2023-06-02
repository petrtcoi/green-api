import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import SpeechBubble from "./components/SpeechBubble"

import { activeChatAtom } from "@/entities/chats"
import { type Message, messageListAtom } from "@/entities/messages"



export default function MessageList (): JSX.Element {

  const [ activeChat ] = useAtom(activeChatAtom)
  const [ messageList ] = useAtom(messageListAtom)
  const [ messages, setMessages ] = useState<Message[]>([])

  const bottomMessageList = document.getElementById('bottom-message-list')

  useEffect(() => {
    setMessages(
      messageList
        .filter(m => m.chatId === activeChat)
        .sort((a, b) => a.timestamp - b.timestamp)
    )
    setTimeout(() => { bottomMessageList?.scrollIntoView({ behavior: 'smooth' }) }, 200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeChat, messageList ])


  return (
    <div id="messages-list" className="w-full p-5">
      { messages.map(message => {
        return (
          <div key={ `${ message.timestamp }-${ message.type }` }>
            <SpeechBubble
              type={ message.type }
              text={ message.text }
            />
          </div>
        )
      }) }
      <div id="bottom-message-list" />
    </div>
  )

}