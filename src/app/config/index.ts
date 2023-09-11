export const alchemyKey = '8yJmzhHSP7hR2n6AV4Wqkd3hbeQTy7oH'

import { Network, Alchemy } from "alchemy-sdk";

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: alchemyKey, // Replace with your Alchemy API Key.
  network: Network.ETH_GOERLI, // Replace with your network.
};

export const alchemyI = new Alchemy(settings);