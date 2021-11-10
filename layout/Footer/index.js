
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import clsx from 'clsx'

import FooterLinks from './FooterLinks'
import FooterSocial from './FooterSocial'
import { useCommonStyles } from 'styles/use-styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(6, 0),
    backgroundColor: theme.palette.background.secondary
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: theme.custom.layout.maxFooterWidth,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    }
  },
  divider: {
    height: 160,
    width: 1,
    margin: theme.spacing(0, 3),
    backgroundColor: theme.palette.text.secondary,
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
}));

const Footer = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <footer className={classes.root}>
      <div className={clsx(commonClasses.containerWidth, classes.container)}>
        <FooterLinks />
        <Divider orientation='vertical' className={classes.divider} />
        <FooterSocial />
      </div>
    </footer>
  );
};

export default memo(Footer);
