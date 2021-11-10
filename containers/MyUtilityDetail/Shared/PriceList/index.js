import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import TokenIcon from 'components/TokenIcon'

const useStyles = makeStyles(() => ({
  label: {
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold'
  },
}))

const PriceList = ({
  prices
}) => {
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      {prices.map((price, index) => (
        <Grid key={index} item xs={6}>
          <Typography color='primary' className={classes.label}>
            <TokenIcon size={25} token='AVAX' />	&nbsp;
            {price} Avax
          </Typography>
        </Grid>
      ))}
    </Grid>
  )
}

export default memo(PriceList)