import { useRouter } from 'next/router'
import Loading from 'components/Loading/Loading'
import GiftBox from './products/GiftBox'
import MysteryBox from './products/MysteryBox'
import { useEffect, useState } from 'react'

export default function AssetContainer({ state, library, dispatch }) {
  const router = useRouter()
  const { id } = router.query
  const [address] = id.split('-')
  const [contract, setContract] = useState('')

  function renderBox() {
    switch (contract) {
      case 'UTBGiftBox':
        return <GiftBox state={state} library={library} dispatch={dispatch} />
      case 'UTBMysteryBox':
        return <MysteryBox state={state} library={library} dispatch={dispatch} />
      default:
        return <Loading />
    }
  }

  useEffect(() => {
    library
      .getContractABI(address)
      .then((symbol) => setContract(symbol))
      .catch(console.log)
  }, [address, library, setContract])

  return renderBox(address)
}
