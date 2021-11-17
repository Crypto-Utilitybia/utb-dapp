import React, { useReducer } from 'react'
import useWallet from 'utils/hooks/useWallet'
import reducer, { initState } from './store'

import Welcome from 'components/Welcome/Welcome'
import Header from 'containers/Header/Header'
import Footer from 'containers/Footer/Footer'

export default function Layout({ children }) {
  const [state, dispatch] = useReducer(reducer, initState)
  const [loading, connectWallet, library] = useWallet(dispatch)

  return (
    <main>
      {state.account ? (
        <>
          <Header account={state.account} onLogout={() => connectWallet(true)} />
          {React.cloneElement(children, {
            state,
            library,
            dispatch,
          })}
          <Footer />
        </>
      ) : loading ? (
        <div className="loading" />
      ) : (
        <Welcome onConnect={() => connectWallet()} />
      )}
    </main>
  )
}
