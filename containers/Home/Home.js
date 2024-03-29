import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { getUtilities } from 'library/queries'
import { getGraph } from 'library/utils'
import styles from './Home.module.css'
import { ipfsMap } from 'library/constants'

export default function HomeContainer({ state, library }) {
  const [utilities, setUtilities] = useState([])
  const [, setEnd] = useState(false)

  const fetchData = useCallback(() => {
    getGraph(state.account.network, getUtilities())
      .then(({ utilities }) => {
        setEnd(utilities.length < 10)
        Promise.all(
          utilities.map((item) => {
            const contract = library.getContract(item.address, 'Utility')
            return Promise.all([Promise.resolve(item), library.contractCall(contract, 'promo')])
          })
        )
          .then((data) =>
            setUtilities(
              data.map(([item, promo]) => ({
                ...item,
                promo:
                  ipfsMap[promo] || (promo.startsWith('http') ? promo : `${process.env.NEXT_PUBLIC_IPFS_BASE}${promo}`),
              }))
            )
          )
          .catch(console.log)
      })
      .catch(console.log)
  }, [library, state.account])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <section className={styles.container}>
      {state.account.network === 56 && (
        <a className={styles.promo} href="https://www.annex.finance/" target="_blank" rel="noreferrer">
          <img src="https://www.utilitybia.finance/products/mystery-box/annex/banner.png" />
        </a>
      )}
      <h1>Welcome to Utilitybia!</h1>
      <div className={styles.utilities}>
        {utilities.map((item) => (
          <Link href={`/product/${item.address}`} key={item.id}>
            <div className={styles.utility}>
              <img src={item.promo} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
