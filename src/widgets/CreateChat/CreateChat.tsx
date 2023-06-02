import { useState } from "react"
import { useAtom } from "jotai"
import { activeChatAtom, chatListAtom } from "@/entities/chats"

const PHONE_NUMBER_LENGTH = 11

export function CreateChat (): JSX.Element {

  const [ chatList, setChatList ] = useAtom(chatListAtom)
  const [ _, setActiveChat ] = useAtom(activeChatAtom)

  const [ phoneNumber, setPhoneNumber ] = useState<string>('')
  const [ errorMessage, setErrorMessage ] = useState<string>('')
  const isNumberLengthValid = phoneNumber.length === PHONE_NUMBER_LENGTH


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "")
    if (newValue.length > PHONE_NUMBER_LENGTH) return
    setPhoneNumber(newValue)
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isNumberLengthValid) {
      setErrorMessage(`Phone number must be ${ PHONE_NUMBER_LENGTH } digits`)
      return
    }
    if (chatList.includes(phoneNumber)) {
      setErrorMessage(`Chat with ${ phoneNumber } already exists`)
      return
    }
    setChatList([ ...chatList, phoneNumber ])
    setActiveChat(phoneNumber)
    setPhoneNumber('')
    setErrorMessage('')
    return
  }


  return (
    <div
      id="create-chat-form"
      className="p-5 border-b-[1px] border-gray-100"
    >
      <form >
        <div className="flex flex-row gap-2 items-center">
          <input
            type="text"
            placeholder="phone number"
            name="phoneNumber"
            className="
            bg-gray-100
            w-1/2  rounded py-2 px-3 
            text-gray-600 font-light leading-tight text-sm
            focus:outline-none"

            value={ phoneNumber ?? "" }
            onChange={ handleChange }
          />
          <div className="w-1/2 h-8">
            <button
              className="bg-green-600 hover:enabled::bg-green-700 disabled:bg-green-300 text-white text-sm h-full px-5 w-full rounded-2xl"
              disabled={ !isNumberLengthValid }
              onClick={ handleSubmit }
            >
              Create Chat
            </button>
          </div>
        </div>
      </form >
      <div className="text-xs text-red-500 mt-2">{ errorMessage }</div>
    </div >
  )
}

export default CreateChat