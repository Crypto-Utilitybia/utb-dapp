
import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import CircleOutlinedIcon from '@material-ui/icons/RadioButtonUnchecked'
import CircleIcon from '@material-ui/icons/RadioButtonChecked'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  checkbox: {
    padding: 0,
    marginRight: theme.spacing(0.75),
  }
}));

const UtilityCheckbox = React.forwardRef(({
  checked,
  onChange = () => { },
  label,
  color = 'primary',
  className,
  ...rest
}, ref) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      color={color}
      label={label}
      control={
        <Checkbox
          {...rest}
          className={clsx(classes.checkbox, className)}
          inputProps={{
            'aria-label': 'Checkbox demo',
          }}
          inputRef={ref}
          icon={<CircleOutlinedIcon />}
          checkedIcon={<CircleIcon />}
          checked={checked}
          onChange={onChange}
        />
      }
    />
  );
});

export default memo(UtilityCheckbox);
