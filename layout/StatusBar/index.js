import { memo, useCallback, useContext, useEffect, useState } from 'react'
import { Typography, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import { useCommonStyles } from 'styles/use-styles'
import TokenIcon from 'components/TokenIcon'
import { WalletContext } from 'contexts/WalletProvider'
import { getGraph } from 'library/utils'
import { LIBRARY_FETCH_TIME } from 'library/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.primary,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.palette.text.default,
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1, 0),
    },
    '& span': {
      color: theme.palette.text.secondary,
    },
  },
  divider: {
    height: '100%',
    width: 1,
    margin: theme.spacing(0, 1),
    backgroundColor: theme.custom.palette.border,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  icon: {
    marginLeft: theme.spacing(1),
  },
}))

const StatusBar = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const { library } = useContext(WalletContext)
  const [[totalVolume, dailyVolume, floorPrice, listings], setData] = useState([0, 0, 0, 0])

  const fetchData = useCallback(() => {
    if (library) {
      getGraph(
        library.currentNetwork,
        `query {
          config(id: 1) {
            owner
            tradeTotal
            tradeDaily
            volumeTotal
            volumeDaily
            floorPrice
            listings
          }
        }`
      )
        .then(({ config: { volumeTotal, volumeDaily, floorPrice, listings } }) => {
          setData([
            library.web3.utils.fromWei(volumeTotal),
            library.web3.utils.fromWei(volumeDaily),
            library.web3.utils.fromWei(floorPrice),
            listings,
          ])
        })
        .catch(console.log)
    }
  }, [library, setData])

  useEffect(() => {
    fetchData()
    const timer = setInterval(() => fetchData(), LIBRARY_FETCH_TIME)
    return () => clearInterval(timer)
  }, [fetchData])

  return (
    <div className={classes.root}>
      <div className={clsx(commonClasses.containerWidth, classes.container)}>
        <Typography className={classes.label}>
          <span>Total Volume:</span>&nbsp;{totalVolume}&nbsp;
          <TokenIcon size={20} token="AVAX" />
        </Typography>

        <Divider orientation="vertical" className={classes.divider} />

        <Typography className={classes.label}>
          <span>Daily Volume:</span>&nbsp;{dailyVolume}&nbsp;
          <TokenIcon size={20} token="AVAX" />
        </Typography>

        <Divider orientation="vertical" className={classes.divider} />

        <Typography className={classes.label}>
          <span>Floor Price:</span>&nbsp;{Number(floorPrice).toFixed(2)}&nbsp;
          <TokenIcon size={20} token="AVAX" />
        </Typography>

        <Divider orientation="vertical" className={classes.divider} />

        <Typography className={classes.label}>
          <span>Total Listing:</span>&nbsp;{listings}&nbsp;
          {/* <TokenIcon size={20} token="AVAX" /> */}
        </Typography>
      </div>
    </div>
  )
}

export default memo(StatusBar)
