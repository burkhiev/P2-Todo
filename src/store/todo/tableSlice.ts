import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { ITodoTable } from '../../models/ITodoTable';

import { RootState } from '../store';
import mockTodoTable from './mocks/mockTodoTable';

const todoAdapter = createEntityAdapter<ITodoTable>({
  selectId: todo => todo.tableId,
  sortComparer: (a, b) => a.tableId.localeCompare(b.tableId)
});

const emptyInitialState = todoAdapter.getInitialState();
const initialState = todoAdapter.setAll(emptyInitialState, [mockTodoTable]);

const todoSlice = createSlice({
  name: 'table',
  initialState,
  reducers: { }
});

export default todoSlice.reducer;

export const {
  selectAll: selectAllTables,
  selectById: selectTableById
} = todoAdapter.getSelectors<RootState>(state => state.todo.table);
