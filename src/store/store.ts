import { configureStore, Store } from '@reduxjs/toolkit';

import todoReducer from './todo/combinedReducer';

const store = configureStore({
  reducer: {
    ['todo']: todoReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
