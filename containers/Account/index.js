import { useCallback, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'services/axios'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import PageTitle from 'parts/PageTitle'
import LINKS from 'utils/constants/links'
import { useCommonStyles } from 'styles/use-styles'
import { WalletContext } from 'contexts/WalletProvider'
import { NO_IMAGE_PATH } from 'utils/constants/image-paths'
import Loading from 'components/Loading'
import { LIBRARY_FETCH_TIME } from 'library/constants'
import { useTimestamp } from 'utils/hocs/useTicker'
import TablePagination from 'parts/Table/TablePagination'
import { ALL_TIERS, SORT_COINS, TIERS } from 'utils/constants/filters'
import SelectBox from 'components/UI/SelectBox'
import { useRouter } from 'next/router'
import { getEllipsis } from 'utils/helpers'
import ActivitiesTable from 'containers/Activities/ActivitiesTable'
import { getGraph } from 'library/utils'
import { PROXY_URL } from 'config'

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

export default function Account() {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account, library, contracts, metadata } = useContext(WalletContext)

  const router = useRouter()
  const user = router.query.user
  const [timestamp] = useTimestamp()
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState('tier')
  const [filter, setFilter] = useState(ALL_TIERS)
  const [filtered, setFiltered] = useState([])
  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [nfts, setNFTs] = useState([])

  useEffect(() => {
    if (user === account?.address) {
      router.replace('/wallet')
    }
  }, [user, account, router])

  const fetchTokens = useCallback(() => {
    if (user && contracts.avaxcoin) {
      contracts.avaxcoin.methods
        .balanceOf(user)
        .then(Number)
        .then((newBalance) => {
          const balance = tokens.length
          if (newBalance !== balance) {
            setLoading(true)
            Promise.all(
              new Array(newBalance)
                .fill(0)
                .map((_, index) => contracts.avaxcoin.methods.tokenOfOwnerByIndex(user, index))
            )
              .then(setTokens)
              .catch(console.log)
              .finally(() => setLoading(false))
          }
        })
        .catch(console.log)
    }
  }, [user, contracts, tokens, setTokens, setLoading])

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
        if (user && contracts.avaxcoin) {
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
                          .replace('https://avaxcoins.com/', '/')}?network=${library.currentNetwork}`
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
    [user, library, contracts, filtered, setNFTs, setLoading]
  )

  useEffect(() => {
    const first = page * ROWS_PER_PAGE
    fetchData(page * ROWS_PER_PAGE, Math.min(ROWS_PER_PAGE, filtered.length - first))
  }, [page, filtered, fetchData])

  const [[activities, isEnd], setActivities] = useState([[], false])
  const fetchActivities = useCallback(
    (skip, first) => {
      if (library && metadata) {
        getGraph(
          library.currentNetwork,
          `query {
            activities(
              first: ${first}, skip: ${skip} orderBy: timestamp, orderDirection: desc
              where: {
                user_contains: "${user.toLowerCase()}"
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
                price: library.web3.utils.fromWei(price),
                tier: metadata.collections[item.tokenId].Tier,
              })),
              activities.length < first,
            ])
          })
          .catch(console.log)
      }
    },
    [user, library, metadata, setActivities]
  )

  return (
    <main className={classes.root}>
      <div className={commonClasses.containerWidth}>
        <PageTitle title={`${getEllipsis(user)} (${filtered.length} / ${tokens.length})`}>
          <div className={classes.title}>
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
                      src={`${PROXY_URL}${metadata.image}?timestamp=${timestamp}`}
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
        <TablePagination page={page} setPage={setPage} total={tokens.length} rowsPerPage={ROWS_PER_PAGE} />
        <Grid item xs={12}>
          <PageTitle title="Activities" />
          <ActivitiesTable data={activities} isEnd={isEnd} onLoad={fetchActivities} />
        </Grid>
        {loading && <Loading loading />}
      </div>
    </main>
  )
}
