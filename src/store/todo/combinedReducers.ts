import { combineReducers } from '@reduxjs/toolkit';

import todoReducer from './todoSlice';

export default combineReducers({
  todos: todoReducer,
});
