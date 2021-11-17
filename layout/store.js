export const initState = {}

export default function reducer(state, action) {
  switch (action.type) {
    case 'ACCOUNT':
      return {
        ...state,
        account: action.payload,
      }
    default:
      return state
  }
}
