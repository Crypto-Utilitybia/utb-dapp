import { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import TransferDialog from './TransferDialog'
import AuctionDialog from './AuctionDialog'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 220,
    width: '100%',
    border: `1px solid ${theme.custom.palette.border}`,
    marginBottom: theme.spacing(3),
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
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.custom.palette.border}`,
  },
  none: {
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.custom.palette.border}`,
  },
}))

const ManageNFT = ({
  account,
  owner,
  listing,
  approved,
  rewards,
  onAction,
  paused
}) => {
  const classes = useStyles()
  const [action, setAction] = useState('')
  const isOwner = account === owner

  const handleAction = (...args) => {
    onAction(...args, () => setAction(''))
  }

  return (
    <div className={classes.root}>
      <Typography color="textSecondary" className={classes.header}>
        Manage NFT
      </Typography>
      {
        isOwner ? (
          <>
            <Typography
              className={classes.label}
              onClick={() => setAction('transfer')}
            >
              Transfer
            </Typography>
            {!paused && (
              <Typography
                className={classes.label}
                onClick={() => (approved ? setAction('auction') : onAction('approve'))}
              >
                {approved ? 'Auction' : 'Approve'}
              </Typography>
            )}
            <Typography
              className={classes.label}
              onClick={() => onAction('claim')}
            >
              Claim ({rewards.toFixed(8)})
            </Typography>
          </>
        ) : listing
          ? (
            listing.user === account
              ? (
                <>
                  <Typography className={classes.label} onClick={() => setAction('update')}>
                    Update Price
                  </Typography>
                  <Typography className={classes.label} onClick={() => onAction('cancel')}>
                    Cancel Listing
                  </Typography>
                </>
              ) : (
                <Typography className={classes.label} onClick={() => onAction('fulfill')}>
                  Buy at {Number(listing.avax).toFixed(2)} (AVAX)
                </Typography>
              )
          ) : (
            <Typography className={classes.none}>
              No Actions
            </Typography>
          )
      }

      {action === 'transfer' &&
        <TransferDialog
          open={action === 'transfer'}
          setOpen={() => setAction('')}
          onSubmit={(data) => handleAction(action, data)}
        />
      }

      {(action === 'auction' || action === 'update') &&
        <AuctionDialog
          open={action === 'auction' || action === 'update'}
          isUpdate={action === 'update'}
          setOpen={() => setAction('')}
          onSubmit={(data) => handleAction(action, data)}
        />
      }
    </div>
  )
}

export default memo(ManageNFT)
