import fs from 'fs'
import Web3 from 'web3'
import { addresses, isMainnet, links } from 'library/constants'
import Collection from 'library/data/Collection.json'

const ABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export default function handler(req, res) {
  const { network = process.env.NEXT_PUBLIC_NETWORK } = req.query
  const web3 = new Web3(links[network].rpc)
  const contract = new web3.eth.Contract(ABI, addresses[network].AvaxCoin)
  const onMainnet = isMainnet(Number(network))
  contract.methods
    .totalSupply()
    .call()
    .then(Number)
    .then((supply) => {
      const jsonPath = `./public/assets/${network}/metadata.json`
      let data = {
        totalSupply: 0,
        collections: {},
      }
      if (fs.existsSync(jsonPath)) {
        data = JSON.parse(fs.readFileSync(jsonPath))
      } else {
        fs.writeFileSync(jsonPath, JSON.stringify(data))
      }
      if (supply !== data.totalSupply) {
        if (supply > data.totalSupply) {
          for (let i = data.totalSupply + 1; i <= supply; i++) {
            const token = onMainnet ? i : 1
            data.collections[i] = {
              Tier: Collection.Tier[token],
              Type: Collection.Type[token],
              Index: Collection.Index[token],
            }
          }
        } else {
          data.collections = {}
          for (let i = 1; i <= supply; i++) {
            const token = onMainnet ? i : 1
            data.collections[i] = {
              Tier: Collection.Tier[token],
              Type: Collection.Type[token],
              Index: Collection.Index[token],
            }
          }
        }
        data.totalSupply = supply
        fs.writeFileSync(jsonPath, JSON.stringify(data))
        res.status(200).json(fs.readFileSync(jsonPath))
      } else {
        res.status(200).json(fs.readFileSync(jsonPath))
      }
    })
    .catch((error) => res.status(500).json({ message: 'Something went wrong', error }))
}
