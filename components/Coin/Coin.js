const coinMap = {
  43114: 'avax',
  43113: 'avax',
  56: 'bnb',
  97: 'bnb',
}

export function getCoin(network) {
  return `/coins/${coinMap[network] || 'eth'}.png`
}

export default function Coin(props) {
  const { network } = props
  return <img src={getCoin(network)} />
}
