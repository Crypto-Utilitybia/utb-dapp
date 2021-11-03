import { memo, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useCommonStyles } from 'styles/use-styles'

import { useMyUtilities } from 'contexts/my-utilities-context'
import Loading from 'components/Loading'
import GiftImage from './GiftImage'
import GiftWrapPanel from './GiftWrapPanel'
import GiftOpenPanel from './GiftOpenPanel'

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

const MyUtilityDetail = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const router = useRouter()
  const { loading, utilities } = useMyUtilities()

  const utility = useMemo(() => utilities.find((item) => item.id === router.query.giftId)
    , [router.query.giftId, utilities])

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
              {utility?.name || ''}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={5}>
            <GiftImage item={utility} />
          </Grid>
          <Grid item xs={12} sm={7}>
            <GiftWrapPanel item={utility} />
          </Grid>
          <Grid item xs={12} sm={7}>
            <GiftOpenPanel item={utility} />
          </Grid>
        </Grid>
      </div>
    </main>
  )
}

export default memo(MyUtilityDetail)