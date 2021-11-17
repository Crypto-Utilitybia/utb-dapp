import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getAsset } from 'library/queries'
import { getGraph, handleTransaction } from 'library/utils'
import styles from './Asset.module.css'
import { links, utilityABIs } from 'library/constants'
import axios from 'axios'
import BigNumber from 'bignumber.js'

export default function AssetContainer({ state, library }) {
  const router = useRouter()
  const { id } = router.query
  const [asset, setAsset] = useState(null)
  const [status, setStatus] = useState(0)
  const [amount, setAmount] = useState(1)

  const fetchData = useCallback(
    (id) => {
      const [address, index] = id.split('-')
      const abi = utilityABIs[state.account.network][address]
      const contract = library.getContract(address, abi, true)

      Promise.all([getGraph(state.account.network, getAsset(id)), library.contractCall(contract, 'mints', [index])])
        .then(([{ asset }, mints]) =>
          Promise.all(
            asset.asset.map((uri) => axios.get(`${process.env.NEXT_PUBLIC_IPFS_BASE}${uri}`).then(({ data }) => data))
          )
            .then((uris) =>
              setAsset({
                ...asset,
                metadatas: uris.map((item) => ({
                  ...item,
                  name: item.attributes.find((item) => item.trait_type === 'State').value,
                })),
                promo: `${process.env.NEXT_PUBLIC_IPFS_BASE}${asset.promo}`,
                priceShow: library.fromWei(asset.price),
                limit: Number(asset.limit),
                mints: Number(mints),
              })
            )
            .catch(console.log)
        )
        .catch(console.log)
    },
    [library, state.account.network]
  )

  useEffect(() => {
    fetchData(id)
  }, [id, fetchData])

  const [txHash, setTxHash] = useState('')
  const handleSubmit = () => {
    const [address, index] = id.split('-')
    const abi = utilityABIs[state.account.network][address]
    const contract = library.getContract(address, abi, true)
    const transaction = library.contractSend(contract, 'buyItem', [
      index,
      amount,
      {
        from: state.account.address,
        value: new BigNumber(asset.price).times(amount).toString(),
      },
    ])
    handleTransaction(transaction, setTxHash, () => {
      fetchData(id)
    })
  }

  return (
    <section className={styles.container}>
      <i className="fa fa-arrow-left back" onClick={() => router.back()} />
      {asset && (
        <>
          <h1>
            {asset.name}{' '}
            <span>
              ({asset.mints}/{asset.limit})
            </span>
          </h1>
          <img src={asset.metadatas[status].image} className={styles.image} />
          <div className={styles.asset}>
            {asset.metadatas.map((metadata, index) => (
              <div
                key={metadata.image}
                className={`${styles.status} ${index === status ? styles.active : ''}`}
                onClick={() => setStatus(index)}
              >
                <p>{metadata.name}</p>
                <img src={metadata.image} />
              </div>
            ))}
          </div>
          <div className={styles.buttons}>
            <button className={styles.ticker} onClick={() => setAmount(Math.max(amount - 1, 1))} disabled={amount <= 0}>
              <i className="fa fa-minus" />
            </button>
            <button className={styles.buy} onClick={handleSubmit}>
              Buy {amount} ({(asset.priceShow * amount).toFixed(2)} <img src="/coins/avax.png" />)
            </button>
            <button className={styles.ticker} onClick={() => setAmount(amount + 1)}>
              <i className="fa fa-plus" />
            </button>
          </div>
          {txHash && (
            <div className={styles.txHash}>
              <a href={`${links[state.account.network].tx}/${txHash}`} target="_blank" rel="noreferrer">
                View on Explorer
              </a>
            </div>
          )}
        </>
      )}
    </section>
  )
}
