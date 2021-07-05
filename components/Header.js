import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'

if (!process.env.NEXT_PUBLIC_UTB_SUBGRAPH) {
  throw new Error('NEXT_PUBLIC_UTB_SUBGRAPH environment variable not defined')
}

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_UTB_SUBGRAPH,
  cache: new InMemoryCache(),
})

const TOKENS_QUERY = gql`
  query tokens($where: Token_filter!, $orderBy: Token_orderBy!) {
    tokens(first: 100, where: $where, orderBy: $orderBy, orderDirection: asc) {
      id
      utility
      asset
      token
      blockNumber
      blockTime
    }
  }
`

export default function Header({ title }) {
  return (
    <>
      <h1 className="title">{title}</h1>
      <ApolloProvider client={client}>
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
            console.log(data)
            return loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Something went wrong. Try again later.</div>
            ) : (
              <div>Loaded</div>
            )
          }}
        </Query>
      </ApolloProvider>
    </>
  )
}
