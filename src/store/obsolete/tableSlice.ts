import {
  createSlice,
  createEntityAdapter,
  nanoid,
} from '@reduxjs/toolkit';

import { ITodoTable } from '../../models/ITodoTable';

const tableAdapter = createEntityAdapter<ITodoTable>({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

const initialState = tableAdapter.getInitialState();

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    createTable: {
      reducer: tableAdapter.addOne,
      prepare(name: string) {
        const newTable: ITodoTable = {
          name,
          id: nanoid(),
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

// export const {
//   selectAll: selectAllTables,
//   selectById: selectTableById,
// } = tableAdapter.getSelectors<RootState>((state) => state.todo.table);

// export const selectAllTableIds = (state: RootState) =>
//   selectAllTables(state)
//     .map((table) => table.id);
