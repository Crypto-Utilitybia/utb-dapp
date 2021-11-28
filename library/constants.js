import NFT_Avalanche from './jsons/NFT_Avalanche.json'

export const ZERO = '0x0000000000000000000000000000000000000000'

export const mainnets = [43114]
export const supported = process.env.NEXT_PUBLIC_NETWORKS.split(',').map(Number)

export const isMainnet = (networkId) => mainnets.includes(networkId)
export const isSupported = (networkId) => supported.includes(networkId)

export const networks = {
  43114: {
    chainId: '0xa86a',
    chainName: 'Avalanche Network',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/'],
  },
  43113: {
    chainId: '0xa869',
    chainName: 'Avalanche Testnet',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/'],
  },
}

export const links = {
  43114: {
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    block: 'https://snowtrace.io/blocks',
    address: 'https://snowtrace.io/address',
    tx: 'https://snowtrace.io/tx',
    graph: 'https://api.thegraph.com/subgraphs/name/crypto-utilitybia/utilitybia-avalanche',
    tokens: 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/defi.tokenlist.json',
    stables: 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/stablecoin.tokenlist.json',
    nfts: NFT_Avalanche,
    coin: 'https://info.pangolin.exchange/#/token',
    marketplace: 'https://nftrade.com/assets/avalanche',
  },
  43113: {
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    block: 'https://testnet.snowtrace.io/blocks',
    address: 'https://testnet.snowtrace.io/address',
    tx: 'https://testnet.snowtrace.io/tx',
    graph: 'https://api.thegraph.com/subgraphs/name/crypto-utilitybia/utilitybia-fuji',
    tokens: 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/fuji.tokenlist.json',
    stables: 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/stablecoin.tokenlist.json',
    nfts: 'https://api.nftrade.com/api/v1/contracts?limit=100&skip=0&chains[]=43114&verified=true',
    coin: 'https://info.pangolin.exchange/#/token',
    marketplace: 'https://nftrade.com/assets/avalanche',
  },
}

export const addresses = {
  43114: {
    //
  },
  43113: {
    //
  },
}
