import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import ContainedButton from 'components/UI/Buttons/ContainedButton'
import TextField from 'components/UI/TextFields/TextField'

const useStyles = makeStyles(() => ({
  label: {
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold'
  },
}))

const OpenForm = ({
  item
}) => {
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          placeholder='Gifty Address'
        />
      </Grid>
      <Grid item xs={12}>
        Stars
      </Grid>
      <Grid item xs={12}>
        <ContainedButton fullWidth>
          Send
        </ContainedButton>
      </Grid>
    </Grid>
  )
}

export default memo(OpenForm)