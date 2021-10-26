import { memo, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import clsx from 'clsx'

import { WalletContext } from 'contexts/WalletProvider'
import Loading from 'components/Loading'
import RowDivider from 'parts/RowDivider'
import ClaimImage from './ClaimImage'
import ClaimForm from './ClaimForm'
import ClaimCoins from './ClaimCoins'
import useTicker from 'utils/hooks/useTicker'
import { saleStart } from 'library/constants'
import { useCommonStyles } from 'styles/use-styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
  },
  container: {
    maxWidth: 780,
  },
  count: {
    textAlign: 'center',
    '& span': {
      fontSize: '80%',
    },
  },
}))

function secondsToHMS(secs) {
  function z(n) {
    return (n < 10 ? '0' : '') + n
  }
  let sign = secs < 0 ? '-' : ''
  secs = Math.abs(secs)
  return sign + z((secs / 3600) | 0) + 'h ' + z(((secs % 3600) / 60) | 0) + 'm ' + z(secs % 60) + 's'
}

const Claim = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { paused: [paused] } = useContext(WalletContext)
  const [now] = useTicker()

  return (
    <main className={classes.root}>
      <div className={clsx(commonClasses.containerWidth, classes.container)}>
        {paused === -1
          ? (<Loading loading />)
          : !paused
            ? (
              <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                  <ClaimImage />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ClaimForm />
                </Grid>
                <Grid item xs={12}>
                  <RowDivider />
                </Grid>
                <Grid item xs={12}>
                  <ClaimCoins />
                </Grid>
              </Grid>
            ) : (
              <Typography variant='h4' className={classes.count}>
                <span>Sale starts in</span>
                <br />
                {secondsToHMS(parseInt((saleStart - now) / 1000))}
              </Typography>
            )
        }
      </div>
    </main>
  )
}

export default memo(Claim)