import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import { getAssets, getUtility } from 'library/queries'
import { getGraph } from 'library/utils'
import styles from './Wallet.module.css'
import Loading from 'components/Loading/Loading'

const PAGE_SIZE = 32

export default function UtilityContainer({ state, library }) {
  const router = useRouter()
  const { id } = router.query
  const [utility, setUtility] = useState(null)
  const [tokens, setTokens] = useState([])
  const [page] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => setLoading(false), [tokens])

  const fetchData = useCallback(() => {
    setLoading(true)
    Promise.all([
      getGraph(state.account.network, getUtility(id)),
      getGraph(state.account.network, getAssets({ filter: `author: "${id}"` })),
    ])
      .then(([{ utility }, { assets }]) => {
        const token = library.getContract(utility.token, 'ERC721', true)
        Promise.all([
          library.contractCall(token, 'name'),
          library.contractCall(token, 'balanceOf', [state.account.address]).then(Number),
        ]).then(([name, balance]) => setUtility({ ...utility, assets, name, balance }))
      })
      .catch(console.log)
  }, [id, library, state.account])

  useEffect(() => {
    fetchData()
  }, [state.account, fetchData])

  const fetchTokens = useCallback(() => {
    const token = library.getContract(utility.token, 'ERC721', true)
    const start = PAGE_SIZE * page
    const end = Math.min(utility.balance, start + PAGE_SIZE)
    if (start <= end) {
      Promise.all(
        new Array(end)
          .fill(0)
          .map((_, idx) => idx)
          .map((id) =>
            library
              .contractCall(token, 'tokenOfOwnerByIndex', [state.account.address, id])
              .then((tokenId) =>
                library
                  .contractCall(token, 'tokenURI', [tokenId])
                  .then((uri) =>
                    axios
                      .get(uri.startsWith('http') ? uri : `${process.env.NEXT_PUBLIC_IPFS_BASE}${uri}`)
                      .then(({ data }) => ({ ...data, id: tokenId }))
                  )
              )
          )
      )
        .then(setTokens)
        .catch(console.log)
    }
  }, [utility, page, library, state.account])

  useEffect(() => {
    if (utility) fetchTokens()
  }, [library, state.account, utility, fetchTokens])

  return (
    <section className={styles.container}>
      <i className="fa fa-arrow-left back" onClick={() => router.back()} />
      <h1>My Utilities - {utility?.name}</h1>
      {state.account.network === 56 && (
        <p className={styles.note}>
          Note: Your boxes will be appear in 5~10 minutes due to the graph of BSC network indexing.
        </p>
      )}
      <div className={styles.utilities}>
        {tokens.map((item) => (
          <Link href={`/token/${utility.token}-${item.id}`} key={item.id}>
            <div className={styles.utility}>
              <p className={styles.title}>
                {item.name.replace(`${utility.name} - `, '')} #{item.id}
              </p>
              <img src={item.image} />
            </div>
          </Link>
        ))}
      </div>
      {loading && <Loading />}
    </section>
  )
}
