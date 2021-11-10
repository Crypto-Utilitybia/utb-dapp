import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import {
  CYLINDER_WRAPPED_PRODUCT_IMAGE_PATH,
  CYLINDER_OPEN_PRODUCT_IMAGE_PATH,
  CYLINDER_CONFETTI_PRODUCT_IMAGE_PATH,
  SQUARE_WRAPPED_PRODUCT_IMAGE_PATH,
  SQUARE_OPEN_PRODUCT_IMAGE_PATH,
  SQUARE_CONFETTI_PRODUCT_IMAGE_PATH,
  HEXAGON_WRAPPED_PRODUCT_IMAGE_PATH,
  HEXAGON_OPEN_PRODUCT_IMAGE_PATH,
  HEXAGON_CONFETTI_PRODUCT_IMAGE_PATH,
} from 'utils/constants/image-paths'

const ContractContext = createContext(null)

const gifts = [
  {
    name: 'Raider',
    image: CYLINDER_WRAPPED_PRODUCT_IMAGE_PATH,
    price: 0.5,
    items: [
      {
        name: 'Emtpy',
        image: CYLINDER_OPEN_PRODUCT_IMAGE_PATH,
        description: [
          'Gift Box with this state, user can put any meme assets and NFTs inside.',
          'Once user wrap the Gift then state will be updated to “Wrapped”'
        ]
      },
      {
        name: 'Wrapped',
        image: CYLINDER_WRAPPED_PRODUCT_IMAGE_PATH,
        description: [
          'Gift Box with this state, user can gift this box to others.',
          'And “Gifty” can openand grab the assets inside.'
        ]
      },
      {
        name: 'Surprise',
        image: CYLINDER_CONFETTI_PRODUCT_IMAGE_PATH,
        description: [
          'Gift Box with this state, use can grab assets.',
          'Once user grab assets, state turns into “Empty” and it can be used for another gift.'
        ]
      }
    ]
  },
  {
    name: 'Popular',
    image: SQUARE_WRAPPED_PRODUCT_IMAGE_PATH,
    price: 0.5,
    items: [
      {
        name: 'Emtpy',
        image: SQUARE_OPEN_PRODUCT_IMAGE_PATH,
        description: [
          'Gift Box with this state, user can put any meme assets and NFTs inside.',
          'Once user wrap the Gift then state will be updated to “Wrapped”'
        ]
      },
      {
        name: 'Wrapped',
        image: SQUARE_WRAPPED_PRODUCT_IMAGE_PATH,
        description: [
          'Gift Box with this state, user can gift this box to others.',
          'And “Gifty” can openand grab the assets inside.'
        ]
      },
      {
        name: 'Surprise',
        image: SQUARE_CONFETTI_PRODUCT_IMAGE_PATH,
        description: [
          'Gift Box with this state, use can grab assets.',
          'Once user grab assets, state turns into “Empty” and it can be used for another gift.'
        ]
      }
    ]
  },
  {
    name: 'Song',
    image: HEXAGON_WRAPPED_PRODUCT_IMAGE_PATH,
    price: 0.5,
    items: [
      {
        name: 'Emtpy',
        image: HEXAGON_OPEN_PRODUCT_IMAGE_PATH,
        description: [
          'Gift Box with this state, user can put any meme assets and NFTs inside.',
          'Once user wrap the Gift then state will be updated to “Wrapped”'
        ]
      },
      {
        name: 'Wrapped',
        image: HEXAGON_WRAPPED_PRODUCT_IMAGE_PATH,
        description: [
          'Gift Box with this state, user can gift this box to others.',
          'And “Gifty” can openand grab the assets inside.'
        ]
      },
      {
        name: 'Surprise',
        image: HEXAGON_CONFETTI_PRODUCT_IMAGE_PATH,
        description: [
          'Gift Box with this state, use can grab assets.',
          'Once user grab assets, state turns into “Empty” and it can be used for another gift.'
        ]
      }
    ]
  }
]

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
        gifts,
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
