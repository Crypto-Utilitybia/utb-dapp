
import { memo, useCallback } from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
  item: {
    cursor: 'pointer',
    color: theme.palette.text.default,
    margin: theme.spacing(1, 0),
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));

const FooterMenuItem = ({
  menu
}) => {
  const classes = useStyles()
  const router = useRouter()

  const onNavHandler = useCallback(() => {
    if (menu.IS_IN_LINK) {
      router.push(menu.HREF)
      return
    }

    window.open(menu.HREF, '_blank')
  }, [menu, router]);

  return (
    <Typography
      variant='body1'
      className={classes.item}
      onClick={onNavHandler}
    >
      {menu.TITLE}
    </Typography>
  );
};

export default memo(FooterMenuItem);
