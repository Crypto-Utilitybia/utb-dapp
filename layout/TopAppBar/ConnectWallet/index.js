import { useContext, memo } from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/ExitToApp'
import Identicon from 'react-identicons'

import ContainedButton from 'components/UI/Buttons/ContainedButton'
import { WalletContext } from 'contexts/WalletProvider'
import { getEllipsis } from 'utils/helpers'
import COLORS from 'utils/constants/colors'
import LINKS from 'utils/constants/links'
import { supported } from 'library/constants'

const useStyles = makeStyles((theme) => ({
  accountContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  account: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.palette.text.default,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  icon: {
    color: theme.palette.text.default,
  },
  identicon: {
    borderRadius: '50%',
  },
}))

const ConnectWallet = () => {
  const classes = useStyles()
  const { connectWallet, switchNetwork, account, library } = useContext(WalletContext)

  return account?.address ? (
    supported.includes(account.network) ? (
      <div className={classes.accountContainer}>
        <Link href={LINKS.WALLET.HREF}>
          <Button
            aria-label="account"
            startIcon={
              <Identicon
                className={classes.identicon}
                string={account.address}
                size={25}
                padding={1}
                palette={COLORS}
                count={4}
                bg="#ffb418"
              />
            }
          >
            <Typography variant="caption" className={classes.account}>
              {getEllipsis(account.address)}
            </Typography>
          </Button>
        </Link>
        <IconButton aria-label="disconnect" onClick={() => library.disconnect()}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      </div>
    ) : (
      <ContainedButton onClick={() => switchNetwork(supported[0])}>Wrong Network</ContainedButton>
    )
  ) : (
    <ContainedButton onClick={connectWallet}>Connect</ContainedButton>
  )
}

export default memo(ConnectWallet)
