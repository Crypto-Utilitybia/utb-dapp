import { memo } from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { getEllipsis } from 'utils/helpers'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 220,
    width: '100%',
    border: `1px solid ${theme.custom.palette.border}`,
    [theme.breakpoints.down('xs')]: {
      maxWidth: 'unset',
    },
  },
  header: {
    fontWeight: 'bold',
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.background.primary,
  },
  label: {
    fontSize: 14,
    cursor: 'pointer',
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.custom.palette.border}`,
  },
}))

const NFTInfo = ({
  account,
  owner,
  data,
  listing,
  paused
}) => {
  const classes = useStyles()
  const current = listing?.user || owner

  return (
    <div className={classes.root}>
      <Typography color='textSecondary' className={classes.header}>
        Info
      </Typography>

      {data?.attributes.map(({ trait_type, value }) => (
        <Typography
          key={trait_type}
          className={classes.label}
        >
          {trait_type}: {value}
        </Typography>
      ))}

      {current && (
        <Typography className={classes.label}>
          Owner:&nbsp;
          <Link href={account?.address === current ? '/wallet' : `/account/${current}`}>
            {account?.address === current ? 'You' : getEllipsis(current)}
          </Link>
        </Typography>
      )}

      <Typography className={classes.label}>
        {listing?.amount > 0
          ? `Listed for sale (${listing.avax} AVAX)`
          : paused
            ? 'Trade disabled'
            : 'Not listed for sale'
        }
      </Typography>
    </div>
  )
}

export default memo(NFTInfo)