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
  const [library, setLibrary] = useState(null)

  useEffect(() => {
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    })
  }, [])

  const initLibrary = (provider) => {
    if (library) {
      library.setProvider(provider)
    } else {
      setLibrary(new Library(provider, { onEvent: dispatch }))
    }
  }

  async function getProvider(refresh) {
    if (refresh && web3Modal) {
      web3Modal.clearCachedProvider()
    }
    try {
      const provider = await web3Modal.connect()
      return provider
    } catch (e) {
      return null
    }
  }

  function connectWallet(refresh = false) {
    getProvider(refresh).then((provider) => {
      if (provider) initLibrary(provider)
    })
  }

  return [connectWallet, library]
}
