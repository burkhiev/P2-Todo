import {
  createEntityAdapter, createSlice, nanoid, PayloadAction,
} from '@reduxjs/toolkit';

import {
  // MAX_POSITION_FRACTION_DIGITS_NUMBER,
  POSITION_STEP,
} from '../../service/Consts';

// import { RootState } from '../store';
import { ITodoList } from '../../models/ITodoList';
import { TodoTableId } from '../../models/ITodoTable';
// import MathService from '../../service/MathService';
// import { TodoListDropSide } from '../../components/body/table/Table';
// import { IMoveListPayload } from '../api/listSlice';

const listAdapter = createEntityAdapter<ITodoList>({
  selectId: (list) => list.id,
  sortComparer: (a, b) => a.position - b.position,
});

const initialState = listAdapter.getInitialState();

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    addList: {
      reducer(state, action: PayloadAction<ITodoList>) {
        const list = action.payload;
        const lists = Object.values(state.entities);

        const maxPosition = lists
          .map((cur) => cur?.position)
          .reduce((prev, cur) => Math.max(prev ?? 0, cur ?? 0), 0) ?? 0;

        list.position = maxPosition + POSITION_STEP;
        listAdapter.addOne(state, list);
      },
      prepare(tableId: TodoTableId, title: string): PayloadAction<ITodoList> {
        return {
          payload: {
            id: nanoid(),
            title,
            tableId,
            position: 0,
          },
          type: 'list/addList',
        };
      },
    },
    removeList: listAdapter.removeOne,
    removeManyLists: listAdapter.removeMany,
    updateList: listAdapter.updateOne,
  },
});

export default listSlice.reducer;

export const {
  addList,
  removeList,
  removeManyLists,
  updateList,
} = listSlice.actions;

// export const {
//   selectAll: selectAllTodoLists,
//   selectById: selectTodoListById,
// } = listAdapter.getSelectors<RootState>((state) => state.todo.lists);

// export const selectListsByTableId = (state: RootState, tableId: TodoTableId) =>
//   selectAllTodoLists(state)
//     .filter((list) => list.tableId === tableId);

// export const selectListIdsByTableId = (state: RootState, tableId: TodoTableId) =>
//   selectListsByTableId(state, tableId)
//     .map((list) => list.id);
