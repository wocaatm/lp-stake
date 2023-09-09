import { useMemo, useState } from "react"
import type { NftInfo, Refresh } from '../interface'
import { LpStake } from '../config/contract'
import Loading from './loading'
import Selector from "./selector"
import { prepareWriteContract, waitForTransaction, writeContract } from "wagmi/actions"

interface Props extends Refresh {
  tokens: NftInfo[]
}

export default function StakeBtn(props: Props) {
  const [showSelector, setShowSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // stake
  const unStakeTokenList = useMemo(() => {
    return props.tokens.filter(item => !item.isLpStaked && !item.isStaked).map(item => item.tokenId)
  }, [props.tokens])
  // unstake reward
  async function action(tokenIds: string[]) {
    close()
    setIsLoading(true)
    const config = await prepareWriteContract({
      abi: LpStake.abi,
      address: LpStake.address,
      functionName: 'stake',
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

  if (!unStakeTokenList.length) return null
  return (
    <>
      { showSelector && <Selector nftName="LMC SSR TOOL" title="请选择取消质押的SSR" tokenIds={unStakeTokenList} action={action} close={close} /> }
      <div className="px-2 py-1 bg-zinc-800 rounded-lg text-white shadow-sm text-sm mr-2 flex items-center" onClick={() => { !isLoading && setShowSelector(true) }}>
        { isLoading && <Loading /> }
        质押
      </div>
    </>
  )
}