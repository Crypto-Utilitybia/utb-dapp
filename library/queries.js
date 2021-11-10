import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
import { constants } from 'react-bcravatar'

export const client = (network) =>
  new ApolloClient({
    uri: constants.subgraphs[network],
    cache: new InMemoryCache(),
  })

export const CONTRACTS_QUERY = gql`
  query contracts($orderBy: Contract_orderBy!) {
    contracts(first: 1, orderBy: $orderBy, orderDirection: asc) {
      id
      avatars
      profiles
    }
  }
`
