'use client'
import { useEffect, useMemo, useState } from 'react'
import { alchemyI } from '../config'
import { readContracts, useAccount, useContractRead } from 'wagmi'
import Image from 'next/image'
import StakeItem from './stakeItem'
import { MamiStake, LpStake, Lmc } from '../config/contract'
import { readContract } from '@wagmi/core'
import StakeOperation from './stakeOperation'
import type { NftInfo, Refresh } from '../interface'
import EmptyReward from './emptyReward'
import BlockLoading from './blockLoading';
import { formatEther } from 'viem'
import Loading from './loading'
interface Props extends Refresh {
  title: string
  contractAddress: string
  poolId: number
  sharePoolId: number
  needLmcAmount: number
  nftImage: string
  nftName: string
  abi: any
}

const isStakedFetch = {
  address: MamiStake.address,
  abi: MamiStake.abi,
}

// check offical stake status
async function checkOfficalStaked(list: NftInfo[], poolId: number, sharePoolId: number): Promise<NftInfo[]> {
  let result: NftInfo[] = list
  
  if (list.length) {
    const stakeOfficalP = list.map((item) => {
      return readContracts({
        contracts: [
          {
            ...isStakedFetch,
            functionName: 'poolStakes',
            args: [poolId, item.tokenId]
          },
          {
            ...isStakedFetch,
            functionName: 'poolStakes',
            args: [sharePoolId, item.tokenId]
          }
        ]
      })
    })
    const stakeOfficalResult = await Promise.all(stakeOfficalP)
    result = list.map((item, index) => {
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
  }

  return result
}

// check lp stake
async function checkLpStaked(list: NftInfo[], nftAddress: string, wallet: string, poolId: number) {
  let result = list
  // check lp stake token list
  const allStakeTokenIds = (await queryUserCollections(LpStake.address, nftAddress)).map(item => item.tokenId)
  const lpIds = await readContract({
    address: LpStake.address,
    abi: LpStake.abi,
    functionName: 'getUserStakeTokenIds',
    args: [poolId, allStakeTokenIds, wallet]
  })

  let lpStakeList: NftInfo[] = lpIds.map(item => {
    return {
      tokenId: item,
      isLpStaked: true,
      isStaked: false,
    }
  })
  return lpStakeList.concat(result)
}

// query all ssrtool tokenids
async function queryUserCollections(address: string, collectionAddress: string) {
  const data = await alchemyI.nft.getNftsForOwner(address, { contractAddresses: [collectionAddress] })
  return data.ownedNfts.map(item => {
    return {
      tokenId: item.tokenId,
      isStaked: false,
      isLpStaked: false,
    }
  })
}

export default function Stake(props: Props) {
  const { address, isConnected } = useAccount()
  const [tokens, setTokens] = useState<NftInfo[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (address) {
      queryUserCollections(address, props.contractAddress)
        .then(list => {
          return checkOfficalStaked(list, props.poolId, props.sharePoolId)
        })
        .then(list => {
          return checkLpStaked(list, props.contractAddress, address, props.poolId)
        })
        .then(list => {
          setLoaded(true)
          setTokens(list)
        })
    }
  }, [address, props])

  // query max stake count
  const { data } = useContractRead({
    address: Lmc.address,
    abi: Lmc.abi,
    functionName: 'balanceOf',
    args: [LpStake.address]
  })
  const maxCount = useMemo(() => {
    if (data) {
      return Math.floor((Number(formatEther(data as any)) / props.needLmcAmount))
    }
  }, [data, props.needLmcAmount])

  return (
    <div className='w-full mx-4 bg-white rounded-lg p-4 relative'>
      <BlockLoading key={props.rederKey} />
      <div className='flex justify-between items-center mb-4'>
        <div className='text-2xl font-bold'>{ props.title }质押</div>
        <div className="px-2 py-1 text-zinc-800 text-sm flex items-center" onClick={() => { props.setKey(props.rederKey + 1) }}>
          刷新
        </div>
      </div>
      <div className='flex items-center'>
        <Image
          className='w-20 h-20 rounded-full'
          src={props.nftImage}
          alt="nft image"
          width={80}
          height={80}
          priority
        />
        {
          !isConnected ?
          (
            <div className='ml-4'>
              <EmptyReward />
              <div className='flex mt-2 text-sm text-red-400'>
                ⚠️请先链接钱包
              </div>
            </div>
          )
          :
          <StakeOperation tokens={tokens} {...props} />
        }
      </div>
      { loaded ? 
        <div className='mt-4'>
          { tokens.length > 0 ? 
            (
              <ul className='list-decimal ml-6'>
                {
                  tokens.map(t => (
                    <StakeItem key={t.tokenId} {...t} nftName={props.nftName} />
                  ))
                }
              </ul>
            )
          : <div className='text-gray-500 text-sm'>未持有{ props.title }，请先购买！！</div> }
        </div>
        :
        ( address && <div className='flex justify-center items-center mt-8'>
          <Loading />
          <span className='ml-2'>NFT加载中...</span>
        </div> )
      }
      { data && <div className='bg-zinc-800 rounded-lg text-white text-sm p-4 mt-4'>⚠️ 注意，合约中的LMC数量为{ Math.floor(Number(formatEther(data as any))) }个，可提供至多{maxCount}个{props.title}质押，质押数量多于{maxCount}个会导致质押失败！！</div> }
    </div>
  )
}