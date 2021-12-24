import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAssets } from 'library/queries'
import { getGraph } from 'library/utils'
import styles from './Product.module.css'
import Loading from 'components/Loading/Loading'
import Coin from 'components/Coin/Coin'

const products = {
  'gift-box': '0x64A6d08DE0cC1B0f8002DB98e16831E329e53BD9',
  'mystery-box': '0x8a323cF1dD8e5E03DC73B8285912ff8c7B677c02',
}

const promoMap = {
  QmahbX13Zkk8Th3i3cwzasqdLhNMbJtdY1JbC7B7WnfqpM: 'https://www.utilitybia.finance/products/gift-box/promo.png',
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
      library
        .getContractABI(address)
        .then((abi) => {
          const contract = library.getContract(address, abi, true)
          Promise.all([
            library.contractCall(contract, 'name'),
            getGraph(state.account.network, getAssets({ filter: `utility: "${address}"` })),
          ])
            .then(([name, { assets }]) => {
              setName(name.replace('Utilitybia - ', ''))
              setEnd(assets.length < 10)
              Promise.all(
                assets.map((item) =>
                  Promise.all([Promise.resolve(item), library.contractCall(contract, 'mints', [item.index])])
                )
              )
                .then((data) =>
                  setAssets(
                    data.map(([item, mints]) => ({
                      ...item,
                      promo:
                        promoMap[item.promo] ||
                        (item.promo.startsWith('http')
                          ? item.promo
                          : `${process.env.NEXT_PUBLIC_IPFS_BASE}${item.promo}`),
                      priceOrigin: Number(item.discount) * 1000 > Date.now() ? library.fromWei(item.price) : '',
                      price:
                        Number(item.discount) * 1000 > Date.now()
                          ? (library.fromWei(item.price) * 0.9).toFixed(3)
                          : library.fromWei(item.price),
                      limit: Number(item.limit),
                      mints: Number(mints),
                    }))
                  )
                )
                .catch(console.log)
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
      <i className="fa fa-arrow-left back" onClick={() => router.back()} />
      <h1>{name}</h1>
      <div className={styles.assets}>
        {assets.map((item) => (
          <Link href={`/asset/${address}-0x${item.index.toString(16)}`} key={item.id}>
            <div className={styles.asset}>
              <p className={styles.status}>
                {item.name}&nbsp;
                <span>
                  ({item.mints}/{item.limit})
                </span>
              </p>
              <img src={item.promo} />
              <p className={styles.price}>
                {item.price}{' '}
                {item.priceOrigin && (
                  <span style={{ textDecoration: 'line-through', fontSize: '75%' }}>
                    &nbsp;{item.priceOrigin}&nbsp;
                  </span>
                )}
                <Coin network={state.account.network} />
              </p>
            </div>
          </Link>
        ))}
      </div>
      {loading && <Loading />}
    </section>
  )
}
