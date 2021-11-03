import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import ContainedButton from 'components/UI/Buttons/ContainedButton'
import TextField from 'components/UI/TextFields/TextField'
import UtilityCheckbox from 'components/UI/UtilityCheckbox'

const useStyles = makeStyles(() => ({
  label: {
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold'
  },
}))

const NFTForm = ({
  item
}) => {
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <ContainedButton fullWidth>
          Select NFT
        </ContainedButton>
      </Grid>
      <Grid item xs={6}>
        <TextField
          placeholder='Token Id'
        />
      </Grid>
      <Grid item xs={12}>
        Stars
      </Grid>
      <Grid item xs={12}>
        <UtilityCheckbox
          label='Wrap Gift Box'
        />
      </Grid>
      <Grid item xs={12}>
        <ContainedButton fullWidth>
          {`Put In & Wrap`}
        </ContainedButton>
      </Grid>
    </Grid>
  )
}

export default memo(NFTForm)