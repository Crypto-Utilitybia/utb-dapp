import { createContext, useCallback, useEffect, useReducer, useState } from 'react'
import axios from 'services/axios'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { WalletLink } from 'walletlink'
import { defaultNetwork, LIBRARY_FETCH_TIME, links, networks, supported } from 'library/constants'
import AvaxCoinLib from 'library'

let web3Modal
let walletLink = {}

export const WalletContext = createContext(null)

function contractReducer(state, { type, data }) {
  switch (type) {
    case 'ACCOUNT':
      state = {
        ...state,
        account: data,
      }
      if (!data) {
        web3Modal.clearCachedProvider()
        if (web3Modal.cachedProvider === 'custom-walletlink') {
          walletLink.provider.close()
          walletLink.connector.disconnect()
        }
      }
      break
    case 'LIBRARY':
      const [key, lib] = data
      state = {
        ...state,
        contracts: {
          ...state.contracts,
          [key]: lib,
        },
      }
      break
    default:
      console.log(type, data)
      break
  }
  return state
}

export default function WalletProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [library, setLibrary] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [paused, setPaused] = useState([-1, 0, -1])
  const [{ account, contracts }, dispatch] = useReducer(contractReducer, { account: null, contracts: {} })
  const connected = account?.address && supported.includes(account?.network)

  useEffect(() => {
    async function init() {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID, // Required
          },
        },
        'custom-walletlink': {
          display: {
            logo: '/images/wallet/Coinbase Wallet.png',
            name: 'Coinbase',
            description: 'Scan with WalletLink to connect',
          },
          options: {
            appName: 'Crypto Utilitybia', // Your app name
            networkUrl: `https://api.avax.network/ext/bc/C/rpc`,
            chainId: defaultNetwork,
          },
          package: WalletLink,
          connector: async (_, options) => {
            const { appName, networkUrl, chainId } = options
            if (!walletLink.connector) {
              walletLink.connector = new WalletLink({ appName })
            }
            if (!walletLink.provider) {
              walletLink.provider = walletLink.connector.makeWeb3Provider(networkUrl, chainId)
            }
            await walletLink.provider.enable()
            return walletLink.provider
          },
        },
      }

      web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
      })

      let provider = links[defaultNetwork].rpc
      let connected = false
      if (web3Modal.cachedProvider) {
        try {
          const cached = await web3Modal.connect()
          if (cached) {
            provider = cached
            connected = true
          }
        } catch (e) {
          web3Modal.clearCachedProvider()
        }
      }

      const library = new AvaxCoinLib({
        network: defaultNetwork,
        provider,
        onEvent: (type, data) => {
          dispatch({ type, data })
        },
        connected,
        initial: ['avaxcoin', 'marketplace'],
      })

      setLibrary(library)
    }
    init()
  }, [])

  const fetchData = useCallback(() => {
    if (contracts.avaxcoin) {
      contracts.avaxcoin.methods
        .totalSupply()
        .then(Number)
        .then((totalSupply) => {
          if (totalSupply !== metadata?.totalSupply) {
            axios
              .get(`/api/avaxcoin/metadata?network=${account?.network || contracts.avaxcoin.network}`)
              .then(({ data }) => data)
              .then(setMetadata)
              .catch(console.log)
          }
        })
        .catch(console.log)
      if (contracts.marketplace) {
        Promise.all([
          contracts.avaxcoin.methods.paused(),
          contracts.avaxcoin.methods.mintFee(),
          contracts.marketplace.methods.paused(),
        ])
          .then(([claimPaused, mintFee, tradePaused]) =>
            setPaused([claimPaused, contracts.avaxcoin.web3.utils.fromWei(mintFee), tradePaused])
          )
          .catch(console.log)
      }
    }
  }, [account, contracts, metadata, setMetadata, setPaused])

  useEffect(() => {
    fetchData()
    const timer = setInterval(() => fetchData(), LIBRARY_FETCH_TIME)
    return () => clearInterval(timer)
  }, [contracts, fetchData])

  async function connectWallet() {
    if (web3Modal) {
      web3Modal.clearCachedProvider()
    }
    try {
      setLoading(true)
      const provider = await web3Modal.connect()
      library.connect(provider)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  function switchNetwork(network) {
    library.web3.currentProvider
      .request({
        method: 'wallet_addEthereumChain',
        params: [networks[network]],
      })
      .then(console.log)
      .catch(console.log)
  }

  return (
    <WalletContext.Provider
      value={{ loading, connected, connectWallet, switchNetwork, account, library, contracts, paused, metadata }}
    >
      {children}
    </WalletContext.Provider>
  )
}
