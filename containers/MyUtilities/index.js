import { memo } from 'react'
import { useRouter } from 'next/router'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useCommonStyles } from 'styles/use-styles'

import { useMyUtilities } from 'contexts/my-utilities-context'
import Loading from 'components/Loading'
import GiftBoxCard from './GiftBoxCard'
import LINKS from 'utils/constants/links'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4, 0)
  },
  title: {
    fontWeight: 'bold'
  }
}))

const MyUtilities = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const router = useRouter()
  const { loading, utilities } = useMyUtilities()

  const giftHandler = (gift) => () => {
    router.push(
      LINKS.GIFT_BOX_DETAIL.HREF,
      LINKS.GIFT_BOX_DETAIL.HREF.replace('[giftId]', gift.name)
    )
  }

  return (
    <main className={classes.root}>
      <div className={commonClasses.containerWidth}>
        {loading && <Loading loading />}
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography
              variant='h3'
              align='center'
              color='textPrimary'
              className={classes.title}
            >
              My Utilities
            </Typography>
          </Grid>
          {utilities.map((gift, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} onClick={giftHandler(gift)}>
              <GiftBoxCard gift={gift} />
            </Grid>
          ))}
        </Grid>
      </div>
    </main>
  )
}

export default memo(MyUtilities)