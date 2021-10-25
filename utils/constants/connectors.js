
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { C_CHAIN_ID } from 'config'

const NETWORK_URL = 'https://api.avax.network/ext/bc/C/rpc'

const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'Cabbage',
  appLogoUrl: 'https://raw.githubusercontent.com/avaware/assets/master/AvaxCoin/logo.png'
})

const injected = new InjectedConnector({ supportedChainIds: [C_CHAIN_ID] })
const trustWallet = new InjectedConnector({ supportedChainIds: [C_CHAIN_ID] })

const walletConnect = new WalletConnectConnector({
  rpc: {
    43114: NETWORK_URL
  },
  bridge: 'https://bridge.walletconnect.org/',
  qrcode: true,
  pollingInterval: 12000
})

export {
  injected,
  trustWallet,
  walletlink,
  walletConnect
}