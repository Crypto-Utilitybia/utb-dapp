export const initState = {}

export default function reducer(state, action) {
  switch (action.type) {
    case 'ACCOUNT':
      return {
        ...state,
        account: action.payload,
      }
    case 'TOKENS':
      return {
        ...state,
        tokens: action.payload,
      }
    default:
      return state
  }
}
