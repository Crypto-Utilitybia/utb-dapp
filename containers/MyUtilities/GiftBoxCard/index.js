import { memo } from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2)
  },
  box: {
    width: '100%',
    objectFit: 'contain',
    cursor: 'pointer',
    borderRadius: 4,
    boxShadow: '0px 0px 13px rgba(0, 0, 0, 0.25)',
    border: `3px solid ${theme.custom.palette.border}`
  },
}))

const GiftBoxCard = ({
  gift
}) => {
  const classes = useStyles()

  return (
    <main className={classes.root}>
      <Typography color='textPrimary' variant='h5' className={classes.name}>
        {gift.name}
      </Typography>
      <img
        alt='gift-box'
        src={gift.image}
        className={classes.box}
      />
    </main>
  )
}

export default memo(GiftBoxCard)