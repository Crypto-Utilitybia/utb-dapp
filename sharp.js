const path = require('path')
require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const https = require('https')
const Web3 = require('web3')
const sharp = require('sharp')

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

const web3 = new Web3('https://api.avax.network/ext/bc/C/rpc')
const contract = new web3.eth.Contract(ABI, '0xdb350245d143a8B575d909B1fa93df99844264B0')

const imageBase = './public/assets/43114'

function compressImage(filename, destname) {
  sharp(filename)
    .resize(320)
    .toFile(destname, (err, info) => {
      console.log(err, info)
    })
}

function download(uri, filename) {
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

contract.methods
  .totalSupply()
  .call()
  .then(Number)
  .then((supply) => {
    new Array(supply).fill(0).reduce(
      (a, _, index) =>
        a.then((res) => {
          console.log(res)
          return new Promise((resolve) => {
            const i = index + 1
            const imagePath = `${imageBase}/${i}.png`
            const imageComp = `${imageBase}/${i}.png.comp`
            if (fs.existsSync(imageComp)) {
              if (fs.existsSync(imagePath)) resolve(`Skip ${imageComp}`)
              else {
                setTimeout(async () => {
                  try {
                    await download(`${IPFS_BASE}${IMAGE_CID}/${i}.png`, imagePath)
                    resolve(imagePath)
                  } catch {
                    resolve(`Error ${imagePath}`)
                  }
                }, 3 * 1000)
              }
            } else {
              setTimeout(async () => {
                const jsonPath = `${imageBase}/${i}.json`
                const temp = `${imageBase}/${i}.temp`
                try {
                  await Promise.all([
                    download(`${IPFS_BASE}${METADATA_CID}/${i}.json`, temp),
                    download(`${IPFS_BASE}${IMAGE_CID}/${i}.png`, imagePath),
                  ])
                  const metadata = JSON.parse(fs.readFileSync(temp))
                  metadata.image = `/api/avaxcoin/images/${i}`
                  fs.writeFileSync(jsonPath, JSON.stringify(metadata))
                  fs.unlinkSync(temp)
                  compressImage(imagePath, imageComp)
                  resolve(imageComp)
                } catch (e) {
                  resolve(`Error ${imageComp}`)
                }
              }, 3 * 1000)
            }
          })
        }),
      Promise.resolve('Start')
    )
  })
  .catch(console.log)
