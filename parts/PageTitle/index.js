
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import RowDivider from 'parts/RowDivider'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
      flexDirection: 'column'
    },
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  },
  divider: {
    margin: theme.spacing(3, 0)
  },
}));

const PageTitle = ({
  title,
  noBorder = false,
  children,
  className
}) => {
  const classes = useStyles()

  return (
    <div className={className}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Typography
            variant='h5'
            className={classes.title}
          >
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          {children}
        </Grid>
      </Grid>

      {!noBorder &&
        <RowDivider className={classes.divider} />
      }
    </div>
  )
}

export default memo(PageTitle)