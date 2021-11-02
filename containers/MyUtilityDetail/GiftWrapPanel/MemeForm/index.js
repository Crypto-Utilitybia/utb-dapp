import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Checkbox, FormControlLabel } from '@material-ui/core'

import ContainedButton from 'components/UI/Buttons/ContainedButton'
import OutlinedButton from 'components/UI/Buttons/OutlinedButton'
import TokenIcon from 'components/TokenIcon'

const useStyles = makeStyles(() => ({
  label: {
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold'
  },
}))

const MemeForm = ({
  item
}) => {
  const classes = useStyles()

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <ContainedButton fullWidth>
          Select Asset
        </ContainedButton>
      </Grid>
      <Grid item xs={6}>
        <OutlinedButton fullWidth>
          Amount
        </OutlinedButton>
      </Grid>
      <Grid item xs={6}>
        <Typography color='primary' className={classes.label}>
          <TokenIcon size={25} token='AVAX' />	&nbsp;
          {item?.price || 0} Avax
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography color='primary' className={classes.label}>
          <TokenIcon size={25} token='AVAX' />	&nbsp;
          {item?.price || 0} Avax
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography color='primary' className={classes.label}>
          <TokenIcon size={25} token='AVAX' />	&nbsp;
          {item?.price || 0} Avax
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography color='primary' className={classes.label}>
          <TokenIcon size={25} token='AVAX' />	&nbsp;
          {item?.price || 0} Avax
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          color='primary'
          label='Wrap Gift Box'
          control={<Checkbox />}
        />
      </Grid>
      <Grid item xs={6}>
        <ContainedButton fullWidth>
          Put In
        </ContainedButton>
      </Grid>
      <Grid item xs={6}>
        <ContainedButton fullWidth>
          Wrap
        </ContainedButton>
      </Grid>
    </Grid>
  )
}

export default memo(MemeForm)