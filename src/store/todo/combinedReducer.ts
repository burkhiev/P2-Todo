import { combineReducers } from '@reduxjs/toolkit';

import todoReducer from './todoSlice';
import columnReducer from './columnSlice';
import tableReducer from './tableSlice';

export default combineReducers({
  'todos': todoReducer,
  'columns': columnReducer,
  'table': tableReducer
});