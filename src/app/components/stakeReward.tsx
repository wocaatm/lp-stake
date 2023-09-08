import { LpStake, MamiStake } from '../config/contract'
import { useContractRead } from 'wagmi'
import { formatEther } from 'viem'
import { useMemo } from 'react'
interface Props {
  stakeLpTokenList: string[]
}

export default function StakeReward(props: Props) {
  const { data: rewardsData, refetch } = useContractRead({
    address: LpStake.address,
    abi: LpStake.abi,
    functionName: 'getRewardsAmount',
    args: [0, props.stakeLpTokenList]
  })

  const precent = useMemo(() => {
    if (rewardsData?.length) {
      const all = formatEther(rewardsData?.[0])
      const extra = formatEther(rewardsData?.[1])
      if (Number(extra) == 0) return '0'
      return (100 * Number(extra) / (Number(all) - Number(extra))).toFixed(2)
    }
    return '0'
  }, [rewardsData])

  return (
    <div className='text-sm relative'>
      <p>总收益：{ rewardsData?.length ? formatEther(rewardsData?.[0]) : 0 } lmc</p>
      <p>白嫖：{ rewardsData?.length ? formatEther(rewardsData?.[1]) : 0 } lmc</p>
      <p>收益率：<span className='font-bold text-emerald-400'>{ precent }%</span></p>
      <div className="absolute top-0 right-0 px-2 py-1 bg-rose-400 rounded-lg text-white shadow-sm text-sm flex items-center" onClick={ () => { refetch?.() } }>
        刷新
      </div>
    </div>
  )
}