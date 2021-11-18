import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { getToken } from 'library/queries'
import { getGraph, handleTransaction } from 'library/utils'
import styles from './Token.module.css'
import { links, utilityABIs } from 'library/constants'
import BigNumber from 'bignumber.js'

function getTabs(status) {
  switch (status) {
    case 1:
      return ['Gift']
    case 2:
      return ['Gift']
    default:
      return ['Coins', 'NFTs']
  }
}

export default function TokenContainer({ state, library }) {
  const router = useRouter()
  const { id } = router.query
  const [token, setToken] = useState(null)
  const [active, setActive] = useState(0)
  const [formCoins, setFormCoins] = useState([])
  const [formNFTs, setFormNFTs] = useState([])
  const [formGift, setFormGift] = useState({})

  const fetchData = useCallback(
    (id) => {
      const [address, tokenId] = id.split('-')
      const abi = utilityABIs[state.account.network][address]
      const contract = library.getContract(address, abi, true)

      Promise.all([
        getGraph(state.account.network, getToken(id)),
        library.contractCall(contract, 'tokenState', [tokenId]),
      ])
        .then(([{ token }, status]) => {
          axios
            .get(token.tokenURI)
            .then(({ data: metadata }) => {
              setToken({
                ...token,
                tokenId,
                status,
                metadata,
              })
            })
            .catch(console.log)
        })
        .catch(console.log)
    },
    [library, state.account]
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
        value: new BigNumber(token.price).times(amount).toString(),
      },
    ])
    handleTransaction(transaction, setTxHash, () => {
      fetchData(id)
    })
  }

  return (
    <section className={styles.container}>
      <i className="fa fa-arrow-left back" onClick={() => router.back()} />
      {token && (
        <>
          <h1>
            {token.asset.name} #{Number(token.tokenId)}
          </h1>
          <div className={styles.wrapper}>
            <div className={styles.image}>
              <img src={token.metadata.image} />
            </div>
            <div className={styles.form}>
              <div className={styles.tabs}>
                {getTabs(token.status).map((tab, index) => (
                  <div
                    key={tab}
                    className={`${styles.tab} ${active === index ? styles.active : ''}`}
                    onClick={() => setActive(index)}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              <div className={styles.inputs}>
                <p style={{ textAlign: 'center' }}>Coming soon...</p>
                {txHash && (
                  <div className={styles.txHash}>
                    <a href={`${links[state.account.network].tx}/${txHash}`} target="_blank" rel="noreferrer">
                      View on Explorer
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
