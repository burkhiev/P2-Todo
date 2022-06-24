import { combineReducers } from '@reduxjs/toolkit';

import todoReducer from './todoSlice';
import listReducer from './listSlice';
import tableReducer from './tableSlice';

export default combineReducers({
  'todos': todoReducer,
  'lists': listReducer,
  'table': tableReducer
});