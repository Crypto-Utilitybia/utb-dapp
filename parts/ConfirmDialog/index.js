
import { memo } from 'react'
import { Typography } from '@material-ui/core'

import Modal from 'components/Modal'

const ConfirmDialog = ({
  text = 'Are you sure to proceed this operation?',
  ...rest
}) => {
  return (
    <Modal {...rest}>
      <Typography color='textPrimary' variant='h5' align='center'>
        {text}
      </Typography>
    </Modal>
  );
}

export default memo(ConfirmDialog)