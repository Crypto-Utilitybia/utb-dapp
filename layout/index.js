import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import TopAppBar from './TopAppBar'
// import Footer from './Footer'
import { ROOM_1_BACKGROUND_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles(() => ({
  root: (props) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
    backgroundImage: `url(${props.backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }),
  container: {
    flex: '1 0 auto',
  },
}))

const Layout = ({
  backgroundImage = ROOM_1_BACKGROUND_IMAGE_PATH,
  children
}) => {
  const classes = useStyles({ backgroundImage })

  return (
    <main className={classes.root}>
      <TopAppBar />
      <div className={classes.container}>{children}</div>
      {/* <Footer /> */}
    </main>
  )
}

export default memo(Layout)
