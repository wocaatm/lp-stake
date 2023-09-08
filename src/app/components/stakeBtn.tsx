import { useMemo } from "react"
import type { NftInfo } from '../interface'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { MamiStake, LpStake, SsrTool } from '../config/contract'
import Loading from './loading'

interface Props {
  tokens: NftInfo[]
}

export default function StakeBtn(props: Props) {
  // stake
  const unStakeTokenList = useMemo(() => {
    return props.tokens.filter(item => !item.isLpStaked && !item.isStaked).map(item => item.tokenId)
  }, [props.tokens])
  const { config: stakeConfig } = usePrepareContractWrite({
    address: LpStake.address,
    abi: LpStake.abi,
    functionName: 'stake',
    args: [0, unStakeTokenList, unStakeTokenList]
  })
  const { data: stakeData, write: stake } = useContractWrite(stakeConfig)
  const { isLoading: isStakeLoading, isSuccess: isStakeSuccess } = useWaitForTransaction({
    hash: stakeData?.hash
  })
  return (
    <div className="px-2 py-1 bg-zinc-800 rounded-lg text-white shadow-sm text-sm mx-2 flex items-center" onClick={() => { !isStakeLoading && stake?.() }}>
      { isStakeLoading && <Loading /> }
      质押
    </div>
  )
}