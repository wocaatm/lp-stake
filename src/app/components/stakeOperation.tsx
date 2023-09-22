import { useEffect, useMemo } from 'react'
import type { NftInfo, Refresh } from '../interface'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { LpStake, SsrTool } from '../config/contract'
import StakeReward from './stakeReward'
import Loading from './loading'
import StakeBtn from './stakeBtn'
import ClaimBtn from './claimBtn'
import EmptyReward from './emptyReward'
import UnStakeBtn from './unStakeBtn'

interface Props extends Refresh {
  tokens: NftInfo[]
  poolId: number
  nftName: string
  abi: any
  contractAddress: string
}

export default function StakeOperation(props: Props) {
  const { address } = useAccount()

  // query rewards
  const stakeLpTokenList = useMemo(() => {
    return props.tokens.filter(item => item.isLpStaked && !item.isStaked).map(item => item.tokenId)
  }, [props.tokens])

  // approve block
  const { data: isApprovedForAll } = useContractRead({
    abi: props.abi,
    address: props.contractAddress as any,
    functionName: 'isApprovedForAll',
    args: [address, LpStake.address],
  })

  // approve nft
  const { config } = usePrepareContractWrite({
    abi: props.abi,
    address: props.contractAddress as any,
    functionName: 'setApprovalForAll',
    args: [LpStake.address, true]
  })
  const { data: approveData, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: approveData?.hash
  })
  useEffect(() => {
    if (isSuccess) {
      props.setKey(props.rederKey + 1)
    }
  }, [isSuccess, props])

  return (
    <div className='flex-1 ml-4'>
      {
        stakeLpTokenList.length ?
          <StakeReward stakeLpTokenList={stakeLpTokenList} poolId={props.poolId} />
          :
          <EmptyReward />
      }
      {
        isApprovedForAll ?
          (
            <div className='flex mt-2'>
              { stakeLpTokenList.length > 0 && <ClaimBtn stakeLpTokenList={stakeLpTokenList} {...props} /> }
              <StakeBtn {...props} />
              { stakeLpTokenList.length > 0 && <UnStakeBtn stakeLpTokenList={stakeLpTokenList} {...props} /> }
            </div>
          ) :
          (
            <div className='flex mt-2'>
              <div className="px-2 py-1 bg-zinc-800 rounded-lg text-white shadow-sm text-sm flex items-center" onClick={() => { !isLoading && write?.() }}>
                { isLoading && <Loading /> }
                授权nft
              </div>
            </div>
          )
      }
    </div>
  )
}