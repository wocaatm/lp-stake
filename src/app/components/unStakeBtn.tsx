import { useEffect, useState } from "react"
import type { Refresh } from '../interface'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { LpStake } from '../config/contract'
import Loading from './loading'
import Selector from './selector'
import { writeContract, prepareWriteContract, waitForTransaction } from "@wagmi/core"

interface Props extends Refresh {
  stakeLpTokenList: string[]
}

export default function UnStakeBtn(props: Props) {
  const [showSelector, setShowSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // unstake reward
  async function action(tokenIds: string[]) {
    close()
    setIsLoading(true)
    const config = await prepareWriteContract({
      abi: LpStake.abi,
      address: LpStake.address,
      functionName: 'unStake',
      args: [0, tokenIds, tokenIds]
    })
    const { hash } = await writeContract(config)
    await waitForTransaction({
      hash,
    })
    setIsLoading(false)
    props.setKey(props.rederKey + 1)
  }

  function close () {
    setShowSelector(false)
  }
  
  return (
    <>
      { showSelector && <Selector nftName="LMC SSR TOOL" title="请选择取消质押的SSR" tokenIds={props.stakeLpTokenList} action={action} close={close} /> }
      <div className="px-2 py-1 bg-zinc-800 rounded-lg text-white shadow-sm text-sm flex items-center" onClick={() => { !isLoading && setShowSelector(true) }}>
        { isLoading && <Loading /> }
        取消质押
      </div>
    </>
  )
}