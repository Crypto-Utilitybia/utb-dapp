import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getAssets, getUtilities } from 'library/queries'
import { getGraph } from 'library/utils'
import styles from './Wallet.module.css'
import Loading from 'components/Loading/Loading'

export default function WalletContainer({ state, library }) {
  const router = useRouter()
  const [utilities, setUtilities] = useState([])
  const [, setEnd] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => setLoading(false), [utilities])

  const fetchData = useCallback(() => {
    setLoading(true)
    Promise.all([getGraph(state.account.network, getUtilities()), getGraph(state.account.network, getAssets())])
      .then(([{ utilities }, { assets }]) => {
        setEnd(assets.length < 10)
        Promise.all(
          utilities
            .map((item) => ({ ...item, assets: assets.filter((asset) => item.id === asset.author).slice(0, 4) }))
            .map((item) => {
              const token = library.getContract(item.token, 'ERC721', true)
              return Promise.all([
                Promise.resolve(item),
                library.contractCall(token, 'name'),
                library.contractCall(token, 'balanceOf', [state.account.address]).then(Number),
              ])
            })
        )
          .then((utilities) => setUtilities(utilities.map(([item, name, balance]) => ({ ...item, name, balance }))))
          .catch(console.log)
      })
      .catch(console.log)
  }, [library, state.account])

  useEffect(() => {
    fetchData()
  }, [state.account, fetchData])

  return (
    <section className={styles.container}>
      <i className="fa fa-arrow-left back" onClick={() => router.back()} />
      <h1>My Utilities</h1>
      {state.account.network === 56 && (
        <p className={styles.note}>
          Note: Your boxes will be appear in 5~10 minutes due to the graph of BSC network indexing.
        </p>
      )}
      <div className={styles.utilities}>
        {utilities.map((item) => (
          <Link href={`/wallet/utility/${item.id}`} key={item.id}>
            <div className={styles.utility}>
              <p className={styles.title}>
                {item.name} <span>{Number(item.balance)}</span>
              </p>
              <div className={styles.assets}>
                {item.assets.map((asset) => (
                  <img key={asset.id} src={asset.promo} />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {loading && <Loading />}
    </section>
  )
}
