
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Select, MenuItem } from '@material-ui/core'

import TextField from 'components/UI/TextFields/TextField'

const useStyles = makeStyles((theme) => ({
  menuPaper: {},
  icon: {
    borderRadius: 6,
    marginRight: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  placeholder: {
    color: theme.custom.palette.lightBlack,
  },
}))

const SelectBox = ({
  items,
  placeholder,
  label,
  ...rest
}) => {
  const classes = useStyles()

  return (
    <Select
      input={<TextField label={label} />}
      displayEmpty
      classes={{
        icon: classes.icon,
        root: classes.select,
      }}
      MenuProps={{
        classes: {
          paper: classes.menuPaper,
        },
      }}
      placeholder={placeholder}
      {...rest}
    >
      {placeholder && (
        <MenuItem key='placeholder' value={{}} className={classes.placeholder}>
          {placeholder}
        </MenuItem>
      )}
      {items.map((item, index) => (
        <MenuItem key={index} value={typeof item === 'string' ? item : item.value}>
          {typeof item === 'string' ? item : item.label}
        </MenuItem>
      ))}
    </Select>
  )
}

export default memo(SelectBox)