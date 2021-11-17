import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { WalletLink } from 'walletlink'
import Library from 'library'
import { links, supported } from 'library/constants'

let web3Modal

const providerOptions = {
  ...(process.env.NEXT_PUBLIC_INFURA_ID
    ? {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID, // Required
          },
        },
      }
    : {}),
  'custom-walletlink': {
    display: {
      logo: '/images/wallet/Coinbase Wallet.png',
      name: 'Coinbase',
      description: 'Scan with WalletLink to connect',
    },
    options: {
      appName: 'Crypto Utilitybia', // Your app name
      networkUrl: links[supported[0]].rpc,
      chainId: supported[0],
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

export default function useWallet(dispatch) {
  const [loading, setLoading] = useState(true)
  const [library, setLibrary] = useState(null)

  useEffect(() => {
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    })

    if (web3Modal.cachedProvider) {
      connectWallet()
    } else {
      setLoading(false)
    }
  }, [])

  const initLibrary = (provider) => {
    if (library) {
      library.setProvider(provider)
    } else {
      setLibrary(new Library(provider, { onEvent: dispatch }))
    }
  }

  async function getProvider() {
    if (web3Modal) {
      web3Modal.clearCachedProvider()
    }
    try {
      const provider = await web3Modal.connect()
      return provider
    } catch (e) {
      return null
    }
  }

  function connectWallet(logout) {
    if (logout) {
      library.disconnect()
      web3Modal.clearCachedProvider()
      loading && setLoading(false)
      console.log(web3Modal)
    } else {
      getProvider()
        .then((provider) => {
          if (provider) initLibrary(provider)
          else setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }

  return [loading, connectWallet, library]
}
