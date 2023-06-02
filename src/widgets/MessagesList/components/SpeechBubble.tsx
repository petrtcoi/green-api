import { type MessageType } from '@/entities/messages'


type Props = {
  type: MessageType
  text: string
}
export default function SpeechBubble (props: Props): JSX.Element {

  const { type, text } = props

  return (
    <div className={ type === 'incoming'
      ? "flex items-center my-4 justify-start"
      : "flex items-center my-4 justify-end"
    }
    >

      <div className={ type === 'incoming'
        ? " text-gray-500 rounded-lg p-2 mb-2 relative shadow bg-white self-center"
        : " text-gray-500 rounded-lg p-2 mb-2 relative shadow bg-green-100"
      }>
        <div>{ text }</div>
        <div className={ type === 'incoming'
          ? "absolute left-0 top-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white border-l-[1px] border-b-[1px] border-gray-200"
          : "absolute -right-0 top-1/2 transform translate-x-1/2 -rotate-45 w-2 h-2 bg-green-100 border-r-[1px] border-b-[1px]" }>
        </div>
      </div>
    </ div>
  )
}