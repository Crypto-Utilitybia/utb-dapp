import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Select, { components } from 'react-select'
import { handleTransaction } from 'library/utils'
import styles from '../Token.module.css'
import { ipfsMap, links, networks } from 'library/constants'
import { getEllipsis } from 'utils/helpers'
import Loading from 'components/Loading/Loading'
import Coin, { getCoin } from 'components/Coin/Coin'

const INFINITY =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const NFT_PREFIXES = {
  '0xdb350245d143a8b575d909b1fa93df99844264b0': 'https://avaxcoins.com',
}

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

export default function GiftBox({ state, library, dispatch }) {
  const router = useRouter()
  const { id } = router.query
  const [token, setToken] = useState(null)
  const [active, setActive] = useState(0)
  const [coin, setCoin] = useState(null)
  const [formCoins, setFormCoins] = useState([])
  const [nft, setNFT] = useState({})
  // const [formNFTs, setFormNFTs] = useState([])
  const [formGift, setFormGift] = useState({})
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => setLoading(false), [token])

  const fetchData = useCallback(
    (id) => {
      setLoading(true)
      const [address, tokenId] = id.split('-')

      const token = library.getContract(address, 'ERC721', true)
      Promise.all([
        library.contractCall(token, 'ownerOf', [tokenId]),
        library.contractCall(token, 'tokenURI', [tokenId]),
        library.contractCall(token, 'utility'),
      ])
        .then(([owner, tokenURI, utility]) => {
          const contract = library.getContract(utility, 'UTBGiftBox', true)
          Promise.all([
            library.contractCall(contract, 'vault'),
            library.contractCall(contract, 'tokenStates', [tokenId]),
            axios.get(
              ipfsMap[tokenURI.replace('https://ipfs.io/ipfs/', '')] ||
                tokenURI,
            ),
          ])
            .then(([vault, status, { data: metadata }]) => {
              setToken({
                ...token,
                tokenId,
                owner: owner.toLowerCase(),
                tokenURI:
                  ipfsMap[tokenURI.replace('https://ipfs.io/ipfs/', '')] ||
                  tokenURI,
                status: Number(status),
                metadata,
                utility: library.web3.utils.toChecksumAddress(utility),
                vault: library.web3.utils.toChecksumAddress(vault),
              })
            })
            .catch(console.log)
        })
        .catch(console.log)
    },
    [library],
  )

  useEffect(() => {
    fetchData(id)
  }, [id, fetchData])

  useEffect(() => {
    Promise.all([
      axios.get(links[state.account.network].tokens),
      links[state.account.network].stables
        ? axios.get(links[state.account.network].stables)
        : Promise.resolve({ data: { tokens: [] } }),
      Promise.resolve(links[state.account.network].nfts),
    ])
      .then(
        ([
          {
            data: { tokens: coins },
          },
          {
            data: { tokens: stables },
          },
          nfts,
        ]) =>
          dispatch({
            type: 'TOKENS',
            payload: {
              coins: [
                {
                  label: networks[state.account.network].nativeCurrency.name,
                  value: 0,
                  logoURI: getCoin(state?.account?.network),
                  decimals: 18,
                },
                ...stables.map(({ address, symbol, logoURI, decimals }) => ({
                  label: symbol,
                  value: address,
                  logoURI,
                  decimals,
                })),
                ...coins.map(({ address, symbol, logoURI, decimals }) => ({
                  label: symbol,
                  value: address,
                  logoURI,
                  decimals,
                })),
              ],
              nfts: nfts.map(({ address, name, symbol, image }) => ({
                label: name,
                symbol,
                value: address,
                image,
              })),
            },
          }),
      )
      .catch(console.log)
  }, [state.account, dispatch])

  const tokens = state.tokens || { coins: [], nfts: [] }

  const handleCoin = (coin) => {
    const contract =
      coin.value !== 0 && library.getContract(coin.value, 'ERC20', true)
    Promise.all([
      contract
        ? library.contractCall(contract, 'balanceOf', [state.account.address])
        : library.web3.eth.getBalance(state.account.address),
      contract
        ? library.contractCall(contract, 'allowance', [
            state.account.address,
            token.vault,
          ])
        : INFINITY,
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
    setFormCoins([
      ...formCoins,
      { ...coin, timestamp: Date.now(), amount: Number(coin.amount) },
    ])
    setCoin(null)
  }

  const handleApproveCoin = () => {
    const contract = library.getContract(coin.value, 'ERC20', true)
    const transaction = library.contractSend(contract, 'approve', [
      token.vault,
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
    const [, tokenId] = id.split('-')
    const contract = library.getContract(token.vault, 'Vault', true)
    const nativeCoin = formCoins.find((coin) => coin.value === 0)
    const coins = formCoins.filter((coin) => coin.value !== 0)
    const transaction = library.contractSend(contract, 'depositERC20', [
      tokenId,
      ...coins.reduce(
        ([addresses, amounts], coin) => [
          [...addresses, coin.value],
          [...amounts, library.toWei(coin.amount, coin.decimals)],
        ],
        [[], []],
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
  }

  const handleNFT = (nft) => {
    if (nft.tokenId && library.web3.utils.isAddress(nft.address)) {
      setNFT({
        ...nft,
        address: library.web3.utils.toChecksumAddress(nft.address),
        valid: false,
        metadata: null,
      })
      const contract = library.getContract(nft.address, 'ERC721', true)
      library
        .contractCall(contract, 'ownerOf', [nft.tokenId])
        .then((owner) => {
          setNFT({
            ...nft,
            address: library.web3.utils.toChecksumAddress(nft.address),
            valid: true,
            owner,
            metadata: null,
          })
        })
        .catch(console.log)
    } else {
      setNFT({ ...nft, valid: false, metadata: null })
    }
  }

  useEffect(() => {
    if (nft.valid && !nft.metadata) {
      const contract = library.getContract(nft.address, 'ERC721', true)
      Promise.all([
        library.contractCall(contract, 'tokenURI', [nft.tokenId]),
        library.contractCall(contract, 'isApprovedForAll', [
          state.account.address,
          token.vault,
        ]),
      ])
        .then(([uri, approved]) => {
          axios
            .get(uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
            .then(({ data }) => data)
            .then((metadata) =>
              setNFT({
                ...nft,
                metadata: {
                  ...metadata,
                  image:
                    (NFT_PREFIXES[nft.address.toLowerCase()] || '') +
                    metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
                },
                approved,
              }),
            )
            .catch(() =>
              setNFT({
                ...nft,
                metadata: {
                  image: 'https://via.placeholder.com/150?text=Unknown',
                },
                approved,
              }),
            )
        })
        .catch(console.log)
    }
  }, [nft, library, state.account, token])

  const handleApproveNFT = () => {
    const contract = library.getContract(nft.address, 'ERC721', true)
    const transaction = library.contractSend(contract, 'setApprovalForAll', [
      token.vault,
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
    const [, tokenId] = id.split('-')
    const contract = library.getContract(token.vault, 'Vault', true)
    const transaction = library.contractSend(contract, 'depositERC721', [
      tokenId,
      nft.address,
      [nft.tokenId],
      {
        from: state.account.address,
      },
    ])
    handleTransaction(transaction, setTxHash, () => {
      fetchData(id)
    })
  }

  const handleWrap = () => {
    const [, tokenId] = id.split('-')
    const contract = library.getContract(token.utility, 'Utility', true)
    const transaction = library.contractSend(contract, 'wrap', [
      tokenId,
      { from: state.account.address },
    ])
    handleTransaction(transaction, setTxHash, () => {
      fetchData(id)
      setActive(0)
    })
  }

  const handleSend = () => {
    const [address, tokenId] = id.split('-')
    const contract = library.getContract(address, 'ERC721', true)
    const transaction = library.contractSend(contract, 'transferFrom', [
      state.account.address,
      library.web3.utils.toChecksumAddress(formGift.gifty),
      tokenId,
      { from: state.account.address },
    ])
    handleTransaction(transaction, setTxHash, () => {
      fetchData(id)
      setFormGift({})
    })
  }

  const handleOpen = () => {
    const [, tokenId] = id.split('-')
    const contract = library.getContract(token.utility, 'Utility', true)
    const transaction = library.contractSend(contract, 'open', [
      tokenId,
      { from: state.account.address },
    ])
    handleTransaction(transaction, setTxHash, () => {
      fetchData(id)
    })
  }

  const [gifts, setGifts] = useState(null)
  useEffect(() => {
    if (!token) return
    if (
      token.status !== 1 &&
      token.owner === state.account.address.toLowerCase()
    ) {
      const [, tokenId] = id.split('-')
      const contract = library.getContract(token.vault, 'Vault', true)
      Promise.all([
        library.contractCall(contract, 'isEmpty', [tokenId]),
        library.contractCall(contract, 'viewDeposits', [tokenId]),
      ])
        .then(([isEmpty, deposits]) => {
          setGifts({
            isEmpty,
            avax: Number(library.fromWei(deposits.coin)),
            coins: deposits.erc20s.map(({ token: address, amount }) => {
              const token = tokens.coins.find((item) => item.value === address)
              return {
                ...token,
                amount: Number(library.fromWei(amount, token?.decimals)),
              }
            }),
            nfts: deposits.erc721s.reduce(
              (total, { ids: tokenIds }) => total + tokenIds.length,
              0,
            ),
          })
        })
        .catch((err) => {
          console.log(err)
          setGifts(null)
        })
    } else {
      setGifts(null)
    }
  }, [id, token, library, state.account, tokens.coins, setGifts])

  const handleCollect = () => {
    const [, tokenId] = id.split('-')
    const contract = library.getContract(token.utility, 'Utility', true)
    const transaction = library.contractSend(contract, 'claimDeposits', [
      tokenId,
      { from: state.account.address },
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
            {token.metadata.name.split(' - ')[1]} #{Number(token.tokenId)}
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
                      className={`${styles.tab} ${
                        active === index ? styles.active : ''
                      }`}
                      onClick={() => setActive(index)}
                    >
                      {tab}
                    </div>
                  ))}
                </div>
                <div className={styles.inputs}>
                  {token.status !== 1 && (
                    <label className={styles.warning}>
                      Transaction will fail if box has more than 20 different
                      tokens or NFTs
                    </label>
                  )}
                  {gifts && (
                    <div className={styles.formCoins}>
                      {gifts.avax > 0 && (
                        <div className={styles.formCoin}>
                          {gifts.avax}{' '}
                          <Coin network={state?.account?.network} />
                        </div>
                      )}
                      {gifts.coins.map((coin, index) => (
                        <div className={styles.formCoin} key={index}>
                          {coin.amount}{' '}
                          {coin.logoURI ? (
                            <img src={coin.logoURI} />
                          ) : (
                            `(${getEllipsis(coin.address || '')})`
                          )}
                        </div>
                      ))}
                      {gifts.nfts > 0 && (
                        <div className={styles.formCoin}>
                          {gifts.nfts} NFT(s)
                        </div>
                      )}
                    </div>
                  )}
                  {active === 0 && token.status === 0 && (
                    <>
                      <Select
                        value={coin}
                        onChange={handleCoin}
                        options={tokens.coins}
                        components={{
                          Control: ({ children, ...rest }) => {
                            const value = rest.getValue()
                            return (
                              <components.Control
                                className={styles.control}
                                {...rest}
                              >
                                {value.length > 0 && (
                                  <img
                                    src={value[0].logoURI}
                                    style={{
                                      width: 20,
                                      borderRadius: 10,
                                      overflow: 'hidden',
                                      marginLeft: 6,
                                      marginRight: 6,
                                    }}
                                  />
                                )}{' '}
                                {children}
                              </components.Control>
                            )
                          },
                          Option: ({ children, innerProps, data }) => {
                            return (
                              <div
                                className="cursor"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: `3px 6px`,
                                }}
                                {...innerProps}
                              >
                                <img
                                  src={data.logoURI}
                                  style={{
                                    width: 20,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    marginRight: 6,
                                  }}
                                />{' '}
                                {children}
                              </div>
                            )
                          },
                        }}
                      />
                      {coin && (
                        <table className={styles.table}>
                          <tbody>
                            <tr>
                              <td className={styles.balance}>
                                {Number(coin.balance).toFixed(
                                  Math.min(8, coin.decimals - 4),
                                )}
                                &nbsp;
                                <img src={coin.logoURI} />
                              </td>
                              <td>
                                {!!coin.value && (
                                  <a
                                    className={styles.buy}
                                    href={`${
                                      links[state.account.network].coin
                                    }/${coin.value.toLowerCase()}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    + buy +
                                  </a>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input
                                  value={coin.amount}
                                  type="number"
                                  onChange={(e) =>
                                    setCoin({ ...coin, amount: e.target.value })
                                  }
                                />
                              </td>
                              <td className={styles.actions}>
                                {coin.allowance > coin.amount ? (
                                  <button
                                    disabled={coin.amount <= 0}
                                    onClick={handleAddCoin}
                                  >
                                    Put
                                  </button>
                                ) : (
                                  <button
                                    onClick={handleApproveCoin}
                                    disabled={!!txHash}
                                  >
                                    Approve
                                  </button>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                      <div className={`${styles.formCoins} ${styles.put}`}>
                        {formCoins.map((coin) => (
                          <div className={styles.formCoin} key={coin.timestamp}>
                            {coin.amount} <img src={coin.logoURI} />
                            &nbsp;
                            <i
                              className="fa fa-close cursor"
                              onClick={() =>
                                setFormCoins(
                                  formCoins.filter(
                                    (item) => item.timestamp !== coin.timestamp,
                                  ),
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className={styles.buttons}>
                        {formCoins.length > 0 && (
                          <button onClick={handlePut} disabled={!!txHash}>
                            Put Assets
                          </button>
                        )}
                        <button
                          onClick={handleWrap}
                          disabled={!!txHash || gifts?.isEmpty}
                        >
                          Wrap
                        </button>
                      </div>
                    </>
                  )}
                  {active === 1 && token.status === 0 && (
                    <>
                      <Select
                        onChange={(value) =>
                          handleNFT({ address: value.value, tokenId: 1 })
                        }
                        options={tokens.nfts}
                        components={{
                          Control: ({ children, ...rest }) => {
                            const value = rest.getValue()
                            return (
                              <components.Control
                                className={styles.control}
                                {...rest}
                              >
                                {value.length > 0 && (
                                  <img
                                    src={value[0].image}
                                    style={{
                                      width: 20,
                                      borderRadius: 10,
                                      overflow: 'hidden',
                                      marginLeft: 6,
                                      marginRight: 6,
                                    }}
                                  />
                                )}{' '}
                                {children}
                              </components.Control>
                            )
                          },
                          Option: ({ children, innerProps, data }) => {
                            return (
                              <div
                                className="cursor"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: `3px 6px`,
                                }}
                                {...innerProps}
                              >
                                <img
                                  src={data.image}
                                  style={{
                                    width: 20,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    marginRight: 6,
                                  }}
                                />{' '}
                                {children}
                              </div>
                            )
                          },
                        }}
                      />
                      {/* <div className={styles.nftInput}>
                        <label className="label">Contract:</label>
                        <input
                          value={nft.address}
                          onChange={(e) => handleNFT({ address: e.target.value, tokenId: nft.tokenId })}
                          placeholder="Address"
                        />
                      </div> */}
                      <div className={styles.nftInput}>
                        <label className="label">Token Id:</label>
                        <input
                          value={nft.tokenId}
                          onChange={(e) =>
                            handleNFT({
                              address: nft.address,
                              tokenId: e.target.value,
                            })
                          }
                          placeholder="Token ID"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        {nft.valid && nft.metadata && (
                          <div className={styles.nftPreview}>
                            <a
                              href={`${
                                links[state.account.network].marketplace
                              }/${nft.address}/${nft.tokenId}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img src={nft.metadata.image} />
                            </a>
                          </div>
                        )}
                      </div>
                      <div className={styles.buttons}>
                        {nft.owner === state.account.address &&
                          (!nft.approved ? (
                            <button
                              onClick={handleApproveNFT}
                              disabled={!!txHash}
                            >
                              Approve NFT
                            </button>
                          ) : (
                            <button onClick={handlePutNFT} disabled={!!txHash}>
                              Put Assets
                            </button>
                          ))}
                        <button
                          onClick={handleWrap}
                          disabled={!!txHash || gifts?.isEmpty}
                        >
                          Wrap
                        </button>
                      </div>
                    </>
                  )}
                  {active === 0 && token.status === 1 && (
                    <>
                      <div style={{ flex: 1 }}>
                        <div className={styles.nftInput}>
                          <label className="label">Gifty:</label>
                          <input
                            value={formGift.gifty}
                            onChange={(e) =>
                              setFormGift({ gifty: e.target.value })
                            }
                            placeholder="Address"
                          />
                        </div>
                      </div>
                      <div className={styles.buttons}>
                        <button
                          onClick={handleSend}
                          disabled={
                            txHash ||
                            !library.web3.utils.isAddress(formGift.gifty)
                          }
                        >
                          Send
                        </button>
                      </div>
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
                  )}
                  {active === 0 && token.status === 2 && (
                    <>
                      <div style={{ flex: 1 }} />
                      <div className={styles.buttons}>
                        <button onClick={handleCollect} disabled={txHash}>
                          Collect
                        </button>
                      </div>
                    </>
                  )}
                  {txHash && (
                    <div className={styles.txHash}>
                      <a
                        href={`${links[state.account.network].tx}/${txHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
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
      {loading && <Loading />}
    </section>
  )
}
