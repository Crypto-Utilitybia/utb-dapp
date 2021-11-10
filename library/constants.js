export const ZERO = '0x0000000000000000000000000000000000000000'
export const ACCOUNT_FETCH_TIME = 5 * 1000
export const LIBRARY_FETCH_TIME = 15 * 1000

export const mainnets = [43114]

export const supported = process.env.NETWORKS

export const isMainnet = (networkId) => mainnets.includes(networkId)

export const defaultNetwork = Number(process.env.NEXT_PUBLIC_NETWORK || mainnets[0])

export const saleStart = new Date('2021-10-14T15:00-05:00').getTime()

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
    blockExplorerUrls: ['https://cchain.explorer.avax.network/'],
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
    blockExplorerUrls: ['https://cchain.explorer.avax-test.network/'],
  },
}

export const links = {
  43114: {
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    block: 'https://cchain.explorer.avax.network/blocks',
    address: 'https://cchain.explorer.avax.network/address',
    tx: 'https://cchain.explorer.avax.network/tx',
    graph: 'https://api.thegraph.com/subgraphs/name/levan-k/avax-coins',
  },
  43113: {
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    block: 'https://cchain.explorer.avax-test.network/blocks',
    address: 'https://cchain.explorer.avax-test.network/address',
    tx: 'https://cchain.explorer.avax-test.network/tx',
    graph: 'https://api.thegraph.com/subgraphs/name/levan-k/avaxcoin-fuji',
  },
}

export const addresses = {
  43114: {
    AvaxCoin: '0xdb350245d143a8B575d909B1fa93df99844264B0',
    Marketplace: '0xbBe27fB7c661c0CCC5779B3dCF1Ab6405e9Ec1D5',
  },
  43113: {
    AvaxCoin: '0x97094290fb6290234E1adA1775Ad38D3Ab1694A1',
    Marketplace: '0x53eEc9d7570E198bf1c472d6E4766f7F7C119B1D',
  },
}
