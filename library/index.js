import Web3 from 'web3'
import * as EvmChains from 'evm-chains'
import BigNumber from 'bignumber.js'

import Utilitybia from './abi/Utilitybia.json'
import Utility from './abi/Utility.json'
import UTBGiftBox from './abi/UTBGiftBox.json'
import { call, send } from './utils'

const abis = {
  Utilitybia,
  Utility,
  UTBGiftBox,
}

export default class Library {
  constructor(provider, options) {
    this.connected = false
    this.handleEvent = options.onEvent
    this.contracts = {}
    this.setProvider(provider)
  }

  get currentNetwork() {
    return this.account?.network
  }

  get web3() {
    return this.instance
  }

  toWei(value, decimals = 18) {
    return decimals === 18
      ? this.web3.utils.toWei(value.toString())
      : new BigNumber(value).times(10 ** decimals).toString(10)
  }

  fromWei(value, decimals = 18) {
    return decimals === 18
      ? this.web3.utils.fromWei(value.toString())
      : new BigNumber(value).div(10 ** decimals).toString(10)
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
    if (this.web3) {
      if (this.web3.givenProvider.removeAllListeners) {
        this.web3.givenProvider.removeAllListeners('accountsChanged')
        this.web3.givenProvider.removeAllListeners('chainChanged')
        this.web3.givenProvider.removeAllListeners('disconnect')
      }
      this.web3.setProvider(prov)
    } else {
      this.instance = new Web3(prov)
    }
    if (prov.on) {
      prov.on('accountsChanged', () => this.fetchAccount())
      prov.on('chainChanged', () => this.fetchAccount())
      prov.on('disconnect', () => this.disconnect())
    }
    this.connected = true
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
        this.handleEvent({ type: 'ACCOUNT', payload: this.account })
      }
      return isNew
    } catch (e) {
      console.log(e)
      return false
    }
  }

  getContract(address, abi, save) {
    if (this.contracts[address]) {
      return this.contracts[address]
    }
    if (save) {
      this.contracts[address] = new this.web3.eth.Contract(abis[abi], this.web3.utils.toChecksumAddress(address))
      return this.contracts[address]
    } else {
      return new this.web3.eth.Contract(abis[abi], this.web3.utils.toChecksumAddress(address))
    }
  }

  contractCall(contract, method, params = []) {
    return call(contract.methods[method])(...params)
  }

  contractSend(contract, method, params = []) {
    return send(contract.methods[method])(...params)
  }
}
