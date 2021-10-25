import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 102,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: props.height ? props.height : '100%',
    left: 0,
    top: 0,
    background: '#e13e3f1a',
  }),
  progress: {
    color: theme.palette.primary.contrastText,
  },
}))

const Loading = ({ loading, height, size = 60 }) => {
  const classes = useStyles({ height })

  return (
    <div className={classes.root}>
      {
        loading &&
        <CircularProgress
          size={size}
          thickness={size / 15}
          className={classes.progress}
        />
      }
    </div>
  )
}

export default memo(Loading)
