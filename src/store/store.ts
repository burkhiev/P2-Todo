import { configureStore } from '@reduxjs/toolkit';

import todoReducer from './todo/combinedReducers';
import styleReducer from './style/styleSlice';
import apiSlice from './api/apiSlice';

const store = configureStore({
  reducer: {
    todo: todoReducer,
    style: styleReducer,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
