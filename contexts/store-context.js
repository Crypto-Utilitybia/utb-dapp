import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ContractContext = createContext(null)

export function StoreProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const getStore = useCallback(async () => {
    try {
      setLoading(false)
    } catch (error) {
      console.log('[Error] getStore => ', error)
    }
  }, [setLoading])

  useEffect(() => {
    getStore()
  }, [getStore])

  return (
    <ContractContext.Provider
      value={{
        loading,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useStore() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  return context
}
