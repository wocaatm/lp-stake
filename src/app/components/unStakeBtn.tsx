import { useEffect, useMemo } from "react"
import type { NftInfo } from '../interface'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { MamiStake, LpStake, SsrTool } from '../config/contract'
import Loading from './loading'

interface Props {
  stakeLpTokenList: string[]
}

export default function UnStakeBtn(props: Props) {
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
    if (isSuccess) alert('取消质押成功!')
  }, [isSuccess])
  
  return (
    <div className="px-2 py-1 bg-red-500 rounded-lg text-white shadow-sm text-sm flex items-center" onClick={() => { !isLoading && write?.() }}>
      { isLoading && <Loading /> }
      取消质押
    </div>
  )
}