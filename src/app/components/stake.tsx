'use client'
import { useEffect, useState } from 'react'
import { alchemyI, ssrTool } from '../config'
import { readContracts, useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import Image from 'next/image'
import StakeItem from './stakeItem'
import { MamiStake, LpStake, SsrTool } from '../config/contract'
import { readContract } from '@wagmi/core'
import StakeOperation from './stakeOperation'
import type { NftInfo } from '../interface'
import EmptyReward from './emptyReward'
interface Props {
  title: string
  contractAddress: string
}

const isStakedFetch = {
  address: MamiStake.address,
  abi: MamiStake.abi,
}

// check offical stake status
async function checkOfficalStaked(list: NftInfo[]): Promise<NftInfo[]> {
  let result: NftInfo[] = list
  
  if (list.length) {
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
async function checkLpStaked(list: NftInfo[], nftAddress: string, wallet: string) {
  let result = list
  // check lp stake token list
  const lpIds = await readContract({
    address: LpStake.address,
    abi: LpStake.abi,
    functionName: 'getStakeTokenIds',
    args: [nftAddress, wallet]
  })

  let lpStakeList: NftInfo[] = []
  if (lpIds.length) {
    lpStakeList = lpIds.map(item => {
      return {
        tokenId: item.toString(),
        isStaked: false,
        isLpStaked: false,
      }
    })
    const setLpIds = Array.from(new Set([...lpIds]))
    const lpStakeInfo = await readContracts({
      contracts: setLpIds.map(item => {
        return {
          address: LpStake.address,
          abi: LpStake.abi,
          functionName: 'tokenOwner',
          args: [nftAddress, item]
        }
      })
    })

    lpStakeInfo.forEach((item, index) => {
      if (item.result as any == wallet) {
        lpStakeList[index].isLpStaked = true
      }
    })
  }

  return result.concat(lpStakeList.filter(item => item.isLpStaked))
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

  useEffect(() => {
    if (address) {
      queryUserCollections(address, props.contractAddress)
        .then(list => {
          return checkOfficalStaked(list)
        })
        .then(list => {
          return checkLpStaked(list, props.contractAddress, address)
        })
        .then(list => {
          setTokens(list)
        })
    }
  }, [address, props.contractAddress])

  return (
    <div className='w-full mx-4 bg-white mt-4 rounded-lg p-4'>
      <div className='flex justify-between items-center mb-4'>
        <div className='text-2xl font-bold'>{ props.title }</div>
      </div>
      <div className='flex items-center'>
        <Image
          className='w-20 h-20 rounded-full'
          src="/ssr.jpeg"
          alt="ssr image"
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
          <StakeOperation tokens={tokens} />
        }
      </div>
      { isConnected && tokens.length > 0 && <div className='mt-4'>
        { tokens.map(t => (
          <StakeItem key={t.tokenId} {...t} nftName='LMC TOOL SSR' />
        )) }
      </div>
      }  
    </div>
  )
}