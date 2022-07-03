import {
  createSlice, createEntityAdapter, nanoid,
} from '@reduxjs/toolkit';
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
    createTable: {
      reducer: tableAdapter.addOne,
      prepare(name: string) {
        const newTable: ITodoTable = {
          name,
          tableId: nanoid(),
        };
        return { payload: newTable };
      },
    },
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
  selectById: selectTableById,
} = tableAdapter.getSelectors<RootState>((state) => state.todo.table);

export const selectAllTableIds = (state: RootState) =>
  selectAllTables(state)
    .map((table) => table.tableId);
