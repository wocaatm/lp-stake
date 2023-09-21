import { useEffect, useMemo } from "react"
import type { NftInfo, Refresh } from '../interface'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { MamiStake, LpStake, SsrTool } from '../config/contract'
import Loading from './loading'

interface Props extends Refresh {
  stakeLpTokenList: string[]
  poolId: number
}

export default function ClaimBtn(props: Props) {
  // claim reward
  const { config } = usePrepareContractWrite({
    address: LpStake.address,
    abi: LpStake.abi,
    functionName: 'claim',
    args: [props.poolId, props.stakeLpTokenList, props.stakeLpTokenList]
  })
  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash
  })

  useEffect(() => {
    if (isSuccess) props.setKey(props.rederKey + 1)
  }, [isSuccess, props])
  
  return (
    <div className="px-2 py-1 bg-emerald-400 rounded-lg text-white shadow-sm text-sm mr-2 flex items-center" onClick={() => { !isLoading && write?.() }}>
      { isLoading && <Loading /> }
      领取
    </div>
  )
}