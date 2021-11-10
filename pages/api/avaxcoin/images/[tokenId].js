import fs from 'fs'
import { isMainnet } from 'library/constants'
import { compressImage } from '../[tokenId]'

export default function handler(req, res) {
  const { tokenId, network = process.env.NEXT_PUBLIC_NETWORK, full } = req.query
  const token = isMainnet(Number(network)) ? Number(tokenId) : 1
  const imagePath = `./public/assets/${network}/${token}.png`
  const imageComp = `./public/assets/${network}/${token}.png.comp`
  if (fs.existsSync(imageComp)) {
    if (full && fs.existsSync(imagePath)) {
      res.writeHead(200, { 'Content-Type': 'image/png' })
      res.end(fs.readFileSync(imagePath), 'binary')
    } else {
      res.writeHead(200, { 'Content-Type': 'image/png' })
      res.end(fs.readFileSync(imageComp), 'binary')
    }
  } else if (fs.existsSync(imagePath)) {
    compressImage(imagePath, imageComp)
    res.writeHead(200, { 'Content-Type': 'image/png' })
    res.end(fs.readFileSync(imagePath), 'binary')
  } else {
    res.status(404).json({ message: 'Token not found' })
  }
}
