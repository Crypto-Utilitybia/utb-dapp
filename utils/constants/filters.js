export const SORTS = [
  {
    value: 1,
    label: 'Recently Listed',
  },
  {
    value: 3,
    label: 'Price High to Low',
  },
  {
    value: 4,
    label: 'Price Low to High',
  },
  {
    value: 2,
    label: 'Oldest',
  },
]

export const ALL_TIERS = new Array(7).fill(0).map((_, index) => index + 1)

export const TIERS = ALL_TIERS.map((tier) => ({
  value: tier,
  label: `Tier ${tier}`,
}))

export const FILTERS = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'owned',
    label: 'Owned',
  },
  ...TIERS,
]

export const SORT_COINS = [
  {
    value: 'tokenId',
    label: 'By Token ID',
  },
  {
    value: 'tier',
    label: 'By Tier',
  },
]

export const ACTIVITY_TYPES = ['All', 'Trade', 'Claim', 'List', 'Update', 'Cancel']
