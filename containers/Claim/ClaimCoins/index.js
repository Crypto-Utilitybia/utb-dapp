import { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import PlusIcon from '@material-ui/icons/AddCircleOutline'

import TokenIcon from 'components/TokenIcon'
import { TIERS } from 'utils/constants/coins'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  coinItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    padding: theme.spacing(1),
  },
  selected: {
    position: 'relative',
    boxShadow: '0px 0px 13px rgba(0, 0, 0, 0.25)',
    borderRadius: 30,
    border: `1px solid ${theme.custom.palette.border}`,
  },
  plusIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: theme.palette.text.secondary,
  },
  label: {
    padding: theme.spacing(1, 1),
    width: '100%',
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}))

const TIER_COPIES = {
  1: [10, 4],
  2: [15, 6],
  3: [20, 9],
  4: [40, 18],
  5: [50, 22],
  6: [70, 28],
  7: [80, 32],
}

const ClaimCoins = () => {
  const classes = useStyles()

  const [selectIcon, setSelectedIcon] = useState(TIERS[0][0] || {})

  const selectHandler = (item) => () => {
    setSelectedIcon(item)
  }

  return (
    <Grid container spacing={5}>
      {TIERS.map((coins, tierIndex) =>
        coins.map((item, index) => (
          <Grid key={`${tierIndex}-${index}`} item xs={12} sm={6} md={4}>
            <div
              className={clsx(classes.coinItem, { [classes.selected]: selectIcon.name === item.name })}
              onClick={selectHandler(item)}
            >
              {selectIcon.name === item.name && <PlusIcon className={classes.plusIcon} />}
              <div>
                <TokenIcon token={item.coin} size={160} />
                <Typography variant="body2" className={classes.label}>
                  <span className={classes.info}>
                    Type: <b>{item.name}</b>
                  </span>
                  <span className={classes.info}>
                    Tier: <b>{item.tier}</b>
                  </span>
                  <span className={classes.info}>
                    W/ Background:{' '}
                    <b>
                      {TIER_COPIES[item.tier][1]} / {TIER_COPIES[item.tier][0]}
                    </b>
                  </span>
                  <span className={classes.info}>
                    Coins: <b>{TIER_COPIES[item.tier][0]} / 2800</b>
                  </span>
                </Typography>
              </div>
            </div>
          </Grid>
        ))
      )}
    </Grid>
  )
}

export default memo(ClaimCoins)
