
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  divider: {
    height: 3,
    width: '100%',
    backgroundColor: theme.custom.palette.border
  },
}));

const RowDivider = ({
  className
}) => {
  const classes = useStyles()

  return (
    <Divider className={clsx(classes.divider, className)} />
  )
}

export default memo(RowDivider)