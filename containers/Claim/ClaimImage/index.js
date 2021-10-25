import { memo, useCallback, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'services/axios'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { WalletContext } from 'contexts/WalletProvider'
import { defaultNetwork, LIBRARY_FETCH_TIME } from 'library/constants'
import Loading from 'components/Loading'
import { NO_IMAGE_PATH } from 'utils/constants/image-paths'
import { useTimestamp } from 'utils/hocs/useTicker'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  nftItem: {
    height: 280,
    objectFit: 'contain',
  },
}))

const ClaimImage = () => {
  const classes = useStyles()
  const { account, contracts } = useContext(WalletContext)
  const [timestamp] = useTimestamp()
  const [[totalSupply, data], setData] = useState([-1, null])

  const fetchData = useCallback(() => {
    if (contracts.avaxcoin) {
      contracts.avaxcoin.methods
        .totalSupply()
        .then(Number)
        .then((supply) => {
          if (supply === 0) {
            setData([0, null])
          } else if (supply > totalSupply) {
            contracts.avaxcoin.methods
              .tokenURI(supply)
              .then((tokenURI) => {
                axios
                  .get(
                    `${tokenURI
                      .replace('http://localhost:3000/', '/')
                      .replace('https://avaxcoins.com/', '/')}?network=${account?.network || defaultNetwork}`
                  )
                  .then(({ data }) => setData([supply, data]))
                  .catch(console.log)
              })
              .catch(console.log)
          }
        })
        .catch(console.log)
    }
  }, [account, contracts, totalSupply, setData])

  useEffect(() => {
    fetchData()
    const timer = setInterval(() => fetchData(), LIBRARY_FETCH_TIME)
    return () => clearInterval(timer)
  }, [fetchData])

  return data ? (
    <div className={classes.root}>
      <Typography className={classes.title} align="center">
        {data.name}
      </Typography>
      <Link href={`/coin/${totalSupply}`}>
        <img
          alt="nft-item"
          src={`${data.image}?timestamp=${timestamp}`}
          className={classes.nftItem}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = NO_IMAGE_PATH
          }}
        />
      </Link>
      {/* <Typography variant="body2" align="center">
        {data.description}
      </Typography> */}
    </div>
  ) : (
    <div className={classes.root}>
      <Typography className={classes.title} align="center">
        {totalSupply === 0 ? 'No Claims Yet.' : '...'}
      </Typography>
      {totalSupply === -1 && <Loading loading />}
    </div>
  )
}

export default memo(ClaimImage)
