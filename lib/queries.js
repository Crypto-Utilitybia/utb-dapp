import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'

if (!process.env.NEXT_PUBLIC_UTB_SUBGRAPH) {
  throw new Error('NEXT_PUBLIC_UTB_SUBGRAPH environment variable not defined')
}

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_UTB_SUBGRAPH,
  cache: new InMemoryCache(),
})

export const TOKENS_QUERY = gql`
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
