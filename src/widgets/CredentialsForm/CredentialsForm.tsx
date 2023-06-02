import { useAtom } from "jotai"
import { idInstanceAtom, apiTokenInstanceAtom } from "@/entities/credentials"

export function CredentialForms (): JSX.Element {

  const [ idInstance, setIdInstance ] = useAtom(idInstanceAtom)
  const [ apiTokenInstance, setApiTokenInstance ] = useAtom(apiTokenInstanceAtom)

  return (
    <div
      id="credentials-form"
      className="p-5 border-b-[1px] border-gray-100"
    >
      <form>
        <div className="mb-4">
          <input
            type="text"
            placeholder="idInstance"
            name="idInstance"
            className="
            bg-gray-100
            w-full  rounded py-2 px-3 
            text-gray-600 font-light leading-tight text-sm
            focus:outline-none"

            value={ idInstance ?? "" }
            onChange={ (e) => setIdInstance(e.target.value) }
          />
        </div>
        <div>
          <textarea
            placeholder="apiTokenInstance"
            name="apiTokenInstance"
            rows={ 2 }
            className="
            resize-none
            bg-gray-100
            w-full  rounded py-2 px-3 
            text-gray-600 font-light leading-tight text-sm
            focus:outline-none"

            value={ apiTokenInstance ?? "" }
            onChange={ (e) => setApiTokenInstance(e.target.value) }
          />
        </div>
      </form >
    </div >
  )
}

export default CredentialForms