import { createSlice, createEntityAdapter, PayloadAction, nanoid } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { ITodoList } from '../../models/ITodoList';
import { TodoTableId } from '../../models/ITodoTable';
import lists from './mocks/mockTodoLists';

const listAdapter = createEntityAdapter<ITodoList>({
  selectId: list => list.listId
});

const emptyInitialState = listAdapter.getInitialState();
const initialState = listAdapter.setAll(emptyInitialState, lists);

const listSlice = createSlice({
  name: 'column',
  initialState,
  reducers: {
    listAdded: {
      reducer: listAdapter.addOne,
      prepare(tableId: TodoTableId, title: string)
        : PayloadAction<ITodoList>
      {
        return {
          payload: {
            listId: nanoid(),
            title,
            tableId,
          },
          type: 'listAdded'
        }
      }
    },
    listRemoved: listAdapter.removeOne
  }
});

export default listSlice.reducer;

export const {
  listAdded,
  listRemoved
} = listSlice.actions;

export const {
  selectAll: selectAllTodoLists,
  selectById: selectTodoListById
} = listAdapter.getSelectors<RootState>(state => state.todo.lists);

export const selectTodoListIdsByTable =
  (state: RootState, tableId: TodoTableId) =>
    selectAllTodoLists(state)
      .filter(list => list.tableId === tableId)
      .map(list => list.listId);