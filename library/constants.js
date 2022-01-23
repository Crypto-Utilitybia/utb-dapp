import NFT_Avalanche from './jsons/NFT_Avalanche.json'
import NFT_Fuji from './jsons/NFT_Fuji.json'

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
    manuals: [
      {
        value: '0xD81D45E7635400dDD9c028839e9a9eF479006B28',
        chainId: 43114,
        name: 'Embr',
        label: 'EMBR',
        decimals: 18,
        logoURI: 'https://app.embr.finance/img/embr.f76243fa.png',
      },
    ],
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
        value: '0xe85242655AAa2295D2674AD2F711F6FaEEC6B8F6',
        chainId: 43113,
        name: 'Embr',
        label: 'EMBR',
        decimals: 18,
        logoURI: 'https://app.embr.finance/img/embr.f76243fa.png',
      },
    ],
    nfts: NFT_Fuji,
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

export const contracts = {
  43113: {
    AssetStore: '0x51440D3d08a7ea578389D7318cCe76bCe5Bdcb06',
  },
}

export const ipfsMap = {
  QmahbX13Zkk8Th3i3cwzasqdLhNMbJtdY1JbC7B7WnfqpM: 'https://www.utilitybia.finance/products/gift-box/promo.png',
  QmYQNngu73dkGp5nprzYzcUCNLBAaDr4JTLJjT5FvEkWv8:
    'https://www.utilitybia.finance/products/gift-box/raider/metadata/1.json',
  QmWQ8T92ifgPUmfFXj3ALEK9ywtuw2rAYkhYLthy5NThrB:
    'https://www.utilitybia.finance/products/gift-box/raider/images/1.png',
  QmST8ZFUSCENCATVVR4e2NmJQFDRiYekYzkXC7pXeWbZYF:
    'https://www.utilitybia.finance/products/gift-box/raider/metadata/2.json',
  QmaaZ328cVNTpkvpF1vcVSHMwxbN4ZeJ3rdJ3rkgYbEYkj:
    'https://www.utilitybia.finance/products/gift-box/raider/images/2.png',
  QmUPHRG9YB5JkDoEd8SCpH1jjJM3f55D9dQUC4Cv1rVZfW:
    'https://www.utilitybia.finance/products/gift-box/raider/metadata/3.json',
  QmfRp1yXV86xuUw5EicxBkAbuMkuQ85akt4Yejg5QePnqX:
    'https://www.utilitybia.finance/products/gift-box/raider/images/3.png',
  QmPYWzo1QscY8KRu5sWcrD4buTXrtFTJmECvdro5Ad8Zv1:
    'https://www.utilitybia.finance/products/gift-box/popular/metadata/1.json',
  QmVDV5yrnvNtLrWD9XiuoLiT3rBSoCdTghL4ErEoKNoj6r:
    'https://www.utilitybia.finance/products/gift-box/popular/images/1.png',
  QmfHRJ3HLJU9Gr33HX1FYHjuy1HA9BAcrZCvmo4syvNNDo:
    'https://www.utilitybia.finance/products/gift-box/popular/metadata/2.json',
  QmeeSJC79C6NJS18FqcmhCPVMcvYMSfxLDtwgZUKwYuw7c:
    'https://www.utilitybia.finance/products/gift-box/popular/images/2.png',
  QmScEDMCBneK4fvs1w2wWnZqvrYoCJfUvRg7CiBUojaAsA:
    'https://www.utilitybia.finance/products/gift-box/popular/metadata/3.json',
  Qmd8XdBRxPioqLZdrL94pHgL3cNTZMTDtpzCmsvDkQEPCb:
    'https://www.utilitybia.finance/products/gift-box/popular/images/3.png',
  QmViYogtrUpvH7bhu1p46cy7LdaeCt5TvZxrXE8aDyv29K:
    'https://www.utilitybia.finance/products/gift-box/song/metadata/1.json',
  Qmet51etqDJUwkQJCYwxeNTwfjf1aX2Mdccu6mE2a5LB2t: 'https://www.utilitybia.finance/products/gift-box/song/images/1.png',
  QmaQ1uiCJGpmixW69opknqJXHAhmRpcThjJbkWojMa5kpu:
    'https://www.utilitybia.finance/products/gift-box/song/metadata/2.json',
  QmQvrvxDnXiYUAUYAKqWtLomdRpFDwjGo23r7ArY38LNfr: 'https://www.utilitybia.finance/products/gift-box/song/images/2.png',
  QmaHMX7YyMRwbej73hgwXkRMsDg1Wbk8tuMF7AGjxKhhJU:
    'https://www.utilitybia.finance/products/gift-box/song/metadata/3.json',
  QmRo9x9JGbFCVAWv6cpF1qbWtgswgbC233ptuNsoCj7q9Z: 'https://www.utilitybia.finance/products/gift-box/song/images/3.png',
}
