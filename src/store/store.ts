import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';

import styleReducer from './style/combinedReducers';
import apiSlice from './api/apiSlice';

const rootReducer = combineReducers({
  style: styleReducer,
  api: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const setupStore = (preloadedState?: PreloadedState<RootState>) => configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  preloadedState,
});

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export default setupStore;
