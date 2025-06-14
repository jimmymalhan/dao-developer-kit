// src/redux/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userReducer';
import settingReducer from './slices/settingReducer';

/**
 * Combines all slice reducers into one root reducer.
 * Exported as default so it can be easily imported in store.js.
 */
const rootReducer = combineReducers({
  userReducer,
  settingReducer,
});

export default rootReducer;      // ← the bit that was missing
