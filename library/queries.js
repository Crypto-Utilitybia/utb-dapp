export const getUtilities = ({ first = 32, skip = 0 } = {}) => `query {
  utilities(
    first: ${first}, skip: ${skip} orderBy: updatedAt, orderDirection: desc
  ) {
    id
    address
    owner
    createdAt
    updatedAt
  }
}`

export const getAsset = (id) => `query {
  asset(id: "${id}") {
    id
    utility
    index
    name
    promo
    asset
    author
    price
    limit
    mints
    discount
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
    utility
    index
    name
    promo
    asset
    author
    price
    limit
    mints
    discount
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
