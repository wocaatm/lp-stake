'use client'
import { useEffect, useState } from 'react'
import { alchemyI } from '../config'
import { readContracts, useAccount, useContractRead } from 'wagmi'
import Image from 'next/image'
import StakeItem from './stakeItem'
import { MamiStake, LpStake } from '../config/contract'
import { readContract } from '@wagmi/core'
import type { NftInfo } from '../interface'
interface Props {
  title: string
  contractAddress: string
}

const isStakedFetch = {
  address: MamiStake.address,
  abi: MamiStake.abi,
}

const isLpStakedFetch = {
  address: LpStake.address,
  abi: LpStake.abi,
}

const address0 = '0x0000000000000000000000000000000000000000'

async function checkStaked(list: NftInfo[], address: string): Promise<NftInfo[]> {
  const stakeOfficalP = list.map((item) => {
    return readContracts({
      contracts: [
        {
          ...isStakedFetch,
          functionName: 'poolStakes',
          args: [0, item.tokenId]
        },
        {
          ...isStakedFetch,
          functionName: 'poolStakes',
          args: [1, item.tokenId]
        }
      ]
    })
  })
  const stakeLpP = list.map((item) => {
    return readContract({
      address: LpStake.address,
      abi: LpStake.abi,
      functionName: 'tokenOwner',
      args: [address, item.tokenId]
    })
  })
  const stakeOfficalResult = await Promise.all(stakeOfficalP)
  const lpResult = await Promise.all(stakeLpP)
  let stakeList = list.map((item, index) => {
    const sResult = stakeOfficalResult[index]
    let isStaked = false
    sResult.forEach(i => {
      if (i.result?.[0]) isStaked = true
    })
    return {
      ...item,
      isStaked,
    }
  })

  stakeList = stakeList.map((item, index) => {
    const isLpStaked: string = lpResult[index] as unknown as string
    const isBoolean = isLpStaked !== address0
    return {
      ...item,
      isLpStaked: isBoolean,
    }
  })

  // query lp stake status
  return stakeList
}

// query all ssrtool tokenids
async function queryUserCollections(address: string, collectionAddress: string) {
  const data = await alchemyI.nft.getNftsForOwner(address, { contractAddresses: [collectionAddress] })
  return data.ownedNfts.map(item => {
    return {
      nftName: item.contract.name,
      tokenId: item.tokenId,
      image: item.media[0].gateway,
      isStaked: false,
      isLpStaked: false,
    }
  })

}

export default function Stake(props: Props) {
  const { address, isConnected } = useAccount()
  const [tokens, setTokens] = useState<NftInfo[]>([])

  useEffect(() => {
    if (address) {
      queryUserCollections(address, props.contractAddress)
        .then(list => {
          return checkStaked(list, props.contractAddress)
        })
        .then(list => {
          setTokens(list)
        })
    }
  }, [address, props.contractAddress])

  // const {data: rewardsData} = useContractRead({
  //   address: MamiStake.address,
  //   abi: MamiStake.abi,
  //   functionName: 'getRewardsAmount',
  //   args: [1, tokens.map(item => item.tokenId)]
  // })
  
  if (!isConnected) return (
    <div>Connect First!</div>
  )
  return (
    <div className='w-full mx-4 bg-white mt-4 rounded-lg p-4'>
      <div className='flex justify-between items-center mb-4'>
        <div className='text-2xl font-bold'>{ props.title }</div>
      </div>
      <div className='flex justify-between items-center'>
        <Image
          className='w-16 h-16 rounded-full'
          src="/ssr.jpeg"
          alt="ssr image"
          width={80}
          height={80}
          priority
        />
        <div>
          <div className='text-sm'>
            <span>收益：3800.41 lmc</span>
            <span>（白嫖800 lmc）</span>
          </div>

          <div className='flex mt-2'>
            <div className="px-2 py-1 bg-emerald-400 rounded-lg text-white shadow-sm text-sm">领取</div>
            <div className="px-2 py-1 bg-zinc-800 rounded-lg text-white shadow-sm text-sm mx-2">质押</div>
            <div className="px-2 py-1 bg-red-500 rounded-lg text-white shadow-sm text-sm">取消质押</div>
          </div>
        </div>
      </div>
      {tokens.length > 0 && <div className='mt-4'>
        { tokens.map(t => (
          <StakeItem key={t.tokenId} {...t} />
        )) }
      </div>
      }  
    </div>
  )
}