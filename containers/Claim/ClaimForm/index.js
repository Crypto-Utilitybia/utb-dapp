import { memo, useCallback, useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Button } from '@material-ui/core'
import clsx from 'clsx'
import { WalletContext } from 'contexts/WalletProvider'
import RowDivider from 'parts/RowDivider'
import Loading from 'components/Loading'
import { handleTransaction } from 'library/utils'
import { LIBRARY_FETCH_TIME } from 'library/constants'

const MAX_COUNT = 20

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    height: 50,
    width: 'calc(100% - 200px)',
    backgroundColor: theme.custom.palette.border,
    textTransform: 'capitalize',
    '&:hover': {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.primary.contrastText,
    },
  },
  button: {
    fontWeight: 'bold',
    borderRadius: 0,
    fontSize: 30,
    height: 50,
    width: 50,
    minWidth: 'unset',
    color: theme.palette.text.default,
  },
  minus: {
    backgroundColor: theme.palette.text.secondary,
  },
  plus: {
    backgroundColor: theme.palette.text.secondary,
  },
  max: {
    backgroundColor: theme.palette.primary.contrastText,
    width: 100,
    '&:hover': {
      backgroundColor: theme.palette.primary.background,
    },
  },
  balance: {
    fontWeight: 'bold',
    '& span': {
      color: theme.palette.primary.contrastText,
    },
  },
}))

const ClaimCount = ({ fetchData }) => {
  const classes = useStyles()
  const {
    account,
    connected,
    contracts,
    paused: [, mintFee],
  } = useContext(WalletContext)

  const [count, setCount] = useState(1)
  const [transaction, setTransaction] = useState('')

  const countHandler = (value) => {
    setCount(Math.min(value, MAX_COUNT))
  }

  const handleClaim = () => {
    if (account?.address && contracts.avaxcoin) {
      handleTransaction(
        contracts.avaxcoin.methods.mint(count, {
          from: account.address,
          value: contracts.avaxcoin.web3.utils.toWei((count * mintFee).toString()),
        }),
        setTransaction,
        () => fetchData()
      )
    }
  }

  return (
    <div className={classes.root}>
      <Button
        disabled={count === 1}
        className={clsx(classes.minus, classes.button)}
        onClick={() => countHandler(count - 1)}
      >
        -
      </Button>
      <Button
        disabled={!connected || count * mintFee > account?.balance}
        className={classes.label}
        onClick={handleClaim}
      >{`Claim ${count}`}</Button>
      <Button
        disabled={count >= MAX_COUNT}
        className={clsx(classes.plus, classes.button)}
        onClick={() => countHandler(count + 1)}
      >
        +
      </Button>
      <Button
        disabled={count >= MAX_COUNT}
        className={clsx(classes.plus, classes.button, classes.max)}
        onClick={() => countHandler(MAX_COUNT)}
      >
        MAX
      </Button>
      {transaction && <Loading loading />}
    </div>
  )
}

const ClaimForm = () => {
  const classes = useStyles()
  const {
    account,
    connected,
    contracts,
    paused: [, mintFee],
  } = useContext(WalletContext)
  const [[balance, totalSupply], setData] = useState([0, 0])

  const fetchData = useCallback(() => {
    if (contracts.avaxcoin) {
      Promise.all([
        connected ? contracts.avaxcoin.methods.balanceOf(account.address) : Promise.resolve(0),
        connected ? contracts.avaxcoin.methods.totalSupply() : Promise.resolve(0),
      ])
        .then(setData)
        .catch(console.log)
    }
  }, [account, connected, contracts, setData])

  useEffect(() => {
    fetchData()
    const timer = setInterval(() => fetchData(), LIBRARY_FETCH_TIME)
    return () => clearInterval(timer)
  }, [fetchData])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography className={classes.balance} gutterBottom>
          Total Claimed: <span>{totalSupply} / 2800</span>
        </Typography>
        <Typography className={classes.balance} gutterBottom>
          Price: <span>{mintFee} AVAX</span>
        </Typography>
        <Typography className={classes.balance} gutterBottom>
          Your Balance: <span>{balance}</span>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <RowDivider />
      </Grid>
      <Grid item xs={12}>
        <ClaimCount fetchData={fetchData} />
      </Grid>
    </Grid>
  )
}

export default memo(ClaimForm)
