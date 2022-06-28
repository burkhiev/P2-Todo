import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TodoId } from '../../models/ITodo';
import { TodoListId } from '../../models/ITodoList';
import { RootState } from '../store';
import TodoMocks from '../../service/mocks/TodoMocks';

export interface ITodoOrderItem {
  listId: TodoListId,
  todoIds: TodoId[]
}

interface IAddRemoveTodoFromOrderPayload {
  todoId: TodoId,
  listId: TodoListId,
  index?: number
}

const orderAdapter = createEntityAdapter<ITodoOrderItem>({
  selectId: (orderItem) => orderItem.listId,
});

const emptyInitialState = orderAdapter.getInitialState();
const initialState = orderAdapter.setAll(emptyInitialState, TodoMocks.todosOrder);

const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    addTodoInListOrder(state, action: PayloadAction<IAddRemoveTodoFromOrderPayload>) {
      const { listId, todoId, index } = action.payload;

      // удаляем todoId из пре
      const orderItems = Object.values(state.entities);
      const oldListOrder = orderItems.find((item) => item?.todoIds.some((tId) => tId === todoId));

      if (oldListOrder) {
        const oldIndex = oldListOrder.todoIds.indexOf(todoId);
        oldListOrder.todoIds.splice(oldIndex, 1);
      }

      let newListOrder = state.entities[listId];

      if (!newListOrder) {
        newListOrder = {
          listId,
          todoIds: [],
        };

        state.entities[listId] = newListOrder;
      }

      newListOrder.todoIds.splice(index ?? newListOrder.todoIds.length, 0, todoId);
    },

    removeTodoFromListOrder(state, action: PayloadAction<IAddRemoveTodoFromOrderPayload>) {
      const { listId, todoId } = action.payload;

      const orderItem = state.entities[listId];

      if (!orderItem) {
        return;
      }

      const index = orderItem.todoIds.indexOf(todoId);
      orderItem.todoIds.splice(index, 1);
    },

    removeListOrder: orderAdapter.removeOne,
  },
});

export default sortSlice.reducer;

export const {
  addTodoInListOrder,
  removeTodoFromListOrder,
  removeListOrder,
} = sortSlice.actions;

export const selectOrderedTodoIdsByListId = (state: RootState, listId: TodoListId) =>
  state.todo.todosOrder.entities[listId]?.todoIds ?? [];
