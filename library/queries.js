export const getUtilities = ({ first = 32, skip = 0 } = {}) => `query {
  utilities(
    first: ${first}, skip: ${skip} orderBy: updatedAt, orderDirection: desc
  ) {
    id
    index
    address
    token
    owner
    states
    createdAt
    updatedAt
  }
}`

export const getUtility = (id) => `query {
  utility(id: "${id}") {
    id
    index
    address
    token
    owner
    states
    createdAt
    updatedAt
  }
}`

export const getAsset = (id) => `query {
  asset(id: "${id}") {
    id
    index
    name
    promo
    asset
    author
    price
    stock
    createdAt
    updatedAt
  }
}`

export const getAssets = ({ first = 32, skip = 0, filter } = {}) => `query {
  assets(
    first: ${first}, skip: ${skip} orderBy: updatedAt, orderDirection: desc
    ${filter ? `where: { ${filter} }` : ''}
  ) {
    id
    index
    name
    promo
    asset
    author
    price
    stock
    createdAt
    updatedAt
  }
}`

export const getToken = (id) => `query {
  token(id: "${id}") {
    id
    asset {
      id
      name
    }
    utility
    tokenURI
    owner
    lastActor
    createdAt
    updatedAt
  }
}`

export const getTokens = (owner, { first = 100, skip = 0 } = {}) => `query {
  tokens(
    first: ${first}, skip: ${skip} orderBy: updatedAt, orderDirection: desc
    where: { owner: "${owner.toLowerCase()}" }
  ) {
    id
    asset {
      id
      name
    }
    utility
    tokenURI
    owner
    state
    createdAt
    updatedAt
  }
}`
