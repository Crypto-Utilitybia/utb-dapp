import Web3 from 'web3'
import * as EvmChains from 'evm-chains'

export default class Library {
  constructor(provider, options) {
    this.connected = false
    this.instance = new Web3(provider)
    this.handleEvent = options.onEvent
  }

  get currentNetwork() {
    return this.account?.network
  }

  get web3() {
    return this.instance
  }

  toWei(value, decimals) {
    return decimals === 18
      ? this.web3.utils.toWei(value.toString())
      : new BigNumber(value).times(10 ** decimals).toString(10)
  }

  fromWei(value, decimals) {
    return decimals === 18
      ? this.web3.utils.fromWei(value.toString())
      : new BigNumber(value).div(10 ** decimals).toString(10)
  }

  connect(prov) {
    if (!prov) return
    this.connected = true
    this.setProvider(prov)
    this.fetchAccount()
  }

  disconnect() {
    if (this.web3.givenProvider.disconnect) {
      this.web3.givenProvider.disconnect()
    }
    this.connected = false
    this.account = null
    this.handleEvent({ type: 'ACCOUNT', payload: this.account })
  }

  setProvider(prov) {
    if (!prov) return
    if (this.web3.givenProvider.removeAllListeners) {
      this.web3.givenProvider.removeAllListeners('accountsChanged')
      this.web3.givenProvider.removeAllListeners('chainChanged')
      this.web3.givenProvider.removeAllListeners('disconnect')
    }
    this.web3.setProvider(prov)
    if (prov.on) {
      prov.on('accountsChanged', () => this.fetchAccount())
      prov.on('chainChanged', () => this.fetchAccount())
      prov.on('disconnect', () => this.disconnect())
    }
    this.fetchAccount()
  }

  checkAccount(newAccount) {
    return !this.account
      ? true
      : this.account.address === newAccount.address &&
        this.account.network === newAccount.network &&
        this.account.balance === newAccount.balance
      ? false
      : true
  }

  async fetchAccount(refresh = false) {
    if (!this.connected) return false
    try {
      const chainId = await this.web3.eth.getChainId()
      let network = chainId
      try {
        const chains = await EvmChains.getChain(chainId)
        network = chains.networkId
      } catch (e) {
        console.log(e)
      }
      const [address] = await this.web3.eth.getAccounts()
      const balance = address ? this.web3.utils.fromWei(await this.web3.eth.getBalance(address)) : '0'
      const account = {
        address,
        network,
        balance,
      }
      const isNew = this.checkAccount(account)
      if (isNew || refresh) {
        this.account = account
        this.handleEvent('ACCOUNT', this.account)
      }
      return isNew
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
