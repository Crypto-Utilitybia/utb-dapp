import { memo } from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { alpha } from '@material-ui/core/styles/colorManipulator';

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
  content: {
    position: 'relative'
  },
  box: {
    width: '100%',
    objectFit: 'contain',
    cursor: 'pointer',
    borderRadius: 4,
    boxShadow: '0px 0px 13px rgba(0, 0, 0, 0.25)',
    border: `3px solid ${theme.custom.palette.border}`
  },
  infoContainer: {
    position: 'absolute',
    top: 0,
    height: '100%',
    padding: theme.spacing(4, 3),
    backgroundColor: alpha(theme.palette.primary.main, 0.3)
  },
  description: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing(3)
  }
}))

const GiftCard = ({
  item
}) => {
  const classes = useStyles()

  return (
    <main className={classes.root}>
      <Typography color='textPrimary' variant='h5' className={classes.name}>
        {item.name}
      </Typography>
      <div className={classes.content}>
        <img
          alt='gift-box'
          src={item.image}
          className={classes.box}
        />
        <div className={classes.infoContainer}>
          {item.description.map((item, index) => (
            <Typography key={index} color='textPrimary' className={classes.description}>
              {item}
            </Typography>
          ))}
        </div>
      </div>
    </main>
  )
}

export default memo(GiftCard)