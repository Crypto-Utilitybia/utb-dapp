import { Query } from 'react-apollo'
import { TOKENS_QUERY } from 'lib/queries'

export default function Home() {
  return (
    <div className="container">
      <p className="description">
        Get started by editing <code>pages/index.js</code>
      </p>
      <Query
        query={TOKENS_QUERY}
        variables={{
          where: {
            // ...(withImage ? { imageUrl_starts_with: 'http' } : {}),
            // ...(withName ? { displayName_not: '' } : {}),
          },
          orderBy: 'blockTime',
        }}
      >
        {({ data, error, loading }) => {
          return loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Something went wrong. Try again later.</div>
          ) : (
            <div>Loaded</div>
          )
        }}
      </Query>
    </div>
  )
}
