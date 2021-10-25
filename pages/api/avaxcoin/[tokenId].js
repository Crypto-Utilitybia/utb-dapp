import fs from 'fs'
import https from 'https'
import Web3 from 'web3'
import { addresses, isMainnet, links } from 'library/constants'
import sharp from 'sharp'

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

export function compressImage(filename, destname) {
  sharp(filename)
    .resize(320)
    .toFile(destname, (err, info) => {
      console.log(err, info)
    })
}

export function download(uri, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename)
    https
      .get(uri, function (response) {
        response.pipe(file)
        file.on('finish', function () {
          file.close(resolve)
        })
      })
      .on('error', function (err) {
        // Handle errors
        fs.unlinkSync(filename) // Delete the file async. (But we don't check the result)
        reject(err.message)
      })
  })
}

export default function handler(req, res) {
  const { tokenId, network = process.env.NEXT_PUBLIC_NETWORK } = req.query
  const token = isMainnet(Number(network)) ? Number(tokenId) : 1
  const web3 = new Web3(links[network].rpc)
  const contract = new web3.eth.Contract(ABI, addresses[network].AvaxCoin)

  const jsonPath = `./public/assets/${network}/${token}.json`
  const temp = `./public/assets/${network}/${token}.temp`
  const imagePath = `./public/assets/${network}/${token}.png`
  const imageComp = `./public/assets/${network}/${token}.png.comp`
  const exists = [fs.existsSync(jsonPath), fs.existsSync(imagePath) || fs.existsSync(imageComp)]
  if (exists.every((item) => item)) {
    res.status(200).json(fs.readFileSync(jsonPath))
  } else {
    contract.methods
      .totalSupply()
      .call()
      .then(Number)
      .then((supply) => {
        if (token > supply) {
          res.status(404).json({ message: 'Not Found' })
        } else {
          Promise.all([
            exists[0] ? Promise.resolve(true) : download(`${IPFS_BASE}${METADATA_CID}/${token}.json`, temp),
            exists[1] ? Promise.resolve(true) : download(`${IPFS_BASE}${IMAGE_CID}/${token}.png`, imagePath),
          ])
            .then(() => {
              if (!exists[0]) {
                const metadata = JSON.parse(fs.readFileSync(temp))
                metadata.image = `/api/avaxcoin/images/${token}`
                fs.writeFileSync(jsonPath, JSON.stringify(metadata))
                fs.unlinkSync(temp)
              }
              compressImage(imagePath, imageComp)
              res.status(200).json(fs.readFileSync(jsonPath))
            })
            .catch((error) => res.status(500).json({ message: 'Something went wrong', error }))
        }
      })
      .catch((error) => res.status(500).json({ message: 'Something went wrong', error }))
  }
}
