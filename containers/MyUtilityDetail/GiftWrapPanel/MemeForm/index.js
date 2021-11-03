import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import ContainedButton from 'components/UI/Buttons/ContainedButton'
import TextField from 'components/UI/TextFields/TextField'
import UtilityCheckbox from 'components/UI/UtilityCheckbox'
import PriceList from 'containers/MyUtilityDetail/Shared/PriceList'

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
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <ContainedButton fullWidth>
          Select Asset
        </ContainedButton>
      </Grid>
      <Grid item xs={6}>
        <TextField
          placeholder='Amount'
        />
      </Grid>
      <Grid item xs={12}>
        <PriceList prices={[0.01, 0.02, 0.45, 0.5]} />
      </Grid>
      <Grid item xs={12}>
        <UtilityCheckbox
          label='Wrap Gift Box'
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