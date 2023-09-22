'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Tip from './components/tip'
import Stake from './components/stake'
import { SsrTool, Pass } from './config/contract'
import { useState } from 'react';

const ssrInfo = {
  contractAddress: SsrTool.address,
  poolId: 0,
  sharePoolId: 1,
  needLmcAmount: 23000,
  nftImage: 'https://i.seadn.io/gcs/files/fd0ceaba22ba55e8f6a44166007adc9c.jpg?auto=format&dpr=4&w=128',
  nftName: 'LMC TOOL SSR',
  abi: SsrTool.abi
}

const passInfo = {
  contractAddress: Pass.address,
  poolId: 2,
  sharePoolId: 3,
  needLmcAmount: 40000,
  nftImage: 'https://i.seadn.io/gae/J42QptBSog1sRmscTvVP_5SJlOgsWQYQI5O9YMY6SduTlyiA6CHjsjwNvuCkOfn_2pY1ZcBNMC0jk7K4xM4A6lu98kX2XeCmbYyD?auto=format&dpr=1&w=1000',
  nftName: 'Pass Card',
  abi: Pass.abi
}

export default function Home() {
  const [key, setKey] = useState(0)
  const [key1, setKey1] = useState(100000)
  // 获取质押pool数据
  return (
    <div>
      <div className='bg-white'>
        <div className='container mx-auto flex justify-between items-center p-4 h-16'>
          <div className='flex items-center'>
            <img src="https://app.mami.network/_next/image?url=%2Fimg%2Flogo.png&w=128&q=75" alt="" width="45px" height="45px" />
            <p className='font-bold text-2xl pl-4 hidden'>Little Mami Lp Stake</p>
          </div>
          <ConnectButton />
        </div>
      </div>

      <div className='container mx-auto flex flex-wrap mt-4 pb-4 md:max-w-2xl'>
        <Stake title='SSR TOOL' {...ssrInfo} setKey={setKey} rederKey={key} key={key} />
        <div className="mt-4"></div>
        <Stake title='PASS CARD' {...passInfo} setKey={setKey1} rederKey={key1} key={key1} />
        <Tip />
      </div>
    </div>
  )
}
