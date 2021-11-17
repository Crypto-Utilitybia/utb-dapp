export const getUtilities = ({ first = 10, skip = 0 } = {}) => `query {
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
    discount
    createdAt
    updatedAt
  }
}`

export const getAssets = ({ first = 10, skip = 0, filter } = {}) => `query {
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
    discount
    createdAt
    updatedAt
  }
}`
