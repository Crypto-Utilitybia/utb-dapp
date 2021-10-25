import fs from 'fs'
import Web3 from 'web3'
import { addresses, isMainnet, links } from 'library/constants'
import { compressImage, download } from '../[tokenId]'

const IPFS_BASE = process.env.IPFS_BASE
const METADATA_CID = process.env.METADATA_CID
const IMAGE_CID = process.env.IMAGE_CID

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
  const { tokenId, network = process.env.NEXT_PUBLIC_NETWORK } = req.query
  const token = isMainnet(Number(network)) ? Number(tokenId) : 1
  const web3 = new Web3(links[network].rpc)
  const contract = new web3.eth.Contract(ABI, addresses[network].AvaxCoin)
  contract.methods
    .totalSupply()
    .call()
    .then(Number)
    .then((supply) => {
      if (token > supply) {
        res.status(200).json({ success: false })
      } else {
        const jsonPath = `./public/assets/${network}/${token}.json`
        const temp = `./public/assets/${network}/${token}.temp`
        const imagePath = `./public/assets/${network}/${token}.png`
        const imageComp = `./public/assets/${network}/${token}.png.comp`
        Promise.all([
          download(`${IPFS_BASE}${METADATA_CID}/${token}.json`, temp),
          download(`${IPFS_BASE}${IMAGE_CID}/${token}.png`, imagePath),
        ])
          .then(() => {
            const metadata = JSON.parse(fs.readFileSync(temp))
            metadata.image = `/api/avaxcoin/images/${token}`
            fs.writeFileSync(jsonPath, JSON.stringify(metadata))
            fs.unlinkSync(temp)
            compressImage(imagePath, imageComp)
            res.status(200).json({ success: true })
          })
          .catch(() => res.status(200).json({ success: false }))
      }
    })
    .catch(() => res.status(200).json({ success: false }))
}
