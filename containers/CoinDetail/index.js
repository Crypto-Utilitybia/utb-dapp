import { memo, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'services/axios'
import Grid from '@material-ui/core/Grid'
import { useCommonStyles } from 'styles/use-styles'

import { WalletContext } from 'contexts/WalletProvider'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import Loading from 'components/Loading'
import PageTitle from 'parts/PageTitle'
import { NO_IMAGE_PATH } from 'utils/constants/image-paths'
import { defaultNetwork } from 'library/constants'
import ManageNFT from './ManageNFT'
import NFTInfo from './NFTInfo'
import { getGraph, handleTransaction } from 'library/utils'

import IconButton from '@material-ui/core/IconButton'
import RefreshIcon from '@material-ui/icons/Refresh'
import ActivitiesTable from 'containers/Activities/ActivitiesTable'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useTimestamp } from 'utils/hocs/useTicker'
import { PROXY_URL } from 'config'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  goBack: {
    fontSize: 14,
    borderRadius: 50,
  },
  nftImage: {
    width: '100%',
    objectFit: 'contain',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
}))

const CoinDetail = ({ coinMeta }) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const {
    account,
    library,
    contracts,
    metadata,
    paused: [, , paused],
  } = useContext(WalletContext)

  const router = useRouter()
  const tokenId = router.query.tokenId
  const [timestamp] = useTimestamp()
  const [[owner, data, listing, approved, tokenIndex], setData] = useState(['', coinMeta, null, false, 0])
  const [transaction, setTransaction] = useState('')
  const [rewards, setRewards] = useState(0)

  const fetchData = useCallback(() => {
    if (contracts.avaxcoin && contracts.marketplace) {
      contracts.avaxcoin.methods
        .getRewards([tokenId])
        .then(contracts.avaxcoin.web3.utils.fromWei)
        .then(Number)
        .then((rewards) => {
          setRewards(rewards)
        })
        .catch(console.log)

      Promise.all([
        contracts.avaxcoin.methods.ownerOf(tokenId),
        contracts.avaxcoin.methods.tokenURI(tokenId),
        account?.address
          ? contracts.avaxcoin.methods.isApprovedForAll(account.address, contracts.marketplace.netAddresses.Marketplace)
          : Promise.resolve(false),
        contracts.marketplace.methods.tokenMap(contracts.marketplace.netAddresses.AvaxCoin),
      ])
        .then(([owner, tokenURI, approved, tokenIndex]) => {
          Promise.all([
            axios.get(
              `${tokenURI.replace('http://localhost:3000/', '/').replace('https://avaxcoins.com/', '/')}?network=${account?.network || defaultNetwork
              }`
            ),
            owner === contracts.marketplace.netAddresses.Marketplace
              ? contracts.marketplace.methods.getTokenListing(contracts.marketplace.netAddresses.AvaxCoin, tokenId)
              : Promise.resolve(null),
          ])
            .then(([{ data }, listing]) =>
              setData([
                owner,
                data,
                listing && Number(listing.amount) > 0
                  ? { ...listing, avax: contracts.marketplace.web3.utils.fromWei(listing.price) }
                  : null,
                approved,
                tokenIndex,
              ])
            )
            .catch((err) => {
              console.log(err)
              router.back()
            })
        })
        .catch((err) => {
          console.log(err)
          router.back()
        })
    }
  }, [account, contracts, tokenId, setData, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAction = (type, data, callback) => {
    switch (type) {
      case 'transfer':
        handleTransaction(
          contracts.avaxcoin.methods.transferFrom(account.address, data.address, tokenId, { from: account.address }),
          setTransaction,
          () => {
            fetchData()
            callback && callback()
          }
        )
        break
      case 'approve':
        handleTransaction(
          contracts.avaxcoin.methods.setApprovalForAll(contracts.marketplace.netAddresses.Marketplace, true, {
            from: account.address,
          }),
          setTransaction,
          () => {
            fetchData()
            callback && callback()
          }
        )
        break
      case 'auction':
        handleTransaction(
          contracts.marketplace.methods.list(
            tokenIndex - 1,
            tokenId,
            contracts.marketplace.web3.utils.toWei(data.balance),
            { from: account.address }
          ),
          setTransaction,
          () => {
            fetchData()
            callback && callback()
          }
        )
        break
      case 'update':
        handleTransaction(
          contracts.marketplace.methods.updatePrice(listing.id, contracts.marketplace.web3.utils.toWei(data.balance), {
            from: account.address,
          }),
          setTransaction,
          () => {
            fetchData()
            callback && callback()
          }
        )
        break
      case 'fulfill':
        handleTransaction(
          contracts.marketplace.methods.fulfill(listing.id, { from: account.address, value: listing.price }),
          setTransaction,
          () => {
            fetchData()
            callback && callback()
          }
        )
        break
      case 'cancel':
        handleTransaction(
          contracts.marketplace.methods.cancel(listing.id, { from: account.address }),
          setTransaction,
          () => {
            fetchData()
            callback && callback()
          }
        )
        break
      case 'claim':
        handleTransaction(
          contracts.avaxcoin.methods.claimRewards([tokenId], {
            from: account.address,
          }),
          setTransaction,
          () => fetchRewards()
        )
        break
      default:
        console.log(type, data, callback)
        break
    }
  }

  const handleRefresh = () => {
    if (localStorage.getItem('metadatas')) {
      const meatadatas = JSON.parse(localStorage.getItem('metadatas'))
      delete meatadatas[tokenId]
      localStorage.setItem('metadatas', JSON.stringify(meatadatas))
    }
    axios
      .get(`/api/avaxcoin/refresh/${tokenId}?network=${account?.network || defaultNetwork}`)
      .then(console.log)
      .catch(console.log)
  }

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
                tokenId: ${tokenId}
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
    [tokenId, library, metadata, setActivities]
  )

  return (
    <main className={classes.root}>
      <div className={commonClasses.containerWidth}>
        <PageTitle title={data?.name || '---'} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ContainedButton color="secondary" size="small" onClick={() => router.back()} className={classes.goBack}>
              <ArrowBackIcon />
              &nbsp;Back
            </ContainedButton>
          </Grid>
          <Grid item xs={12} md={4}>
            <img
              alt="nft-item"
              src={`${PROXY_URL}${data?.image || NO_IMAGE_PATH}?timestamp=${timestamp}&full=true`}
              className={classes.nftImage}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = NO_IMAGE_PATH
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.infoContainer}>
              <ManageNFT
                account={account?.address}
                owner={owner}
                listing={listing}
                approved={approved}
                rewards={rewards}
                onAction={handleAction}
                paused={paused > 0}
              />
              <NFTInfo
                account={account}
                library={library}
                owner={owner}
                data={data}
                listing={listing}
                paused={paused > 0}
              />
              <IconButton aria-label="refresh" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={12}>
            <ActivitiesTable data={activities} isEnd={isEnd} onLoad={fetchActivities} />
          </Grid>
        </Grid>
        {(!data || transaction) && <Loading loading />}
      </div>
    </main>
  )
}

export default memo(CoinDetail)