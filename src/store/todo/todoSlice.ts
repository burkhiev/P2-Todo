import {
  createSlice, createEntityAdapter, PayloadAction, nanoid,
} from '@reduxjs/toolkit';

import { RootState } from '../store';
import { ITodo, TodoId } from '../../models/ITodo';
import { TodoListId } from '../../models/ITodoList';
import todos from './mocks/mockTodos';

const todoAdapter = createEntityAdapter<ITodo>({
  selectId: (todo) => todo.todoId,
  sortComparer: (a, b) => a.addedAt.localeCompare(b.addedAt),
});

const emptyInitialState = todoAdapter.getInitialState();
const initialState = todoAdapter.setAll(emptyInitialState, todos);

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: {
      reducer: todoAdapter.addOne,
      prepare(listId: TodoListId, title: string, description?: string)
        : PayloadAction<ITodo> {
        return {
          payload: {
            todoId: nanoid(),
            listId,
            title,
            description,
            addedAt: (new Date()).toISOString(),
          },
          type: 'todo/todoAdded',
        };
      },
    },
    removeTodo: todoAdapter.removeOne,
    removeManyTodo: todoAdapter.removeMany,
    updateTodo: {
      reducer: (
        state,
        action: PayloadAction<{ todoId: TodoId, title: string, description: string }>,
      ) => {
        const { todoId, title, description } = action.payload;

        const updateObj = {
          changes: {
            title,
            description,
          },
          id: todoId,
        };

        todoAdapter.updateOne(state, updateObj);
      },
      prepare(todoId: TodoId, title: string, description: string) {
        return {
          payload: {
            todoId,
            title,
            description,
          },
          type: 'todo/todoUpdated',
        };
      },
    },
  },
});

export default todoSlice.reducer;

export const {
  addTodo,
  removeTodo,
  removeManyTodo,
  updateTodo,
} = todoSlice.actions;

export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
} = todoAdapter.getSelectors<RootState>((state) => state.todo.todos);

export const selectTodoIdsByListId = (state: RootState, listId: TodoListId) =>
  selectAllTodos(state)
    .filter((todo) => todo.listId === listId)
    .map((todo) => todo.todoId);
