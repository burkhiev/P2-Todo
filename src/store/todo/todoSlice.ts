import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { ITodo } from '../../models/ITodo';
import { TodoColumnId } from '../../models/ITodoColumn';
import todos from './mocks/mockTodos';

const todoAdapter = createEntityAdapter<ITodo>({
  selectId: todo => todo.todoId,
  sortComparer: (a, b) => a.todoId.localeCompare(b.todoId)
});

const emptyInitialState = todoAdapter.getInitialState();
const initialState = todoAdapter.setAll(emptyInitialState, todos);

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: { }
});

export default todoSlice.reducer;

export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById
} = todoAdapter.getSelectors<RootState>(state => state.todo.todos);

export const selectTodoIdsByColumnId =
  (state: RootState, columnId: TodoColumnId) => {
    return selectAllTodos(state)
      .filter(todo => todo.columnId === columnId)
      .map(todo => todo.todoId)
  };
