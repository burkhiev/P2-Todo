import {
  createSlice, createEntityAdapter, PayloadAction, nanoid,
} from '@reduxjs/toolkit';

import { RootState } from '../store';
import { ITodoList } from '../../models/ITodoList';
import { TodoTableId } from '../../models/ITodoTable';
import TodoMocks from '../../service/mocks/TodoMocks';

const listAdapter = createEntityAdapter<ITodoList>({
  selectId: (list) => list.listId,
});

const emptyInitialState = listAdapter.getInitialState();
const initialState = listAdapter.setAll(emptyInitialState, TodoMocks.lists);

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    addList: {
      reducer: listAdapter.addOne,
      prepare(tableId: TodoTableId, title: string)
        : PayloadAction<ITodoList> {
        return {
          payload: {
            listId: nanoid(),
            title,
            tableId,
          },
          type: 'list/listAdded',
        };
      },
    },
    removeList: listAdapter.removeOne,
    updateList: listAdapter.updateOne,
  },
});

export default listSlice.reducer;

export const {
  addList,
  removeList,
  updateList,
} = listSlice.actions;

export const {
  selectAll: selectAllTodoLists,
  selectById: selectTodoListById,
} = listAdapter.getSelectors<RootState>((state) => state.todo.lists);

export const selectTodoListIdsByTable = (state: RootState, tableId: TodoTableId) =>
  selectAllTodoLists(state)
    .filter((list) => list.tableId === tableId)
    .map((list) => list.listId);
