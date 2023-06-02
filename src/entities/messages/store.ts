import { atom } from 'jotai'


export type MessageType = 'incoming' | 'outgoing'

export type Message = {
  type: MessageType
  receiptId: number
  timestamp: number
  chatId: string
  text: string
}



export const messageListAtom = atom<Message[]>([])