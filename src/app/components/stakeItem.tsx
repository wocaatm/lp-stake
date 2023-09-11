import { MamiStake } from '../config/contract'
import type { NftInfo } from '../interface'

interface Props extends NftInfo {
}

const isStakedFetch = {
  address: MamiStake.address,
  abi: MamiStake.abi,
}

export default function StakeItem(props: Props) {
  return (
    <li className={`${props.isStaked ? 'text-gray-400' : ''}`}>
      <div className="flex items-center">
        <p className="font-medium mr-4 text-base">{`${props.nftName} #${props.tokenId}`}</p>
        <span className={`text-sm ${props.isStaked ? 'text-gray-400' : `${props.isLpStaked ? 'text-emerald-400' : 'text-red-500'}`}`}>
          { props.isStaked || props.isLpStaked ? `已质押${props.isStaked ? '(官方)' : '' }` : '未质押' }
        </span>
      </div>
    </li>
  )
}