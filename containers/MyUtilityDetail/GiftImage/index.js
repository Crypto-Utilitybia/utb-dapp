import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  box: {
    width: '100%',
    objectFit: 'contain',
    cursor: 'pointer',
    borderRadius: 4,
    boxShadow: '0px 0px 13px rgba(0, 0, 0, 0.25)',
    border: `3px solid ${theme.custom.palette.border}`
  },
}))

const GiftImage = ({
  item
}) => {
  const classes = useStyles()

  return (
    <img
      alt='gift-box'
      src={item.image}
      className={classes.box}
    />
  )
}

export default memo(GiftImage)