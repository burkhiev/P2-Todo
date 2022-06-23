import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { ITodoColumn } from '../../models/ITodoColumn';
import { TodoTableId } from '../../models/ITodoTable';
import columns from './mocks/mockTodoColumns';

const columnAdapter = createEntityAdapter<ITodoColumn>({
  selectId: column => column.columnId
});

const emptyInitialState = columnAdapter.getInitialState();
const initialState = columnAdapter.setAll(emptyInitialState, columns);

const columnSlice = createSlice({
  name: 'column',
  initialState,
  reducers: {}
});

export default columnSlice.reducer;

export const {
  selectAll: selectAllTodoColumns,
  selectById: selectTodoColumnById
} = columnAdapter.getSelectors<RootState>(state => state.todo.columns);

export const selectTodoColumnIdsByTable =
  (state: RootState, tableId: TodoTableId) =>
    selectAllTodoColumns(state)
      .filter(column => column.tableId === tableId)
      .map(column => column.columnId);