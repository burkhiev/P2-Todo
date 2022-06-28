import { combineReducers } from '@reduxjs/toolkit';

import todoReducer from './todoSlice';
import listReducer from './listSlice';
import tableReducer from './tableSlice';
import todosOrderReducer from './todosOrderSlice';

export default combineReducers({
  todos: todoReducer,
  lists: listReducer,
  table: tableReducer,
  todosOrder: todosOrderReducer,
});
