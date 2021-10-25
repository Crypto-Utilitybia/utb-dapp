import { useState, useEffect } from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Box, TableCell, TableRow } from '@material-ui/core'

import TableContainer from 'parts/Table/TableContainer'
import TablePagination from 'parts/Table/TablePagination'
import { getEllipsis } from 'utils/helpers'
import { defaultNetwork, links } from 'library/constants'
import TokenIcon from 'components/TokenIcon'

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    overflowX: 'overlay',
  },
  tokenId: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coin: {
    marginLeft: theme.spacing(1),
  },
}))

const columns = [
  { id: 'tokenId', label: 'Token ID', minWidth: 120 },
  { id: 'tier', label: 'Tier', minWidth: 120, align: 'center' },
  { id: 'value', label: 'Value', minWidth: 120, align: 'center' },
  { id: 'sender', label: 'Sender', minWidth: 140, align: 'center' },
  { id: 'recipient', label: 'Recipient', minWidth: 140, align: 'center' },
  { id: 'reason', label: 'Action', minWidth: 140, align: 'center' },
  { id: 'timestamp', label: 'Timestamp', minWidth: 140, align: 'center' },
]

const ROWS_PER_PAGE = 12

export default function ActivitiesTable({ data, isEnd, onLoad }) {
  const classes = useStyles()

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)

  useEffect(() => {
    onLoad(page * ROWS_PER_PAGE, ROWS_PER_PAGE)
  }, [page, onLoad])

  useEffect(() => {
    const newTotal = page * ROWS_PER_PAGE + 1
    if (isEnd) {
      if (newTotal != total) {
        setTotal((data.length > 0 ? page : page - 1) * ROWS_PER_PAGE + 1)
      }
    } else {
      setTotal(newTotal + ROWS_PER_PAGE)
    }
  }, [data, page, isEnd, total, setTotal])

  return (
    <Card>
      <Box className={classes.tableContainer}>
        <TableContainer columns={columns} isEmpty={data.length === 0}>
          {data.map((activity) => {
            return (
              <TableRow key={activity.id}>
                <Link href={`/coin/${activity.tokenId}`}>
                  <TableCell className={classes.tokenId} component="th" scope="row">
                    {activity.tokenId}
                  </TableCell>
                </Link>
                <TableCell align="center">{activity.tier}</TableCell>
                <TableCell align="center">
                  <div className={classes.cell}>
                    {Number(activity.price).toFixed(2)}
                    <TokenIcon size={18} token="AVAX" className={classes.coin} />
                  </div>
                </TableCell>
                <TableCell align="center">
                  {/* <a href={`${links[defaultNetwork].address}/${activity.from}`} target="_blank" rel="noreferrer">
                    {getEllipsis(activity.from)}
                  </a> */}
                  <Link href={`/account/${activity.from}`}>{getEllipsis(activity.from)}</Link>
                </TableCell>
                <TableCell align="center">
                  {/* <a href={`${links[defaultNetwork].address}/${activity.to}`} target="_blank" rel="noreferrer">
                    {getEllipsis(activity.to)}
                  </a> */}
                  <Link href={`/account/${activity.to}`}>{getEllipsis(activity.to)}</Link>
                </TableCell>
                <TableCell align="center">{activity.reason}</TableCell>
                <TableCell align="center">
                  <a href={`${links[defaultNetwork].tx}/${activity.txHash}`} target="_blank" rel="noreferrer">
                    {new Date(activity.timestamp * 1000).toDateString()}
                  </a>
                </TableCell>
              </TableRow>
            )
          })}
        </TableContainer>
        <TablePagination page={page} setPage={setPage} total={total} rowsPerPage={ROWS_PER_PAGE} />
      </Box>
    </Card>
  )
}
