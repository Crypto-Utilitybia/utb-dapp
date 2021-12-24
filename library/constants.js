import NFT_Avalanche from './jsons/NFT_Avalanche.json'

export const ZERO = '0x0000000000000000000000000000000000000000'

export const mainnets = [43114, 56]
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
  56: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  97: {
    chainId: '0x61',
    chainName: 'Binance Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
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
    manuals: [],
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
    manuals: [
      {
        value: '0xDffAda13dF74E915514CDdadbAC6c7d2679080E4',
        chainId: 56,
        name: 'Annex',
        label: 'ANN',
        decimals: 18,
        logoURI: 'https://www.annex.finance/images/ANN_200x200.png',
      },
    ],
    nfts: NFT_Avalanche,
    coin: 'https://info.pangolin.exchange/#/token',
    marketplace: 'https://nftrade.com/assets/avalanche',
  },
  56: {
    rpc: 'https://bsc-dataseed.binance.org',
    block: 'https://bscscan.com/blocks',
    address: 'https://bscscan.com/address',
    tx: 'https://bscscan.com/tx',
    graph: 'https://api.thegraph.com/subgraphs/name/crypto-utilitybia/utilitybia-bsc',
    tokens: 'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
    stables: '',
    manuals: [
      {
        value: '0x98936Bde1CF1BFf1e7a8012Cee5e2583851f2067',
        chainId: 56,
        name: 'Annex',
        label: 'ANN',
        decimals: 18,
        logoURI: 'https://www.annex.finance/images/ANN_200x200.png',
      },
    ],
    nfts: [],
    coin: 'https://pancakeswap.finance/info/token',
    marketplace: '',
  },
  97: {
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    block: 'https://testnet.bscscan.com/blocks',
    address: 'https://testnet.bscscan.com/address',
    tx: 'https://testnet.bscscan.com/tx',
    graph: 'https://api.thegraph.com/subgraphs/name/crypto-utilitybia/utilitybia-bsctes',
    tokens: 'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
    stables: '',
    manuals: [
      {
        value: '0xB8d4DEBc77fE2D412f9bA5B22B33A8f6c4d9aE1e',
        chainId: 97,
        name: 'Annex',
        label: 'ANN',
        decimals: 18,
        logoURI: 'https://www.annex.finance/images/ANN_200x200.png',
      },
    ],
    nfts: [],
    coin: 'https://pancakeswap.finance/info/token',
    marketplace: '',
  },
}
