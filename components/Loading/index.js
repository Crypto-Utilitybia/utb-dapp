import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
// import ReactLottie from 'react-lottie'
// import loadingData from './trail-loading.json'
import { CircularProgress } from '@material-ui/core'

// const defaultOptions = {
//   loop: true,
//   autoplay: true,
//   animationData: loadingData,
//   rendererSettings: {
//     preserveAspectRatio: 'xMidYMid slice',
//   },
// }

// const LoadingSpinner = ({ loading, size = 100 || size, ...rest }) => {
//   if (!loading) return null
//   return (
//     <ReactLottie
//       isPaused={false}
//       isStopped={false}
//       options={defaultOptions}
//       style={{ width: size, height: size }}
//       {...rest}
//     />
//   )
// }

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
      {/* <LoadingSpinner loading={loading} size={size} /> */}
      {loading && <CircularProgress size={size} thickness={size / 15} className={classes.progress} />}
    </div>
  )
}

export default memo(Loading)
