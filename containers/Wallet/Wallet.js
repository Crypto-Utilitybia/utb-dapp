import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { getTokens } from 'library/queries'
import { getGraph } from 'library/utils'
import styles from './Wallet.module.css'
import Loading from 'components/Loading/Loading'

export default function WalletContainer({ state }) {
  const [utilities, setUtilities] = useState([])
  const [, setEnd] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => setLoading(false), [utilities])

  const fetchData = useCallback(() => {
    setLoading(true)
    getGraph(state.account.network, getTokens(state.account.address))
      .then(({ tokens }) => {
        setEnd(tokens.length < 10)
        Promise.all(
          tokens.map((item) => Promise.all([Promise.resolve(item), axios.get(item.tokenURI).then(({ data }) => data)]))
        )
          .then((data) =>
            setUtilities(
              data.map(([item, metadata]) => ({
                ...item,
                metadata,
                tokenId: item.id.split('-')[1],
                token: item.id.split('-')[0],
              }))
            )
          )
          .catch(console.log)
      })
      .catch(console.log)
  }, [state.account])

  useEffect(() => {
    fetchData()
  }, [state.account, fetchData])

  return (
    <section className={styles.container}>
      <h1>My Utilities</h1>
      <div className={styles.utilities}>
        {utilities.map((item) => (
          <Link href={`/token/${item.id}`} key={item.id}>
            <div className={styles.utility}>
              <p className={styles.title}>
                {item.asset.name} #{Number(item.tokenId)}
              </p>
              <img src={item.metadata.image} />
            </div>
          </Link>
        ))}
      </div>
      {loading && <Loading />}
    </section>
  )
}
