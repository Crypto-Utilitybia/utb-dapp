
import { memo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  cell: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    border: 'unset',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.primary
  },
}));

const TableContainer = ({
  isEmpty = false,
  columns,
  className,
  children
}) => {
  const classes = useStyles();

  return (
    <Table aria-label='table' className={className}>
      <TableHead>
        <TableRow>
          {columns.map(column => (
            <TableCell
              key={column.id}
              align={column.align}
              style={{ minWidth: column.minWidth }}
              className={classes.cell}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {isEmpty ? (
          <TableRow>
            <TableCell colSpan={columns.length} align='center'>
              <Typography variant='h5' color='primary'>
                No Data
              </Typography>
            </TableCell>
          </TableRow>
        ) : children}
      </TableBody>
    </Table>

  )
}

export default memo(TableContainer)