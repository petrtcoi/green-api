import { useAtom } from "jotai"
import { chatListAtom, activeChatAtom } from "@/entities/chats"



export function ChatList (): JSX.Element {

  const [ chatList ] = useAtom(chatListAtom)
  const [ activeChat, setActiveChat ] = useAtom(activeChatAtom)

  const handleClick = (phoneNumber: string) => {
    setActiveChat(phoneNumber)
  }

  return (
    <div
      id="chat-list"
    >
      {
        chatList.map((chat) => (
          <div
            key={ chat }
            data-chat-active={ activeChat === chat }
            onClick={ () => handleClick(chat) }
            className="
              h-[50px] 
              border-b-[1px] border-gray-100 
              data-[chat-active=true]:bg-gray-100
              data-[chat-active=false]:hover:cursor-pointer
              data-[chat-active=false]:hover:bg-gray-50  
              flex items-center pl-5
              "
          >
            <span className="font-light text-xs mr-2">chat with: </span>
            <span className="font-mono">{ chat }</span>
          </div>
        ))
      }

    </div >
  )
}

export default ChatList