import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAssets } from 'library/queries'
import { getGraph } from 'library/utils'
import styles from './Product.module.css'
import { utilityABIs } from 'library/constants'

export default function ProductContainer({ state, library }) {
  const [name, setName] = useState('')
  const [assets, setAssets] = useState([])
  const [, setEnd] = useState(false)
  const router = useRouter()
  const { address } = router.query

  const fetchData = useCallback(
    (address) => {
      const abi = utilityABIs[state.account.network][address]
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
                  price: library.fromWei(item.price),
                  limit: Number(item.limit),
                  mints: Number(mints),
                }))
              )
            )
            .catch(console.log)
        })
        .catch(console.log)
    },
    [library, state.account.network]
  )

  useEffect(() => {
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
                {item.price} <img src="/coins/avax.png" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
