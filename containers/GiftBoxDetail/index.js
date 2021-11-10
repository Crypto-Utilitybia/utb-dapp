import { memo, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useCommonStyles } from 'styles/use-styles'

import { useStore } from 'contexts/store-context'
import Loading from 'components/Loading'
import TokenIcon from 'components/TokenIcon'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import GiftCard from './GiftCard'
import { isEmpty } from 'utils/helpers'

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
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  description: {
    fontWeight: 'bold',
    maxWidth: 560
  }
}))

const GiftBoxDetail = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const router = useRouter()
  const { loading, gifts } = useStore()

  const gift = useMemo(() => gifts.find((item) => item.name === router.query.giftId)
    , [router.query.giftId, gifts])

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
              {gift?.name || 'Gift'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.priceContainer}>
              <ContainedButton
                endIcon={<TokenIcon size={30} token='AVAX' />}
              >
                {gift.price}
              </ContainedButton>
            </div>
          </Grid>
          {!isEmpty(gift) &&
            gift.items.map((item, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <GiftCard item={item} />
              </Grid>
            ))
          }
          <Grid item xs={12}>
            <div className={classes.container}>
              <Typography
                variant='h5'
                align='center'
                color='textSecondary'
                className={classes.description}
              >
                Note: You can put any meme assets or NFTs
                inside and gift them to your friends
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    </main>
  )
}

export default memo(GiftBoxDetail)