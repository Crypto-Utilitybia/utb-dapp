import { memo, useCallback } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'

import Modal from 'components/Modal'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import TextField from 'components/UI/TextFields/TextField'
import { BALANCE_VALID } from 'utils/constants/validations'

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
  balance: BALANCE_VALID,
})

const AuctionDialog = ({ open, setOpen, isUpdate, onSubmit }) => {
  const classes = useStyles()

  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  })

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Modal open={open} title="Auction NFT" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              as={<TextField />}
              name="balance"
              type="number"
              label="Price"
              placeholder="Auction price"
              error={errors.balance?.message}
              control={control}
              defaultValue={''}
            />
          </Grid>
          <Grid item xs={12}>
            <ContainedButton fullWidth type="submit" color="secondary" className={classes.button}>
              {isUpdate ? 'Update Price' : 'Submit Listing'}
            </ContainedButton>
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}

export default memo(AuctionDialog)
