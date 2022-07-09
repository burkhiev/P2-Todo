import { combineReducers } from '@reduxjs/toolkit';

import todoReducer from './todoSlice';
import listReducer from './listSlice';

export default combineReducers({
  todos: todoReducer,
  lists: listReducer,
});
