import React, { useReducer } from 'react'
import useWallet from 'utils/hooks/useWallet'
import reducer, { initState } from './store'

import Welcome from 'components/Welcome/Welcome'
import Header from 'containers/Header/Header'
import Footer from 'containers/Footer/Footer'
import { isSupported, networks, supported } from 'library/constants'

export default function Layout({ children }) {
  const [state, dispatch] = useReducer(reducer, initState)
  const [loading, connectWallet, library] = useWallet(dispatch)

  function switchNetwork() {
    library.web3.currentProvider
      .request({
        method: 'wallet_addEthereumChain',
        params: [networks[56]],
      })
      .then(() => connectWallet())
      .catch(console.log)
  }

  return (
    <main>
      {state.account && isSupported(state.account.network) ? (
        <>
          <Header account={state.account} onLogout={() => connectWallet(true)} />
          {React.cloneElement(children, {
            state,
            library,
            dispatch,
          })}
          <Footer />
        </>
      ) : !state.account && loading ? (
        <div className="loading" />
      ) : (
        <Welcome onConnect={() => connectWallet()} account={state?.account} onSwitch={switchNetwork} />
      )}
    </main>
  )
}
