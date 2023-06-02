import CredentialForms from '@/widgets/CredentialsForm'
import CreateChat from '@/widgets/CreateChat'
import ChatList from '@/widgets/ChatList'
import SendMessage from '@/widgets/SendMessage'

import { useMessagesList_OnlyOnceForTopLevel } from '@/features/messagesList'
import MessageList from './widgets/MessagesList/MessagesList'


function App () {

  useMessagesList_OnlyOnceForTopLevel()

  return (
    <div className="flex flex-row  bg-white min-w-[700px] ">
      <div className="border-r-[1px] border-gray-200 min-w-[350px] overflow-y-scroll no-scrollbar h-screen ">
        <div className="sticky top-0 z-50 bg-white">
          <CredentialForms />
          <CreateChat />
        </div>
        <div className="z-10">
          <ChatList />
        </div>
      </div>
      <div className="min-w-[400px]  w-full bg-gray-100 flex flex-col h-screen">
        <div className="flex flex-grow overflow-hidden overflow-y-auto pl-5">
          <MessageList />
        </div>
        <div>
          <SendMessage />
        </div>
      </div>
    </div>
  )
}

export default App
