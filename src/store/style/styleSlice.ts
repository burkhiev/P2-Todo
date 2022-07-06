import { combineReducers } from '@reduxjs/toolkit';

import curtainReducer from './curtainSlice';

export default combineReducers({
  curtain: curtainReducer,
});
