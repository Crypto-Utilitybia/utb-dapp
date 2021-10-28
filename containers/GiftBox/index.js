import { memo } from 'react'
import { useRouter } from 'next/router'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useCommonStyles } from 'styles/use-styles'

import { useStore } from 'contexts/store-context'
import Loading from 'components/Loading'
import GiftBoxCard from './GiftBoxCard'
import {
  CYLINDER_WRAPPED_PRODUCT_IMAGE_PATH,
  SQUARE_WRAPPED_PRODUCT_IMAGE_PATH,
  HEXAGON_WRAPPED_PRODUCT_IMAGE_PATH
} from 'utils/constants/image-paths'
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

const GiftBox = () => {
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
          <Grid item xs={12}>
            <Typography
              variant='h3'
              align='center'
              color='primary'
              className={classes.title}
            >
              Gift Box
            </Typography>
          </Grid>
          {gifts.map((gift, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} onClick={giftHandler}>
              <GiftBoxCard gift={gift} />
            </Grid>
          ))}
        </Grid>
      </div>
    </main>
  )
}

const gifts = [
  {
    name: 'Raider',
    image: CYLINDER_WRAPPED_PRODUCT_IMAGE_PATH,
    price: 0.5
  },
  {
    name: 'Popular',
    image: SQUARE_WRAPPED_PRODUCT_IMAGE_PATH,
    price: 0.5
  },
  {
    name: 'Song',
    image: HEXAGON_WRAPPED_PRODUCT_IMAGE_PATH,
    price: 0.5
  }
]

export default memo(GiftBox)