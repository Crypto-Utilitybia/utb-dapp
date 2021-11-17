import React, { useReducer } from 'react'
import useWallet from 'utils/hooks/useWallet'
import reducer, { initState } from './store'

export default function Layout({ children }) {
  const [state, dispatch] = useReducer(reducer, initState)
  const [connectWallet, library] = useWallet(dispatch)
  console.log(connectWallet, library)

  return (
    <main>
      {React.cloneElement(children, {
        state,
        dispatch,
      })}
    </main>
  )
}
