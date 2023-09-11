import { useState } from "react"

interface Props {
  title: string
  nftName: string
  tokenIds: string[]
  close: () => void
  action: any
}
export default function Selector(props: Props) {
  const [selectedList, setSelectedList] = useState<string[]>([])
  function closeSeletor () {
    props.close()
  }
  function switchCheckd(isChecked: boolean, item: string) {
    if (isChecked) {
      setSelectedList(selectedList.concat([item]))
    } else {
      const index = selectedList.findIndex((tokenId) => tokenId == item)
      selectedList.splice(index, 1)
      setSelectedList(selectedList)
    }
  }
  function callAction() {
    if (selectedList.length) {
      props.action(selectedList)
    }
  }
  return (
    <div className="fixed inset-0" style={{ background: 'rgba(0, 0, 0, 0.7)' }} onClick={() => { closeSeletor() }}>
      <div className="bg-white absolute left-0 right-0 bottom-0 p-4 rounded-t-2xl flex flex-col" style={{ maxHeight: '50%' }} onClick={(e) => { e.stopPropagation() } }>
        <p className="text-center font-bold text-lg mb-4">{ props.title }</p>
        
        <div className="flex-1 overflow-auto">
          { props.tokenIds.map(item => {
            return (
              <div className="flex items-center gap-x-3 mt-2" key={item}>
                <input id={item} onChange={(e) => switchCheckd(e.target.checked, item)} type="checkbox" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                <label htmlFor={item} className="block text-sm font-medium leading-6 text-gray-900">{ `${props.nftName} #${item}` }</label>
              </div>
            )
          }) }
        </div>

        <div className="flex justify-end mt-4">
          <div className="px-4 py-1 rounded-lg text-black shadow-sm text-sm flex items-center border border-zinc-100" onClick={() => { props.close() }}>
            取消
          </div>
          <div className="ml-4 px-4 py-1 bg-zinc-800 rounded-lg text-white shadow-sm text-sm flex items-center" onClick={() => { callAction() }}>
            确定
          </div>
        </div>
      </div>
    </div>
  )
}