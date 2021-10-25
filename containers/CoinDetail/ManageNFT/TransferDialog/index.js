import { memo, useCallback } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'

import Modal from 'components/Modal'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import TextField from 'components/UI/TextFields/TextField'
import { ADDRESS_VALID } from 'utils/constants/validations'

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
  },
  button: {
    fontSize: 24,
    textTransform: 'capitalize',
  },
}))

const schema = yup.object().shape({
  address: ADDRESS_VALID,
})

const TransferDialog = ({ open, setOpen, onSubmit }) => {
  const classes = useStyles()

  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  })

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Modal open={open} title="Transfer NFT" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              as={<TextField />}
              name="address"
              label="Address"
              placeholder="Destination Address"
              error={errors.address?.message}
              control={control}
              defaultValue={''}
            />
          </Grid>
          <Grid item xs={12}>
            <ContainedButton fullWidth type="submit" color="secondary" className={classes.button}>
              Transfer
            </ContainedButton>
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}

export default memo(TransferDialog)
