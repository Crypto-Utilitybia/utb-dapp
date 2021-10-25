import { useCallback, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Grid, Typography } from '@material-ui/core'

import PageTitle from 'parts/PageTitle'
import LINKS from 'utils/constants/links'
import { useCommonStyles } from 'styles/use-styles'
import { WalletContext } from 'contexts/WalletProvider'
import { NO_IMAGE_PATH } from 'utils/constants/image-paths'
import Loading from 'components/Loading'
import { defaultNetwork, LIBRARY_FETCH_TIME } from 'library/constants'
import { getGraph, handleTransaction } from 'library/utils'
import { useTimestamp } from 'utils/hocs/useTicker'
import TablePagination from 'parts/Table/TablePagination'
import { ALL_TIERS, SORT_COINS, TIERS } from 'utils/constants/filters'
import SelectBox from 'components/UI/SelectBox'
import ActivitiesTable from 'containers/Activities/ActivitiesTable'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
  },
  nftItem: {
    width: '100%',
    objectFit: 'contain',
    cursor: 'pointer',
  },
  label: {
    margin: theme.spacing(1, 2),
  },
  title: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  claim: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.text.default,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: theme.palette.primary.background,
    },
  },
  select: {
    marginRight: theme.spacing(2),
    width: 140,
  },
}))

const ROWS_PER_PAGE = 12

