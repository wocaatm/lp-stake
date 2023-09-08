export interface NftInfo {
  nftName?: string
  tokenId: string
  image?: string
  isStaked: boolean
  isLpStaked: boolean
}

export interface Refresh {
  setKey: (key: number) => void
  rederKey: number
}