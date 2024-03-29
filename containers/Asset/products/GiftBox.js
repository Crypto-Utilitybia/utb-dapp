import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { getAsset } from 'library/queries'
import { getGraph, handleTransaction } from 'library/utils'
import styles from '../Asset.module.css'
import { contracts, ipfsMap, links } from 'library/constants'
import BigNumber from 'bignumber.js'
import Loading from 'components/Loading/Loading'
import Coin from 'components/Coin/Coin'

export default function GiftBox({ state, library }) {
  const router = useRouter()
  const { id } = router.query
  const [asset, setAsset] = useState(null)
  const [status, setStatus] = useState(1)
  const [amount, setAmount] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => setLoading(false), [asset])

  const fetchData = useCallback(
    (id) => {
      setLoading(true)
      const [, index] = id.split('-')
      getGraph(state.account.network, getAsset(`${contracts[state.account.network].AssetStore.toLowerCase()}-${index}`))
        .then(({ asset }) =>
          Promise.all(
            asset.asset
              .map((uri) => ipfsMap[uri] || uri)
              .map((uri) =>
                axios
                  .get(uri.startsWith('http') ? uri : `${process.env.NEXT_PUBLIC_IPFS_BASE}${uri}`)
                  .then(({ data }) => data)
              )
          )
            .then((uris) =>
              setAsset({
                ...asset,
                metadatas: uris.map((item) => ({
                  ...item,
                  name: item.attributes.find((item) => item.trait_type === 'State').value,
                })),
                promo:
                  ipfsMap[asset.promo] ||
                  (asset.promo.startsWith('http') ? asset.promo : `${process.env.NEXT_PUBLIC_IPFS_BASE}${asset.promo}`),
                price: asset.price,
                priceShow: library.fromWei(asset.price),
                stock: Number(asset.stock),
              })
            )
            .catch(console.log)
        )
        .catch(console.log)
    },
    [library, state.account]
  )

  useEffect(() => {
    fetchData(id)
  }, [id, fetchData])

  const [txHash, setTxHash] = useState('')
  const handleSubmit = () => {
    const [address] = id.split('-')
    const contract = library.getContract(address, 'UTBGiftBox', true)
    const transaction = library.contractSend(contract, 'mint', [
      asset.utilityIndex,
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
          {state.account.network === 56 && (
            <a className={styles.promo} href="https://www.annex.finance/" target="_blank" rel="noreferrer">
              <img src="https://www.utilitybia.finance/products/mystery-box/annex/banner.png" />
            </a>
          )}
          <h1>
            {asset.name} <span>({asset.stock})</span>
          </h1>
          <div className={styles.form}>
            <img src={asset.metadatas[status].image} className={styles.image} />
            {/* <div className={styles.asset}>
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
            </div> */}
            <div className={styles.buttons}>
              <button
                className={`${styles.ticker} ${styles.left}`}
                onClick={() => setAmount(Math.max(amount - 1, 1))}
                disabled={amount <= 0}
              >
                <i className="fa fa-minus" />
              </button>
              <button className={styles.buy} onClick={handleSubmit}>
                Buy {amount} ({(asset.priceShow * amount).toFixed(3)} <Coin network={state?.account?.network} />)
              </button>
              <button className={`${styles.ticker} ${styles.right}`} onClick={() => setAmount(amount + 1)}>
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
          </div>
        </>
      )}
      {loading && <Loading />}
    </section>
  )
}
