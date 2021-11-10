import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Pagination } from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'center',
  },
}))

const TablePagination = ({
  page,
  setPage,
  total,
  rowsPerPage
}) => {
  const classes = useStyles()

  return (
    <Pagination
      variant='outlined'
      shape='rounded'
      color='secondary'
      size='large'
      page={page + 1}
      count={Math.ceil(total / rowsPerPage)}
      onChange={(event, page) => setPage(page - 1)}
      classes={{
        root: classes.root,
      }}
    />
  )
}

export default memo(TablePagination)
