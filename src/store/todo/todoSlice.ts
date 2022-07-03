import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  nanoid,
  Update,
} from '@reduxjs/toolkit';

import {
  MAX_POSITION,
  MAX_POSITION_FRACTION_DIGITS_NUMBER,
  MIN_POSITION, POSITION_STEP,
} from '../../service/Consts';

import { RootState } from '../store';
import { ITodo, TodoId } from '../../models/ITodo';
import { TodoListId } from '../../models/ITodoList';
import { IAddTodoDto } from '../../models/IAddTodoDto';
import TodoMocks from '../../service/mocks/TodoMocks';
import MathService from '../../service/MathService';
import { TodoTableId } from '../../models/ITodoTable';

const INVALID_TODO_ID_ERR_MSG = 'Invalid argument error. Non-existent "todoId" received.';
const MUST_HAVE_INSERT_INDEX_ERR_MSG = 'Invalid operation error. '
  + 'If "listIds" is different, "insertIndex" must has a value.';
const INSERT_INDEX_OUT_OF_RANGE_ERR_MSG = 'Out of range error. "insertIndex" is out of range.';
const POS_IS_OUT_OF_RANGE_ERR_MSG = 'Out of range error. Position value is out of range.';

interface IUpdateTodoTextArgs {
  todoId: TodoId,
  title?: string,
  description?: string,
}

interface IMoveTodoArgs {
  todoId: TodoId,
  newListId?: TodoListId,
  insertIndex?: number
}

const todoAdapter = createEntityAdapter<ITodo>({
  selectId: (todo) => todo.todoId,
  sortComparer: (a, b) => a.position - b.position,
});

const emptyInitialState = todoAdapter.getInitialState();
const initialState = todoAdapter.setAll(emptyInitialState, TodoMocks.todos);

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<ITodo>) {
        const { listId: todoListId } = action.payload;

        const allTodos = Object.values(state.entities);
        const todos = allTodos.filter((todo) => todo?.listId === todoListId);

        const maxPos = todos
          .map((todo) => todo?.position ?? 0)
          .reduce((prev, cur) => Math.max(prev, cur), 0);

        todoAdapter.addOne(state, {
          ...action.payload,
          position: maxPos + POSITION_STEP,
        });
      },
      prepare(todoDto: IAddTodoDto): PayloadAction<ITodo> {
        return {
          payload: {
            ...todoDto,
            todoId: nanoid(),
            addedAt: (new Date()).toISOString(),
            position: 0,
          },
          type: 'todo/addTodo',
        };
      },
    },
    removeTodo: todoAdapter.removeOne,
    removeManyTodo: todoAdapter.removeMany,
    updateTodoText(state, action: PayloadAction<IUpdateTodoTextArgs>) {
      const { todoId, title, description } = action.payload;

      if (title) {
        todoAdapter.updateOne(state, {
          id: todoId,
          changes: { title },
        });
      }

      if (description) {
        todoAdapter.updateOne(state, {
          id: todoId,
          changes: { description },
        });
      }
    },
    moveTodo(state, action: PayloadAction<IMoveTodoArgs>) {
      const {
        todoId,
        newListId,
        insertIndex,
      } = action.payload;

      const todo = state.entities[todoId];

      if (!todo) {
        throw new Error(INVALID_TODO_ID_ERR_MSG);
      }

      const atSamePlace = todo.listId === newListId && insertIndex === undefined;

      if (atSamePlace) {
        return;
      }

      function moveCurrentTodo(id: TodoId, listId: TodoListId, position: number) {
        const update: Update<ITodo> = {
          id,
          changes: {
            listId,
            position,
          },
        };

        todoAdapter.updateOne(state, update);
      }

      const allTodos = Object.values(state.entities);
      const nextListId = newListId ?? todo.listId;

      const todos = allTodos
        .filter((t) => t?.listId === nextListId)
        .sort((a, b) => (a?.position ?? MIN_POSITION) - (b?.position ?? MIN_POSITION));

      if (insertIndex === undefined) {
        throw new Error(MUST_HAVE_INSERT_INDEX_ERR_MSG);
      }

      function indexIsValid(index: number) {
        return index >= 0 && index <= todos.length;
      }

      if (!indexIsValid(insertIndex)) {
        throw new Error(INSERT_INDEX_OUT_OF_RANGE_ERR_MSG);
      }

      function positionValid(pos: number) {
        const numCount = MathService.countOfFractionalPartNumbers(pos);

        return (MIN_POSITION <= pos && pos <= MAX_POSITION)
          && (numCount <= MAX_POSITION_FRACTION_DIGITS_NUMBER);
      }

      function setPositions(indexFrom: number, posFrom: number) {
        if (!todo) {
          throw new Error(INVALID_TODO_ID_ERR_MSG);
        }

        if (!positionValid(posFrom)) {
          throw new Error(POS_IS_OUT_OF_RANGE_ERR_MSG);
        }

        let index = indexFrom;

        index = index < MIN_POSITION ? MIN_POSITION : index;
        index = index > MAX_POSITION ? MAX_POSITION : index;

        let mult = 0;

        for (let i = index; i < todos.length; i += 1, mult += 1) {
          const curTodo = todos[i];

          if (curTodo) {
            const newPos = posFrom + POSITION_STEP * mult;
            moveCurrentTodo(curTodo.todoId, nextListId, newPos);
          }
        }
      }

      const prevPos = (insertIndex > 0) ? todos[insertIndex - 1]!.position : MIN_POSITION;

      if (todos.length === insertIndex) {
        const newPos = prevPos + POSITION_STEP;

        if (positionValid(newPos)) {
          moveCurrentTodo(todo.todoId, nextListId, newPos);
        } else {
          setPositions(0, MIN_POSITION);
        }
      } else {
        const curPos = todos[insertIndex]!.position;
        const newPos = prevPos + (curPos - prevPos) / 2;

        if (positionValid(newPos)) {
          moveCurrentTodo(todo.todoId, nextListId, newPos);
        } else {
          const insIndex = insertIndex - 1;
          setPositions((insIndex < 0) ? 0 : insIndex, MIN_POSITION);
        }
      }
    },
  },
});

export default todoSlice.reducer;

export const {
  addTodo,
  removeTodo,
  removeManyTodo,
  updateTodoText,
  moveTodo,
} = todoSlice.actions;

export const {
  selectAll: selectAllTodos,
  selectIds: selectAllTodoIds,
  selectById: selectTodoById,
} = todoAdapter.getSelectors<RootState>((state) => state.todo.todos);

export const selectTodosByListId = (state: RootState, listId: TodoListId) =>
  selectAllTodos(state)
    .filter((todo) => todo.listId === listId)
    .sort((a, b) => a.position - b.position);

export const selectTodoIdsByListId = (state: RootState, listId: TodoListId) =>
  selectTodosByListId(state, listId)
    .map((todo) => todo.todoId);

export const selectTodoIdsByTableId = (state: RootState, tableId: TodoTableId) => {
  const allLists = Object.values(state.todo.lists.entities);

  const lists = allLists.filter((list) => list?.tableId === tableId);
  const listsTodos = lists.map((list) => selectTodoIdsByListId(state, list!.listId));

  const todos: TodoId[] = [];
  listsTodos.forEach((lt) => lt.forEach((todoId) => todos.push(todoId)));

  return todos;
};
