export default function Tip() {
  return (
    <div className='w-full px-4 mt-4'>
      <div className='bg-amber-400 p-4 rounded-lg'>
        <p>⚠️ 注意事项</p>
        <ol className='list-disc ml-8 text-sm mt-4'>
          <li>参与LP质押需把对应的NFT转移到合约，该操作需要授权合约对NFT的操作权限，请仔细考虑！！</li>
          <li>已在官网质押的卡无法在LP继续质押，可先去官网取消质押之后再来操作</li>
        </ol>
      
      </div>
      <div className='bg-emerald-400 p-4 rounded-lg mt-4'>
        <p>⚠️ 为什么要参与质押？</p>
        <ol className='list-disc ml-8 text-sm mt-4'>
          <li>SSR TOOL第一期质押数据显示，参与LP质押的LMC收益（256LMC）比单卡收益（198LMC）<span className='underline decoration-red-500 text-lg'>29%</span>，第二期只会更高</li>
          <li>第二期质押要收取GAS费，组LP白嫖的LMC代币能涵盖所有GAS还能白嫖部分收益</li>
        </ol>
        <p className="mt-4">⚠️ 名词解释</p>
        <ol className='list-disc ml-8 text-sm mt-4'>
          <li>总收益：解压或者领取到的LMC总量</li>
          <li>白嫖：（LP的收益 - 单卡的收益）* 0.5 为白嫖收益，另外一半归合约所有，比例后续会根据GAS费调整</li>
          <li>收益率：组LP额外获得的LMC占单卡收益的百分比，随着LP和单卡池子质押数变化而变化，极端情况会导致LP收益没有单卡高</li>
        </ol>
      </div>
    </div>
  )
}