'use client'
import { useEffect, useState } from 'react'
import { alchemyI } from '../config'
import { useAccount } from 'wagmi'

interface Props {
  title: string
  contractAddress: string
}

async function queryUserCollections(address: string, collectionAddress: string) {
  const data = await alchemyI.nft.getNftsForOwner(address, { contractAddresses: [collectionAddress] })
  console.log('data', data)
}

export default function Stake(props: Props) {
  const { address, isConnected } = useAccount()
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    console.log('address', address)
    if (address) {
      queryUserCollections(address, props.contractAddress)
    }
  }, [address, props.contractAddress])

  if (!isConnected) return (
    <div>Connect First!</div>
  )
  return (
    <p className=''>{ props.title }</p>
  )
}