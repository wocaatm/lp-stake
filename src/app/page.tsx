'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Tip from './components/tip'
import Stake from './components/stake'
import { SsrTool } from './config/contract'
import { useState } from 'react';

const ssrInfo = {
  contractAddress: SsrTool.address,
  poolId: 0,
  sharePoolId: 1,
  needLmcAmount: 23000,
  nftImage: 'https://i.seadn.io/gcs/files/fd0ceaba22ba55e8f6a44166007adc9c.jpg?auto=format&dpr=4&w=128',
  nftName: 'LMC TOOL SSR',
}

export default function Home() {
  const [key, setKey] = useState(0)
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
        <Tip />
      </div>
    </div>
  )
}
