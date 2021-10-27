import { memo, useCallback, useContext, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useCommonStyles } from 'styles/use-styles'

import { WalletContext } from 'contexts/WalletProvider'
import PageTitle from 'parts/PageTitle'
import ActivitiesTable from 'parts/ActivitiesTable'
import { getGraph } from 'library/utils'
import Loading from 'components/Loading'
import { ACTIVITY_TYPES } from 'utils/constants/filters'
import SelectBox from 'components/UI/SelectBox'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
  },
  filter: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  select: {
    marginLeft: theme.spacing(2),
    width: 140,
  },
}))

const Activities = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const { library, metadata } = useContext(WalletContext)
  const [[activities, isEnd], setData] = useState([[], false])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  const fetchData = useCallback(
    (skip, first) => {
      if (library && metadata) {
        setLoading(true)
        getGraph(
          library.currentNetwork,
          `query {
            activities(
              first: ${first}, skip: ${skip} orderBy: timestamp, orderDirection: desc
              ${filter === 'All' ? '' : `where: {reason: "${filter}"}`}
            ) {
              id
              tokenContract
              tokenId
              from
              to
              price
              reason
              txHash
              timestamp
            }
          }`
        )
          .then(({ activities }) => {
            setData([
              activities.map(({ price, ...item }) => ({
                ...item,
                price: library.web3.utils.fromWei(price),
                tier: metadata.collections[item.tokenId].Tier,
              })),
              activities.length < first,
            ])
          })
          .catch(console.log)
          .finally(() => setLoading(false))
      }
    },
    [filter, library, metadata, setData]
  )

  return (
    <main className={classes.root}>
      <div className={commonClasses.containerWidth}>
        <PageTitle title="Activities">
          <div className={classes.filter}>
            <SelectBox
              placholder="Filter by"
              items={ACTIVITY_TYPES}
              defaultValue={filter}
              className={classes.select}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </PageTitle>
        {metadata && <ActivitiesTable data={activities} isEnd={isEnd} onLoad={fetchData} />}
        {loading && <Loading loading />}
      </div>
    </main>
  )
}

export default memo(Activities)