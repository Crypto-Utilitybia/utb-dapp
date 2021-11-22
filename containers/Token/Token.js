import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Select from 'react-select'
import { getToken } from 'library/queries'
import { getGraph, handleTransaction } from 'library/utils'
import styles from './Token.module.css'
import { links, utilityABIs } from 'library/constants'
import { getEllipsis } from 'utils/helpers'

const INFINITY = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

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

export default function TokenContainer({ state, library, dispatch }) {
  const router = useRouter()
  const { id } = router.query
  const [token, setToken] = useState(null)
  const [active, setActive] = useState(0)
  const [withWrap, setWithWrap] = useState(false)
  const [coin, setCoin] = useState(null)
  const [formCoins, setFormCoins] = useState([])
  const [nft, setNFT] = useState({})
  // const [formNFTs, setFormNFTs] = useState([])
  const [formGift, setFormGift] = useState({})
  const [txHash, setTxHash] = useState('')

  const fetchData = useCallback(
    (id) => {
      const [address, tokenId] = id.split('-')

      library
        .getContractABI(address)
        .then((abi) => {
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
                    status: Number(status),
                    metadata,
                    utility: library.web3.utils.toChecksumAddress(token.utility),
                  })
                })
                .catch(console.log)
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

  useEffect(() => {
    axios
      .get(links[state.account.network].tokens)
      .then(({ data }) => data)
      .then(({ tokens }) =>
        dispatch({
          type: 'TOKENS',
          payload: [
            {
              label: 'AVAX',
              value: 0,
              logoURI: '/coins/avax.png',
              decimals: 18,
            },
            ...tokens.map(({ address, symbol, logoURI, decimals }) => ({
              label: symbol,
              value: address,
              logoURI,
              decimals,
            })),
          ],
        })
      )
      .catch(console.log)
  }, [state.account])

  const tokens = state.tokens || []

  const handleCoin = (coin) => {
    const contract = coin.value !== 0 && library.getContract(coin.value, 'ERC20', true)
    Promise.all([
      contract
        ? library.contractCall(contract, 'balanceOf', [state.account.address])
        : library.web3.eth.getBalance(state.account.address),
      contract ? library.contractCall(contract, 'allowance', [state.account.address, token.utility]) : INFINITY,
    ])
      .then(([balance, allowance]) => {
        setCoin({
          ...coin,
          balance: library.fromWei(balance, coin.decimals),
          allowance: Number(library.fromWei(allowance, coin.decimals)),
          amount: 0,
        })
      })
      .catch(console.log)
  }

  const handleAddCoin = () => {
    setFormCoins([...formCoins, { ...coin, timestamp: Date.now(), amount: Number(coin.amount) }])
    setCoin(null)
  }

  const handleApproveCoin = () => {
    const contract = library.getContract(coin.value, 'ERC20', true)
    const transaction = library.contractSend(contract, 'approve', [
      token.utility,
      INFINITY,
      {
        from: state.account.address,
      },
    ])
    handleTransaction(transaction, setTxHash, () => {
      setCoin({ ...coin, allowance: coin.balance })
    })
  }

  const handlePut = () => {
    const [address, tokenId] = id.split('-')
    library
      .getContractABI(address)
      .then((abi) => {
        const contract = library.getContract(address, abi, true)
        const nativeCoin = formCoins.find((coin) => coin.value === 0)
        const coins = formCoins.filter((coin) => coin.value !== 0)
        const transaction = library.contractSend(contract, withWrap ? 'depositERC20AndWrap' : 'depositERC20', [
          tokenId,
          ...coins.reduce(
            ([addresses, amounts], coin) => [
              [...addresses, coin.value],
              [...amounts, library.toWei(coin.amount, coin.decimals)],
            ],
            [[], []]
          ),
          {
            from: state.account.address,
            value: nativeCoin ? library.toWei(nativeCoin.amount) : undefined,
          },
        ])
        handleTransaction(transaction, setTxHash, () => {
          fetchData(id)
          setFormCoins([])
        })
      })
      .catch(console.log)
  }

  const handleNFT = (nft) => {
    if (nft.tokenId && library.web3.utils.isAddress(nft.address)) {
      const contract = library.getContract(nft.address, 'ERC721', true)
      library
        .contractCall(contract, 'ownerOf', [nft.tokenId])
        .then((owner) => {
          setNFT({
            ...nft,
            address: library.web3.utils.toChecksumAddress(nft.address),
            valid: owner === state.account.address,
            metadata: null,
          })
        })
        .catch(() => setNFT({ ...nft, valid: false, metadata: null }))
    } else {
      setNFT({ ...nft, valid: false, metadata: null })
    }
  }

  useEffect(() => {
    if (nft.valid && !nft.metadata) {
      debugger
      const contract = library.getContract(nft.address, 'ERC721', true)
      Promise.all([
        library.contractCall(contract, 'tokenURI', [nft.tokenId]),
        library.contractCall(contract, 'isApprovedForAll', [state.account.address, token.utility]),
      ])
        .then(([uri, approved]) => {
          axios
            .get(uri)
            .then(({ data }) => data)
            .then((metadata) => setNFT({ ...nft, metadata, approved }))
            .catch(console.log)
        })
        .catch(console.log)
    }
  }, [nft])

  const handleApproveNFT = () => {
    const contract = library.getContract(nft.address, 'ERC721', true)
    const transaction = library.contractSend(contract, 'setApprovalForAll', [
      token.utility,
      true,
      {
        from: state.account.address,
      },
    ])
    handleTransaction(transaction, setTxHash, () => {
      setNFT({ ...nft, approved: true })
    })
  }

  const handlePutNFT = () => {
    const [address, tokenId] = id.split('-')
    library
      .getContractABI(address)
      .then((abi) => {
        const contract = library.getContract(address, abi, true)
        const transaction = library.contractSend(contract, withWrap ? 'depositERC721AndWrap' : 'depositERC721', [
          tokenId,
          [nft.address],
          [nft.tokenId],
          {
            from: state.account.address,
          },
        ])
        handleTransaction(transaction, setTxHash, () => {
          fetchData(id)
          setNFT({})
        })
      })
      .catch(console.log)
  }

  const handleWrap = () => {
    const [address, tokenId] = id.split('-')
    library
      .getContractABI(address)
      .then((abi) => {
        const contract = library.getContract(address, abi, true)
        const transaction = library.contractSend(contract, 'wrap', [tokenId, { from: state.account.address }])
        handleTransaction(transaction, setTxHash, () => {
          fetchData(id)
        })
      })
      .catch(console.log)
  }

  const handleSend = () => {
    const [address, tokenId] = id.split('-')
    library
      .getContractABI(address)
      .then((abi) => {
        const contract = library.getContract(address, abi, true)
        const transaction = library.contractSend(contract, 'transferFrom', [
          state.account.address,
          library.web3.utils.toChecksumAddress(formGift.gifty),
          tokenId,
          { from: state.account.address },
        ])
        handleTransaction(transaction, setTxHash, () => {
          fetchData(id)
        })
      })
      .catch(console.log)
  }

  const handleOpen = () => {
    const [address, tokenId] = id.split('-')
    library
      .getContractABI(address)
      .then((abi) => {
        const contract = library.getContract(address, abi, true)
        const transaction = library.contractSend(contract, 'open', [tokenId, { from: state.account.address }])
        handleTransaction(transaction, setTxHash, () => {
          fetchData(id)
        })
      })
      .catch(console.log)
  }

  const [gifts, setGifts] = useState(null)
  useEffect(() => {
    if (!token) return
    if (token.status === 2 && token.owner === state.account.address.toLowerCase()) {
      const [address, tokenId] = id.split('-')
      library
        .getContractABI(address)
        .then((abi) => {
          const contract = library.getContract(address, abi, true)
          Promise.all([
            library.contractCall(contract, 'viewETH', [tokenId]),
            library.contractCall(contract, 'viewERC20s', [tokenId]),
            library.contractCall(contract, 'viewERC721s', [tokenId]),
          ])
            .then(([avax, coins, nfts]) => {
              Promise.all([
                Promise.all(
                  coins.map((token) =>
                    Promise.all([
                      Promise.resolve(token),
                      library.contractCall(contract, 'viewERC20Amount', [tokenId, token]),
                    ])
                  )
                ),
                Promise.all(
                  nfts.map((token) =>
                    Promise.all([
                      Promise.resolve(token),
                      library.contractCall(contract, 'viewERC721Ids', [tokenId, token]),
                    ])
                  )
                ),
              ]).then(([coins, nfts]) => {
                console.log(coins, nfts, tokens)
                setGifts({
                  avax: Number(library.fromWei(avax)),
                  coins: coins.map(([address, amount]) => {
                    const token = tokens.find((item) => item.value === address)
                    return {
                      ...token,
                      amount: Number(library.fromWei(amount, token?.decimals)),
                    }
                  }),
                  nfts: nfts.reduce((total, [, tokenIds]) => total + tokenIds.length, 0),
                })
              })
            })
            .catch((err) => {
              console.log(err)
              setGifts(null)
            })
        })
        .catch((err) => {
          console.log(err)
          setGifts(null)
        })
    } else {
      setGifts(null)
    }
  }, [token, state.account, tokens])

  const handleCollect = () => {
    const [address, tokenId] = id.split('-')
    library
      .getContractABI(address)
      .then((abi) => {
        const contract = library.getContract(address, abi, true)
        const transaction = library.contractSend(contract, 'claimDeposits', [tokenId, { from: state.account.address }])
        handleTransaction(transaction, setTxHash, () => {
          fetchData(id)
        })
      })
      .catch(console.log)
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
            {token.owner === state.account.address.toLowerCase() && (
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
                  {active === 0 && token.status === 0 && (
                    <>
                      <Select value={coin} onChange={handleCoin} options={tokens} />
                      {coin && (
                        <table className={styles.table}>
                          <tbody>
                            <tr>
                              <td>
                                <a
                                  href={`${links[state.account.network].address}/${coin.value || ''}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {coin.label}
                                </a>
                              </td>
                              <td className={styles.balance}>
                                {Number(coin.balance).toFixed(Math.min(8, coin.decimals - 4))}&nbsp;
                                <img src={coin.logoURI} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input
                                  value={coin.amount}
                                  type="number"
                                  onChange={(e) => setCoin({ ...coin, amount: e.target.value })}
                                />
                              </td>
                              <td className={styles.actions}>
                                {coin.allowance > coin.amount ? (
                                  <button disabled={coin.amount <= 0} onClick={handleAddCoin}>
                                    Put
                                  </button>
                                ) : (
                                  <button onClick={handleApproveCoin} disabled={!!txHash}>
                                    Approve
                                  </button>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                      <div className={styles.formCoins}>
                        {formCoins.map((coin) => (
                          <div className={styles.formCoin} key={coin.timestamp}>
                            {coin.amount} <img src={coin.logoURI} />
                            &nbsp;
                            <i
                              className="fa fa-close cursor"
                              onClick={() =>
                                setFormCoins(formCoins.filter((item) => item.timestamp !== coin.timestamp))
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className={styles.confirm}>
                        <input
                          id="with-wrap"
                          type="checkbox"
                          value={withWrap}
                          onChange={(e) => setWithWrap(e.target.checked)}
                        />
                        <label for="with-wrap">Wrap the box with current assets</label>
                      </div>
                      <div className={styles.buttons}>
                        {withWrap ? (
                          <button onClick={handlePut} disabled={!!txHash}>
                            Put Assets and Wrap
                          </button>
                        ) : (
                          <>
                            <button onClick={handlePut} disabled={!!txHash}>
                              Put Assets
                            </button>
                            <button onClick={handleWrap} disabled={!!txHash}>
                              Wrap
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                  {active === 1 && token.status === 0 && (
                    <>
                      <div className={styles.nftInput}>
                        <label className="label">Contract:</label>
                        <input
                          value={nft.address}
                          onChange={(e) => handleNFT({ address: e.target.value, tokenId: nft.tokenId })}
                          placeholder="Address"
                        />
                      </div>
                      <div className={styles.nftInput}>
                        <label className="label">Token Id:</label>
                        <input
                          value={nft.tokenId}
                          onChange={(e) => handleNFT({ address: nft.address, tokenId: e.target.value })}
                          placeholder="Token ID"
                        />
                      </div>
                      {nft.valid && nft.metadata && (
                        <>
                          <div className={styles.nftPreview}>
                            <img src={nft.metadata.image} />
                          </div>
                          <div className={styles.confirm}>
                            <input
                              id="with-wrap"
                              type="checkbox"
                              value={withWrap}
                              onChange={(e) => setWithWrap(e.target.checked)}
                            />
                            <label for="with-wrap">Wrap the box with current assets</label>
                          </div>
                          <div className={styles.buttons}>
                            {!nft.approved ? (
                              <button onClick={handleApproveNFT} disabled={!!txHash}>
                                Approve NFT
                              </button>
                            ) : withWrap ? (
                              <button onClick={handlePutNFT} disabled={!!txHash}>
                                Put Assets and Wrap
                              </button>
                            ) : (
                              <>
                                <button onClick={handlePutNFT} disabled={!!txHash}>
                                  Put Assets
                                </button>
                                <button onClick={handleWrap} disabled={!!txHash}>
                                  Wrap
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {active === 0 &&
                    token.status === 1 &&
                    (token.lastActor === state.account.address.toLowerCase() ? (
                      <>
                        <div style={{ flex: 1 }}>
                          <div className={styles.nftInput}>
                            <label className="label">Gifty:</label>
                            <input
                              value={formGift.gifty}
                              onChange={(e) => setFormGift({ gifty: e.target.value })}
                              placeholder="Address"
                            />
                          </div>
                        </div>
                        <div className={styles.buttons}>
                          <button
                            onClick={handleSend}
                            disabled={txHash || !library.web3.utils.isAddress(formGift.gifty)}
                          >
                            Send
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          Open your Gift Box!
                        </div>
                        <div className={styles.buttons}>
                          <button onClick={handleOpen} disabled={txHash}>
                            Open
                          </button>
                        </div>
                      </>
                    ))}
                  {active === 0 && token.status === 2 && (
                    <>
                      <div style={{ flex: 1 }}>
                        {gifts && (
                          <div className={styles.formCoins}>
                            {gifts.avax > 0 && (
                              <div className={styles.formCoin}>
                                {gifts.avax} <img src="/coins/avax.png" />
                              </div>
                            )}
                            {gifts.coins.map((coin, index) => (
                              <div className={styles.formCoin} key={index}>
                                {coin.amount}{' '}
                                {coin.logoURI ? <img src={coin.logoURI} /> : `(${getEllipsis(coin.address || '')})`}
                              </div>
                            ))}
                            {gifts.nfts > 0 && <div className={styles.formCoin}>{gifts.nfts} NFT(s)</div>}
                          </div>
                        )}
                      </div>
                      <div className={styles.buttons}>
                        <button onClick={handleCollect} disabled={txHash}>
                          Collect
                        </button>
                      </div>
                    </>
                  )}
                  {txHash && (
                    <div className={styles.txHash}>
                      <a href={`${links[state.account.network].tx}/${txHash}`} target="_blank" rel="noreferrer">
                        View on Explorer
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}
