import AvaxCoinABI from './abi/AvaxCoin.json'
import { call, send } from './utils'

export default class AvaxCoin {
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
    this.contract = new this.web3.eth.Contract(AvaxCoinABI, this.netAddresses.AvaxCoin)
    this.methods = {
      paused: call(this.contract.methods.paused),
      mintFee: call(this.contract.methods.mintFee),
      mint: send(this.contract.methods.mint),
      getRewards: call(this.contract.methods.getRewards),
      claimRewards: send(this.contract.methods.claimRewards),
      totalSupply: call(this.contract.methods.totalSupply),
      balanceOf: call(this.contract.methods.balanceOf),
      tokenOfOwnerByIndex: call(this.contract.methods.tokenOfOwnerByIndex),
      ownerOf: call(this.contract.methods.ownerOf),
      tokenURI: call(this.contract.methods.tokenURI),
      transferFrom: send(this.contract.methods.transferFrom),
      isApprovedForAll: call(this.contract.methods.isApprovedForAll),
      setApprovalForAll: send(this.contract.methods.setApprovalForAll),
    }
  }
}
