
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  Typography
} from '@material-ui/core'

import FooterMenuItem from '../FooterMenuItem'
import { PARTNERS_MENU } from 'utils/constants/footer-menu'

const useStyles = makeStyles(theme => ({
  root: {
    width: 180,
    margin: theme.spacing(0.5, 0),
    color: theme.palette.text.default,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2)
  }
}));

const FooterPartners = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography
        variant='h6'
        className={classes.title}
      >
        Partners
      </Typography>
      <Grid container>
        {PARTNERS_MENU.map((menuItem) => (
          <Grid item key={menuItem.TITLE} xs={6} sm={12}>
            <FooterMenuItem menu={menuItem} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default memo(FooterPartners);
