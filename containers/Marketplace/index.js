import { memo, useCallback, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Grid, Typography } from '@material-ui/core'

import axios from 'services/axios'
import { PROXY_URL } from 'config'
import { WalletContext } from 'contexts/WalletProvider'
import Loading from 'components/Loading'
import TokenIcon from 'components/TokenIcon'
import SelectBox from 'components/UI/SelectBox'
import PageTitle from 'parts/PageTitle'
import TablePagination from 'parts/Table/TablePagination'
import { getGraph, handleTransaction } from 'library/utils'
import { SORTS, FILTERS } from 'utils/constants/filters'
import { NO_IMAGE_PATH } from 'utils/constants/image-paths'
import useTimestamp from 'utils/hooks/useTimestamp'
import { useCommonStyles } from 'styles/use-styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
  },
  tableContainer: {
    overflowX: 'overlay',
  },
  filter: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  select: {
    marginLeft: theme.spacing(2),
    width: 140,
  },
  nftItem: {
    width: '100%',
    objectFit: 'contain',
    cursor: 'pointer',
  },
  nftAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  nftPrice: {
    minWidth: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    border: '1px solid',
    padding: 5,
  },
  nftBuy: {
    minWidth: 80,
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.secondary.contrastText,
    borderRadius: 30,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: theme.palette.primary.background,
    },
  },
  noData: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}))

const ROWS_PER_PAGE = 12

const Marketplace = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const [timestamp] = useTimestamp()
  const { account, library, metadata, contracts } = useContext(WalletContext)
  const [[data, isEnd], setData] = useState([[], false])
  const [loading, setLoading] = useState(false)
  const [[sort, filter], setFilter] = useState([1, 'all'])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [transaction, setTransaction] = useState('')
  const [tokens, setTokens] = useState({})

  useEffect(() => {
    if (metadata) {
      const tokens = {}
      for (let i = 1; i < metadata.totalSupply; i++) {
        const { Tier } = metadata.collections[i]
        if (!tokens[Tier]) tokens[Tier] = []
        tokens[Tier].push(i)
      }
      setTokens(tokens)
    }
  }, [metadata])

  const fetchData = useCallback(
    (skip, first, { sort, filter }) => {
      if (library) {
        let filterQuery = ''
        if (filter === 'owned') {
          if (account?.address) {
            filterQuery = `user: "${account.address}"`
          }
        } else if (filter !== 'all') {
          filterQuery = `tokenId_in: [${tokens[filter].join(',')}]`
        }
        setLoading(true)
        getGraph(
          library.currentNetwork,
          `query {
            listings(
              first: ${first}
              skip: ${skip}
              orderBy: ${[1, 2].includes(sort) ? 'updatedAt' : 'price'}
              orderDirection: ${sort % 2 === 1 ? 'desc' : 'asc'}
              where: {
                amount_gt: 0
                tokenContract: "${contracts.avaxcoin.netAddresses.AvaxCoin}"
                ${filterQuery}
              }
            ) {
              id
              user
              tokenContract
              tokenId
              price
              timestamp
              updatedAt
              amount
            }
          }`
        )
          .then(({ listings }) =>
            Promise.all(
              listings.map(({ tokenId }) =>
                contracts.avaxcoin.methods
                  .tokenURI(tokenId)
                  .then((tokenURI) =>
                    axios.get(
                      `${tokenURI
                        .replace('http://localhost:3000/', '/')
                        .replace('https://avaxcoins.com/', '/')}?network=${library.currentNetwork}`
                    )
                  )
                  .then(({ data }) => data)
              )
            )
              .then((metadatas) => {
                setData([
                  listings.map(({ price, ...item }, index) => ({
                    ...item,
                    price: library.web3.utils.fromWei(price),
                    originPrice: price,
                    metadata: metadatas[index],
                  })),
                  listings.length < first,
                ])
              })
              .catch(console.log)
              .finally(() => setLoading(false))
          )
          .catch(console.log)
          .finally(() => setLoading(false))
      }
    },
    [library, contracts, account, tokens, setData, setLoading]
  )

  useEffect(() => {
    const newTotal = page * ROWS_PER_PAGE + 1
    if (isEnd) {
      if (newTotal != total) {
        setTotal((data.length > 0 ? page : page - 1) * ROWS_PER_PAGE + 1)
      }
    } else {
      setTotal(newTotal + ROWS_PER_PAGE)
    }
  }, [data, page, total, isEnd, setTotal])

  useEffect(() => {
    fetchData(page * ROWS_PER_PAGE, ROWS_PER_PAGE, { sort, filter })
  }, [page, sort, filter, fetchData])

  const handleAction = (type, listing) => {
    switch (type) {
      case 'fulfill':
        handleTransaction(
          contracts.marketplace.methods.fulfill(listing.id, { from: account.address, value: listing.originPrice }),
          setTransaction,
          () => fetchData()
        )
        break
      case 'cancel':
        handleTransaction(
          contracts.marketplace.methods.cancel(listing.id, { from: account.address }),
          setTransaction,
          () => fetchData()
        )
        break
      default:
        console.log(type, data, callback)
        break
    }
  }

  return (
    <main className={classes.root}>
      <div className={commonClasses.containerWidth}>
        <PageTitle title="Marketplace">
          <div className={classes.filter}>
            <SelectBox
              placholder="Sort by"
              items={SORTS}
              defaultValue={sort}
              className={classes.select}
              onChange={(e) => setFilter([e.target.value, filter])}
            />
            <SelectBox
              placholder="Filter by"
              items={FILTERS}
              defaultValue={filter}
              className={classes.select}
              onChange={(e) => setFilter([sort, e.target.value])}
            />
          </div>
        </PageTitle>
        <Grid container spacing={3}>
          {data.map((item) => (
            <Grid key={item.id} item xs={6} sm={4} md={3}>
              <Link href={`/coin/${item.tokenId}`}>
                <img
                  alt="nft-item"
                  src={`${PROXY_URL}${item.metadata?.image || NO_IMAGE_PATH}?timestamp=${timestamp}`}
                  className={classes.nftItem}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = NO_IMAGE_PATH
                  }}
                />
              </Link>
              <div className={classes.nftAction}>
                <Typography className={classes.nftPrice}>
                  {item.price}&nbsp;
                  <TokenIcon size={20} token="AVAX" />
                </Typography>
                <Button
                  className={classes.nftBuy}
                  onClick={() =>
                    handleAction(item.user === (account?.address || '').toLowerCase() ? 'cancel' : 'fulfill', item)
                  }
                >
                  {item.user === (account?.address || '').toLowerCase() ? 'Cancel' : 'BUY'}
                </Button>
              </div>
            </Grid>
          ))}
          {data.length === 0 && (
            <Typography variant="h5" color="primary" className={classes.noData}>
              {loading ? '...' : 'No Data'}
            </Typography>
          )}
        </Grid>
        <TablePagination page={page} setPage={setPage} total={total} rowsPerPage={ROWS_PER_PAGE} />
        {(loading || transaction) && <Loading loading />}
      </div>
    </main>
  )
}

export default memo(Marketplace)
