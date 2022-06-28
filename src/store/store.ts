import { configureStore } from '@reduxjs/toolkit';

import todoReducer from './todo/combinedReducers';
import serviceReducer from './style/combinedReducers';

const store = configureStore({
  reducer: {
    todo: todoReducer,
    service: serviceReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
