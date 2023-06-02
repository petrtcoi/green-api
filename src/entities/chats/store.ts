import { atom } from 'jotai'

export const chatListAtom = atom<string[]>([])
export const activeChatAtom = atom<string | null>(null)

