import { useRouter } from 'next/router'
import Loading from 'components/Loading/Loading'
import GiftBox from './products/GiftBox'
import MysteryBox from './products/MysteryBox'
import { useEffect, useState } from 'react'
import { getGraph } from 'library/utils'
import { getUtility } from 'library/queries'

export default function AssetContainer({ state, library }) {
  const router = useRouter()
  const { id } = router.query
  const [address] = id.split('-')
  const [contract, setContract] = useState('')

  function renderBox() {
    switch (contract[0]) {
      case 'UTBGiftBox':
        return <GiftBox state={state} library={library} token={contract[1]} />
      case 'UTBMysteryBox':
        return <MysteryBox state={state} library={library} token={contract[1]} />
      default:
        return <Loading />
    }
  }

  useEffect(() => {
    getGraph(state.account.network, getUtility(address.toLowerCase()))
      .then(({ utility: { token } }) => {
        library
          .getContractABI(token)
          .then((symbol) => setContract([symbol, token]))
          .catch(console.log)
      })
      .catch(console.log)
  }, [address, setContract])

  return renderBox(address)
}
