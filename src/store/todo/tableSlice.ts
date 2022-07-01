import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { ITodoTable } from '../../models/ITodoTable';

import { RootState } from '../store';
import TodoMocks from '../../service/mocks/TodoMocks';

const tableAdapter = createEntityAdapter<ITodoTable>({
  selectId: (todo) => todo.tableId,
  sortComparer: (a, b) => a.tableId.localeCompare(b.tableId),
});

const emptyInitialState = tableAdapter.getInitialState();
const initialState = tableAdapter.setAll(emptyInitialState, TodoMocks.tables);

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    createTable: tableAdapter.addOne,
    updateTable: tableAdapter.updateOne,
    deleteTable: tableAdapter.removeOne,
  },
});

export default tableSlice.reducer;

export const {
  createTable,
  updateTable,
  deleteTable,
} = tableSlice.actions;

export const {
  selectAll: selectAllTables,
  selectIds: selectAllTableIds,
  selectById: selectTableById,
} = tableAdapter.getSelectors<RootState>((state) => state.todo.table);
