import * as EvmChains from 'evm-chains'

import Web3 from 'web3'
import { addresses, ACCOUNT_FETCH_TIME } from './constants'
import AvaxCoin from './AvaxCoin'
import Marketplace from './Marketplace'

export default class AvaxCoinLib {
  constructor(options) {
    this.connected = false
    this.network = options.network
    this.instance = new Web3(options.provider)
    this.handleEvent = options.onEvent
    this.registers = []
    this.libraries = {}
    this.timer = Number(
      setInterval(() => {
        this.fetchAccount()
      }, ACCOUNT_FETCH_TIME)
    )
    if (options.connected) {
      this.connect(options.provider)
    }
    if (options.initial) {
      options.initial.map((reg) => this.register(reg))
    }
  }

  get currentNetwork() {
    return this.account ? this.account.network : this.network
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

  updateProvider(prov) {
    if (!prov) return
    clearInterval(this.timer)
    this.setProvider(prov)
    this.fetchAccount()
  }

  disconnect() {
    if (this.web3.givenProvider.disconnect) {
      this.web3.givenProvider.disconnect()
    }
    this.connected = false
    this.account = null
    this.handleEvent('ACCOUNT', this.account)
  }

  register(key) {
    let lib = null
    if (this.libraries[key]) return
    switch (key) {
      case 'avaxcoin':
        lib = new AvaxCoin(this.currentNetwork, this.web3, addresses)
        break
      case 'marketplace':
        lib = new Marketplace(this.currentNetwork, this.web3, addresses)
        break
      default:
        break
    }
    if (!lib) return
    this.libraries[key] = lib
    this.registers.push(key)
    this.handleEvent('LIBRARY', [key, lib])
  }

  deRegister(key) {
    this.registers = this.registers.filter((k) => k !== key)
    delete this.libraries[key]
  }

  setProvider(prov) {
    // if (this.web3.givenProvider.disconnect) {
    //   this.web3.givenProvider.disconnect()
    // }
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

    this.registers.map((key) => this.libraries[key].reset())
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
        // console.log(e)
      }
      const networkChanged = network !== this.currentNetwork
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
        if (networkChanged) {
          this.registers.map((key) => this.libraries[key].reset(this.currentNetwork))
        }
      }
      return isNew
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
