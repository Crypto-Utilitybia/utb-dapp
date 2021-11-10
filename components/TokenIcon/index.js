
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import LP_ICONS from 'utils/constants/lp-icons'
import { NO_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles(() => ({
  tokenImage: props => ({
    width: props.size,
    height: props.size,
    borderRadius: 50,
    objectFit: 'contain',
  })
}));

const TokenIcon = ({
  token,
  size = 50,
  className,
}) => {
  const classes = useStyles({ size });

  return (
    <img
      alt='token-icon'
      src={LP_ICONS[token || 'BLUE']}
      className={clsx(classes.tokenImage, className)}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = NO_IMAGE_PATH;
      }}
    />
  )
}

export default memo(TokenIcon);