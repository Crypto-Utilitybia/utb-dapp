import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAssets, getUtility } from 'library/queries'
import { getGraph } from 'library/utils'
import styles from './Product.module.css'
import Loading from 'components/Loading/Loading'
import Coin from 'components/Coin/Coin'
import { ipfsMap } from 'library/constants'

const products = {
  'gift-box': '0x64A6d08DE0cC1B0f8002DB98e16831E329e53BD9',
  'mystery-box': '0x8a323cF1dD8e5E03DC73B8285912ff8c7B677c02',
}

export default function ProductContainer({ state, library }) {
  const [name, setName] = useState('')
  const [assets, setAssets] = useState([])
  const [, setEnd] = useState(false)
  const router = useRouter()
  const { address } = router.query
  const [loading, setLoading] = useState(true)

  useEffect(() => setLoading(false), [assets])

  const fetchData = useCallback(
    (address) => {
      setLoading(true)
      getGraph(state.account.network, getUtility(address.toLowerCase()))
        .then(({ utility: { token } }) => {
          const contract = library.getContract(token, 'ERC721', true)
          Promise.all([
            library.contractCall(contract, 'name'),
            getGraph(state.account.network, getAssets({ filter: `author: "${address}"` })),
          ])
            .then(([name, { assets }]) => {
              setName(name.replace('Utilitybia - ', ''))
              setEnd(assets.length < 10)
              setAssets(
                assets.map((item) => ({
                  ...item,
                  promo:
                    ipfsMap[item.promo] ||
                    (item.promo.startsWith('http') ? item.promo : `${process.env.NEXT_PUBLIC_IPFS_BASE}${item.promo}`),
                  price: library.fromWei(item.price),
                  stock: Number(item.stock),
                }))
              )
            })
            .catch(console.log)
        })
        .catch(console.log)
    },
    [library, state.account.network]
  )

  useEffect(() => {
    if (products[address]) {
      router.replace(`/product/${products[address].toLowerCase()}`)
    }
    fetchData(address)
  }, [address, fetchData])

  return (
    <section className={styles.container}>
      {state.account.network === 56 && (
        <a className={styles.promo} href="https://www.annex.finance/" target="_blank" rel="noreferrer">
          <img src="https://www.utilitybia.finance/products/mystery-box/annex/banner.png" />
        </a>
      )}
      <h1>{name}</h1>
      <div className={styles.assets}>
        {assets.map((item) => (
          <Link href={`/asset/${address}-0x${item.index.toString(16)}`} key={item.id}>
            <div className={styles.asset}>
              <p className={styles.status}>
                {item.name}&nbsp;
                <span>({item.stock})</span>
              </p>
              <img src={item.promo} />
              <p className={styles.price}>
                {item.price} <Coin network={state.account.network} />
              </p>
            </div>
          </Link>
        ))}
      </div>
      {loading && <Loading />}
    </section>
  )
}
