// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

/**
 * Central Redux store.
 * – exported as *default* to match `import store from './redux/store'`
 * – serializableCheck disabled (you already had this)
 */
const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;