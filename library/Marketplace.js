import MarketplaceABI from './abi/Marketplace.json'
import { call, send } from './utils'

export default class Marketplace {
  constructor(network, web3, addresses) {
    this.network = network
    this.web3 = web3
    this.addresses = addresses
    this.init()
  }

  get netAddresses() {
    return this.addresses[this.network]
  }

  reset(network) {
    if (network && this.addresses[network]) this.network = network
    this.init()
  }

  init() {
    this.contract = new this.web3.eth.Contract(
      MarketplaceABI,
      this.netAddresses.Marketplace
    )
    this.methods = {
      paused: call(this.contract.methods.paused),
      tokenMap: call(this.contract.methods.tokenMap),
      list: send(this.contract.methods.list),
      totalListings: call(this.contract.methods.totalListings),
      getTokenListing: call(this.contract.methods.getTokenListing),
      updatePrice: send(this.contract.methods.updatePrice),
      fulfill: send(this.contract.methods.fulfill),
      cancel: send(this.contract.methods.cancel),
    }
  }
}
