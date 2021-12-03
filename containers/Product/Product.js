import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAssets } from 'library/queries'
import { getGraph } from 'library/utils'
import styles from './Product.module.css'
import Loading from 'components/Loading/Loading'

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
            getGraph(state.account.network, getAssets(`utility: "${address}"`)),
          ])
            .then(([name, { assets }]) => {
              setName(name)
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
                      promo: `${process.env.NEXT_PUBLIC_IPFS_BASE}${item.promo}`,
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
    if (address === 'gift-box') {
      router.replace('/product/0xf5135d3883e43af4ac00c38e54fcd2d5058c9270')
    } else {
      fetchData(address)
    }
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
                <img src="/coins/avax.png" />
              </p>
            </div>
          </Link>
        ))}
      </div>
      {loading && <Loading />}
    </section>
  )
}
