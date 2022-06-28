import {
  createSlice, createEntityAdapter, PayloadAction, nanoid,
} from '@reduxjs/toolkit';

import { RootState } from '../store';
import { ITodo } from '../../models/ITodo';
import { TodoListId } from '../../models/ITodoList';
import { IAddTodoDto } from '../../models/IAddTodoDto';
import TodoMocks from '../../service/mocks/TodoMocks';

const todoAdapter = createEntityAdapter<ITodo>({
  selectId: (todo) => todo.todoId,
  sortComparer: (a, b) => a.addedAt.localeCompare(b.addedAt),
});

const emptyInitialState = todoAdapter.getInitialState();
const initialState = todoAdapter.setAll(emptyInitialState, TodoMocks.todos);

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: {
      reducer: todoAdapter.addOne,
      prepare(todoDto: IAddTodoDto): PayloadAction<ITodo> {
        return {
          payload: {
            ...todoDto,
            todoId: nanoid(),
            addedAt: (new Date()).toISOString(),
          },
          type: 'todo/todoAdded',
        };
      },
    },
    removeTodo: todoAdapter.removeOne,
    removeManyTodo: todoAdapter.removeMany,
    updateTodo: todoAdapter.updateOne,
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
  selectIds: selectAllTodoIds,
  selectById: selectTodoById,
} = todoAdapter.getSelectors<RootState>((state) => state.todo.todos);

export const selectTodosByListId = (state: RootState, listId: TodoListId) =>
  selectAllTodos(state)
    .filter((todo) => todo.listId === listId);

export const selectTodoIdsByListId = (state: RootState, listId: TodoListId) =>
  selectTodosByListId(state, listId)
    .map((todo) => todo.todoId);
