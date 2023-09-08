import { useEffect, useState } from "react"
import type { Refresh } from '../interface'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { LpStake } from '../config/contract'
import Loading from './loading'
import Selector from './selector'

interface Props extends Refresh {
  stakeLpTokenList: string[]
}

export default function UnStakeBtn(props: Props) {
  const [showSelector, setShowSelector] = useState(false)
  // unstake reward
  const { config } = usePrepareContractWrite({
    address: LpStake.address,
    abi: LpStake.abi,
    functionName: 'unStake',
    args: [0, props.stakeLpTokenList, props.stakeLpTokenList]
  })
  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash
  })

  useEffect(() => {
    if (isSuccess) props.setKey(props.rederKey + 1)
  }, [isSuccess, props])
  
  return (
    <>
      { showSelector && <Selector tokenIds={props.stakeLpTokenList} /> }
      <div className="px-2 py-1 bg-red-500 rounded-lg text-white shadow-sm text-sm flex items-center" onClick={() => { !isLoading && write?.() }}>
        { isLoading && <Loading /> }
        取消质押
      </div>
    </>
  )
}