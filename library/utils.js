import axios from 'axios'
import { links } from './constants'

export const call =
  (method) =>
  (...args) =>
    method(...args).call()

export const send =
  (method) =>
  (...args) => {
    const option = args.pop()
    const transaction = method(...args)
    return {
      estimate: () => transaction.estimateGas(option),
      send: () => transaction.send(option),
      transaction,
    }
  }

export const resolvePromise = (promise, defaults) =>
  new Promise((resolve) =>
    promise.then(resolve).catch((err) => {
      console.log(err)
      resolve(defaults)
    })
  )

export const handleTransaction = (transaction, onHash, onSuccess, onFail) =>
  transaction
    .send()
    .on('transactionHash', (hash) => onHash(hash))
    .on('receipt', () => {
      onHash('')
      onSuccess && onSuccess()
    })
    .on('error', (err) => {
      console.log(err)
      onHash('')
      onFail && onFail()
    })

export function getGraph(network, query) {
  return axios({
    url: links[network].graph,
    method: 'post',
    data: {
      query,
    },
  }).then(({ data }) => data.data)
}
