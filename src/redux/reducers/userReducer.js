const INITIAL = { account: '', position: 'GUEST' };

export default function userReducer(state = INITIAL, action) {
  switch (action.type) {
    case 'SET_ACCOUNT':
      return { ...state, account: action.payload };     // fixed spread
    case 'RESET_ACCOUNT':
      return INITIAL;
    case 'SET_POSITION':
      return { ...state, position: action.payload };    // fixed spread
    default:
      return state;
  }
}
