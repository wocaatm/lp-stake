export default function Tip() {
  return (
    <div className='w-full px-4'>
      <div className='bg-amber-400 p-4 rounded-lg'>⚠️：参与LP质押需把对应的NFT转移到合约，该操作需要授权合约对NFT的权限，请仔细考虑！！</div>
      <div className='bg-emerald-400 p-4 rounded-lg mt-4'>
        <p>⚠️：为什么要参与质押？</p>
        <ol className='list-disc ml-8 text-sm mt-4'>
          <li>ssr tool第一期质押数据显示，参与lp质押的lmc收益（256lmc）比单卡收益（198lmc）<span className='underline decoration-red-500 text-lg'>29%</span></li>
          <li>合约经过项目方审核！！白嫖LMC</li>
        </ol>
      </div>
    </div>
  )
}