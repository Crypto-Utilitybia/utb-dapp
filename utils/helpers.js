export const isServer = () => typeof window === 'undefined'

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  )
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export const roundDown = (value, decimals = 18) => {
  const valueString = value.toString()
  const integerString = valueString.split('.')[0]
  const decimalsString = valueString.split('.')[1]
  if (!decimalsString) {
    return integerString
  }
  return `${integerString}.${decimalsString.slice(0, decimals)}`
}

export const scrollToTop = () => {
  window.scroll({
    left: 0,
    top: 0,
    behavior: 'smooth',
  })
}

export const getEllipsis = str => {
  return `${str.slice(0, 6)}...${str.slice(-4)}`;
};