'use client'
import { useEffect, useState } from 'react'
import { alchemyI } from '../config'
import { useAccount } from 'wagmi'
interface Props {
  title: string
  contractAddress: string
}

interface NftInfo {
  nftName?: string
  tokenId: string
  image?: string
}

async function queryUserCollections(address: string, collectionAddress: string) {
  const data = await alchemyI.nft.getNftsForOwner(address, { contractAddresses: [collectionAddress] })
  return data.ownedNfts.map(item => {
    return {
      nftName: item.contract.name,
      tokenId: item.tokenId,
      image: item.media[0].gateway,
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
          setTokens(list)
        })
    }
  }, [address, props.contractAddress])

  if (!isConnected) return (
    <div>Connect First!</div>
  )
  return (
    <div className='w-full mx-4 bg-white mt-4 rounded-lg p-4'>
      <p className='text-2xl font-bold text-center mb-4'>{ props.title }</p>
      {tokens.length > 0 && <div className=''>
        { tokens.map(t => (
          <div key={t.tokenId} className="flex items-center">
            <img className="w-16 h-16 rounded-full mr-4" src={t.image} alt="" />
            <div className="text-left">
              <p className="font-medium">
                {`${t.nftName} #${t.tokenId}`}
              </p>
              <div className='flex'>
                <div className="text-sky-500">claim</div>
                <div className="text-slate-700">unstake</div>
              </div>
            </div>
          </div>
        )) }
      </div>
      }  
    </div>
  )
}