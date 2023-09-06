'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Tip from './components/tip'
import Stake from './components/stake'
import { ssrTool } from './config'
export default function Home() {
  return (
    <div>
      <div className='container mx-auto flex justify-between items-center p-4 h-16'>
        <div className='flex items-center'>
          <img src="https://app.mami.network/_next/image?url=%2Fimg%2Flogo.png&w=128&q=75" alt="" width="45px" height="45px" />
          <p className='font-bold text-2xl pl-4 hidden'>Little Mami Lp Stake</p>
        </div>
        <ConnectButton />
      </div>

      <div className='flex flex-wrap mt-4'>
        <Tip />
        <div className='w-full px-4'>
          <Stake title='Ssr tool质押' contractAddress={ssrTool.goerli} />
        </div>
      </div>
    </div>
  )
}
