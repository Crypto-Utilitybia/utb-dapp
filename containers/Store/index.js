import { memo } from 'react'
import { useRouter } from 'next/router'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useCommonStyles } from 'styles/use-styles'

import { useStore } from 'contexts/store-context'
import Loading from 'components/Loading'
import { GIFT_BOXES_PRODUCT_IMAGE_PATH } from 'utils/constants/image-paths'
import LINKS from 'utils/constants/links'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(20, 0),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(6, 0),
    },
  },
  box: {
    width: '100%',
    borderRadius: 4,
    objectFit: 'contain',
    cursor: 'pointer',
    boxShadow: '0px 0px 13px rgba(0, 0, 0, 0.25)',
  },
  emptyBox: {
    height: '100%',
    minHeight: 240,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.custom.gradient.blue,
    borderRadius: 4,
    boxShadow: '0px 0px 13px rgba(0, 0, 0, 0.25)',
  },
  soonLabel: {
    fontWeight: 'bold'
  }
}))

const EmptyBox = () => {
  const classes = useStyles()

  return (
    <div className={classes.emptyBox}>
      <Typography variant='h5' align='center' className={classes.soonLabel}>
        Coming Soon...
      </Typography>
    </div>
  )
}

const Store = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const router = useRouter()
  const { loading } = useStore()

  const giftHandler = () => {
    router.push(LINKS.GIFT_BOX.HREF)
  }

  return (
    <main className={classes.root}>
      <div className={commonClasses.containerWidth}>
        {loading && <Loading loading />}
        <Grid container spacing={8}>
          <Grid item xs={12} sm={6} md={4}>
            <img
              alt='gift-boxes'
              src={GIFT_BOXES_PRODUCT_IMAGE_PATH}
              className={classes.box}
              onClick={giftHandler}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <EmptyBox />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <EmptyBox />
          </Grid>
        </Grid>
      </div>
    </main>
  )
}

export default memo(Store)