
import { memo } from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import clsx from 'clsx'

import LINKS from 'utils/constants/links'
import { LOGO_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles((theme) => ({
  picture: {
    display: 'flex',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'unset'
  },
  img: {
    height: 57,
    objectFit: 'contain',
  },
  label: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.palette.text.default,
    marginLeft: theme.spacing(1),
  }
}));

const Logo = ({
  isLabel = true,
  className,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Link href={LINKS.CLAIM.HREF}>
      <a className={clsx(classes.container, className)}>
        <picture className={classes.picture} {...rest}>
          <source srcSet={LOGO_IMAGE_PATH} />
          <img
            className={classes.img}
            src={LOGO_IMAGE_PATH}
            alt='logo'
          />
        </picture>

        {isLabel &&
          <Typography className={classes.label}>
            Crypto Utilitybia
          </Typography>
        }
      </a>
    </Link>
  )
}

export default memo(Logo);