export default function Wallet() {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account, contracts, metadata } = useContext(WalletContext)

  const [timestamp] = useTimestamp()
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState('tier')
  const [filter, setFilter] = useState(ALL_TIERS)
  const [filtered, setFiltered] = useState([])
  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [nfts, setNFTs] = useState([])
  const [rewards, setRewards] = useState(0)

  const fetchRewards = useCallback(() => {
    if (tokens.length === 0) {
      setRewards(0)
    } else {
      contracts.avaxcoin.methods
        .getRewards(tokens)
        .then(contracts.avaxcoin.web3.utils.fromWei)
        .then(Number)
        .then((rewards) => {
          setRewards(rewards)
        })
        .catch(console.log)
    }
  }, [contracts, tokens])

  useEffect(() => {
    fetchRewards()
  }, [tokens, fetchRewards])

  const fetchTokens = useCallback(() => {
    if (account?.address && contracts.avaxcoin) {
      contracts.avaxcoin.methods
        .balanceOf(account.address)
        .then(Number)
        .then((newBalance) => {
          const balance = tokens.length
          if (newBalance !== balance) {
            setLoading(true)
            Promise.all(
              new Array(newBalance)
                .fill(0)
                .map((_, index) => contracts.avaxcoin.methods.tokenOfOwnerByIndex(account.address, index))
            )
              .then(setTokens)
              .catch(console.log)
              .finally(() => setLoading(false))
          }
        })
        .catch(console.log)
    }
  }, [account, contracts, tokens, setTokens, setLoading])

  useEffect(() => {
    fetchTokens()
    const timer = setInterval(() => fetchTokens(), LIBRARY_FETCH_TIME)
    return () => clearInterval(timer)
  }, [fetchTokens])

  useEffect(() => {
    if (!metadata) return
    setFiltered(
      tokens
        .filter((tokenId) => filter.includes(Number(metadata.collections[tokenId].Tier)))
        .sort((a, b) => {
          if (sort === 'tier') {
            return Number(metadata.collections[a].Tier - Number(metadata.collections[b].Tier))
          } else {
            return a - b
          }
        })
    )
  }, [metadata, sort, filter, tokens, setFiltered])

  const fetchData = useCallback(
    (skip, first) => {
      if (first === 0) setNFTs([])
      else {
        if (account?.address && contracts.avaxcoin) {
          setLoading(true)
          Promise.all(
            new Array(first)
              .fill(0)
              .map((_, index) =>
                Promise.all([
                  Promise.resolve(filtered[skip + index]),
                  contracts.avaxcoin.methods
                    .tokenURI(filtered[skip + index])
                    .then((tokenURI) =>
                      axios.get(
                        `${tokenURI
                          .replace('http://localhost:3000/', '/')
                          .replace('https://avaxcoins.com/', '/')}?network=${account.network || defaultNetwork}`
                      )
                    ),
                ]).then(([tokenId, { data }]) => Promise.resolve([tokenId, data]))
              )
          )
            .then(setNFTs)
            .catch(console.log)
            .finally(() => setLoading(false))
        }
      }
    },
    [account, contracts, filtered, setNFTs, setLoading]
  )

  useEffect(() => {
    const first = page * ROWS_PER_PAGE
    fetchData(page * ROWS_PER_PAGE, Math.min(ROWS_PER_PAGE, filtered.length - first))
  }, [page, filtered, fetchData])

  const [[activities, isEnd], setActivities] = useState([[], false])
  const fetchActivities = useCallback(
    (skip, first) => {
      if (account?.address && metadata) {
        getGraph(
          account.network,
          `query {
            activities(
              first: ${first}, skip: ${skip} orderBy: timestamp, orderDirection: desc
              where: {
                user_contains: "${account.address.toLowerCase()}"
              }
            ) {
              id
              tokenContract
              tokenId
              from
              to
              price
              reason
              txHash
              timestamp
            }
          }`
        )
          .then(({ activities }) => {
            setActivities([
              activities.map(({ price, ...item }) => ({
                ...item,
                price: contracts.avaxcoin.web3.utils.fromWei(price),
                tier: metadata.collections[item.tokenId].Tier,
              })),
              activities.length < first,
            ])
          })
          .catch(console.log)
      }
    },
    [account, contracts, metadata, setActivities]
  )

  const handleClaim = () => {
    handleTransaction(
      contracts.avaxcoin.methods.claimRewards(tokens, {
        from: account.address,
      }),
      setLoading,
      () => fetchRewards()
    )
  }

  return (
    <main className={classes.root}>
      <div className={commonClasses.containerWidth}>
        <PageTitle title={`My Wallet (${filtered.length} / ${tokens.length})`}>
          <div className={classes.title}>
            <Button className={classes.claim} onClick={handleClaim}>
              Claim {rewards.toFixed(8)}
            </Button>
            <SelectBox
              placholder="Filter by"
              items={TIERS}
              defaultValue={ALL_TIERS}
              className={classes.select}
              onChange={(e) => setFilter(e.target.value)}
              multiple
            />
            <SelectBox
              placholder="Sort by"
              items={SORT_COINS}
              defaultValue={sort}
              className={classes.select}
              onChange={(e) => setSort(e.target.value)}
            />
          </div>
        </PageTitle>
        <Grid container spacing={3}>
          {nfts.map(
            ([tokenId, metadata]) =>
              metadata && (
                <Grid key={tokenId} item xs={6} sm={4} md={3}>
                  <Link href={(LINKS.COIN_DETAIL.HREF, LINKS.COIN_DETAIL.HREF.replace('[tokenId]', tokenId))}>
                    <img
                      alt={`AvaxCoin #${tokenId}`}
                      src={`${metadata.image}?timestamp=${timestamp}`}
                      className={classes.nftItem}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = NO_IMAGE_PATH
                      }}
                    />
                  </Link>
                </Grid>
              )
          )}
          {filtered.length === 0 && !loading && <Typography className={classes.label}>No Coins</Typography>}
        </Grid>
        <TablePagination page={page} setPage={setPage} total={filtered.length} rowsPerPage={ROWS_PER_PAGE} />
        <Grid item xs={12}>
          <PageTitle title="Activities" />
          <ActivitiesTable data={activities} isEnd={isEnd} onLoad={fetchActivities} />
        </Grid>
        {loading && <Loading loading />}
      </div>
    </main>
  )
}
