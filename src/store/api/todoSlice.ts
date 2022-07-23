import {
  createEntityAdapter,
  createSelector,
  EntityState,
  nanoid,
} from '@reduxjs/toolkit';

import { ITodo, TodoId } from '../../models/ITodo';
import { TodoListId } from '../../models/ITodoList';
import IMoveTodoResource from '../../models/json-api-models/IMoveTodoResource';
import ITodoResource from '../../models/json-api-models/ITodoResource';
import InvalidArgumentError from '../../service/errors/InvalidArgumentError';
import { RootState } from '../store';
import apiSlice, { ALL_TODOS_TAG_ID, TODO_TAG_TYPE } from './apiSlice';
import { selectListById } from './listSlice';
import { getNewTodoPosition } from './apiHelpers';
import InvalidDataError from '../../service/errors/InvalidDataError';
import { NEW_TODO_ID, POSITION_STEP } from '../../service/Consts';

export interface IMoveTodoPayload {
  todoId: TodoId,
  srcListId: TodoListId,
  srcIndex: number,
  destListId: TodoListId,
  destIndex: number
}

const todoAdapter = createEntityAdapter<ITodo>({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => a.position - b.position,
});

const initialEmptyState = todoAdapter.getInitialState();

const todoSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query<EntityState<ITodo>, undefined>({
      query: () => 'todo',

      transformResponse: (response: { data: ITodoResource[] }) => {
        const { data } = response;
        // console.info('[api/todo]-getTodos: response=', response);

        const todos: ITodo[] = [];
        data.forEach(({ id, attributes }) => {
          if (attributes) {
            todos.push({ id, ...attributes });
          }
        });

        return todoAdapter.setAll(initialEmptyState, todos);
      },

      providesTags: (result) => {
        const todosIds = result?.ids;

        if (!todosIds) {
          return [];
        }

        const tags = todosIds.map((id) => ({ type: TODO_TAG_TYPE, id } as const));
        tags.push({ type: TODO_TAG_TYPE, id: ALL_TODOS_TAG_ID });

        return tags;
      },
    }),

    getTodosByListId: builder.query<ITodo[], TodoListId>({
      query: (listId: TodoListId) => `todo/${listId}`,

      transformResponse: (response: { data: ITodoResource[] }) => {
        const { data } = response;
        // console.info('[api/todo/:listid]-getTodosByListId: response=', response);

        const todos: ITodo[] = [];
        data.forEach(({ id, attributes }) => {
          if (attributes) {
            todos.push({ id, ...attributes });
          }
        });

        todoAdapter.upsertMany(initialEmptyState, todos);

        return todos;
      },

      providesTags: (result) => {
        const todos = result;

        if (!todos) {
          return [];
        }

        const tags = todos.map((todo) => ({ type: TODO_TAG_TYPE, id: todo.id } as const));
        tags.push({ type: TODO_TAG_TYPE, id: ALL_TODOS_TAG_ID });

        return tags;
      },
    }),

    createTodo: builder.mutation<ITodo, Omit<ITodo, 'id'>>({
      query: (arg) => {
        const data: ITodoResource = {
          type: 'todo',
          id: NEW_TODO_ID,
          attributes: { ...arg },
        };

        return {
          url: 'todo',
          method: 'POST',
          body: { data },
        };
      },

      onQueryStarted: async (todo, api) => {
        const { dispatch, queryFulfilled, getState } = api;
        const getRootState = getState as () => RootState;

        // eslint-disable-next-line no-use-before-define
        const lastPosition = selectLastTodoPositionInList(getRootState(), todo.listId);
        const tempTodo: ITodo = {
          ...todo,
          id: nanoid(),
          position: lastPosition + POSITION_STEP,
        };

        const createResult = dispatch(todoSlice.util.updateQueryData('getTodos', undefined, (draft) =>
          todoAdapter.setOne(draft, tempTodo)));

        try {
          const response = await queryFulfilled;
          dispatch(todoSlice.util.updateQueryData('getTodos', undefined, (draft) =>
            todoAdapter.updateOne(draft, {
              id: tempTodo.id,
              changes: { ...response.data },
            })));
        } catch (error) {
          createResult.undo();
        }
      },

      transformResponse: (response: { data: ITodoResource }) => {
        const { data: { id, attributes } } = response;

        if (!attributes) {
          throw new InvalidDataError('[api/todo] POST: There are no attributes in the response.');
        }

        const todo: ITodo = { id, ...attributes };
        return todo;
      },

    }),

    updateTodo: builder.mutation<ITodo, ITodo>({
      query: (todo: ITodo) => {
        const attrs: Omit<ITodo, 'id'> = todo;
        const data: ITodoResource = {
          id: todo.id,
          type: 'todo',
          attributes: { ...attrs },
        };

        return {
          url: 'todo',
          method: 'PUT',
          body: { data },
        };
      },

      onQueryStarted: async (args, api) => {
        const todo = args;
        const { dispatch, queryFulfilled } = api;

        const updateResult = dispatch(todoSlice.util.updateQueryData('getTodos', undefined, (draft) =>
          todoAdapter.upsertOne(draft, todo)));

        try {
          const response = await queryFulfilled;
          dispatch(todoSlice.util.updateQueryData('getTodos', undefined, (draft) =>
            todoAdapter.upsertOne(draft, response.data)));
        } catch (error) {
          updateResult.undo();
        }
      },

      transformResponse: (response: { data: ITodoResource }) => {
        const { data } = response;

        if (!data.attributes) {
          throw new InvalidDataError('There are no attributes in response.');
        }

        const todo: ITodo = { id: data.id, ...data.attributes };
        return todo;
      },
    }),

    deleteTodo: builder.mutation<TodoId, TodoId>({
      query: (todoId) => {
        const data: ITodoResource = { id: todoId, type: 'todo' };
        return {
          url: 'todo',
          method: 'DELETE',
          body: { data },
        };
      },

      transformResponse: (response: { data: ITodoResource }) => {
        const { data: { id } } = response;
        return id;
      },

      onQueryStarted: async (arg, api) => {
        const { dispatch, queryFulfilled } = api;
        const todoId = arg;

        const deleteResult = dispatch(todoSlice.util.updateQueryData('getTodos', undefined, (draft) =>
          todoAdapter.removeOne(draft, todoId)));

        try {
          const response = await queryFulfilled;
          dispatch(todoSlice.util.updateQueryData('getTodos', undefined, (draft) =>
            todoAdapter.removeOne(draft, response.data)));
        } catch (error) {
          deleteResult.undo();
        }
      },
    }),

    moveTodo: builder.mutation<ITodo[], IMoveTodoPayload>({
      query: (args: IMoveTodoPayload) => {
        const { todoId: id, ...other } = args;
        const data: IMoveTodoResource = {
          id,
          type: 'move-todo',
          attributes: { ...other },
        };

        return {
          url: 'move-todo',
          method: 'PATCH',
          body: { data },
        };
      },

      onQueryStarted: async (args, api) => {
        const { todoId, destListId } = args;
        const { dispatch, getState, queryFulfilled } = api;
        const getRootState = getState as () => RootState;

        const list = selectListById(getRootState(), destListId);
        if (!list) {
          throw new InvalidArgumentError('There are no lists with specified ID.');
        }

        // eslint-disable-next-line no-use-before-define
        const todos = selectAllTodos(getRootState());

        // Устанавливаем временную позицию.
        // Указанная здесь временная позиция будет
        // заменена значением, которое придет от сервера
        const newPos = getNewTodoPosition(todos, args);

        if (!newPos) {
          return;
        }

        const moveResult = dispatch(
          todoSlice.util.updateQueryData('getTodos', undefined, (draft) => {
            todoAdapter.updateOne(draft, {
              id: todoId,
              changes: {
                listId: destListId,
                position: newPos,
              },
            });
          }),
        );

        try {
          const response = (await queryFulfilled);
          dispatch(todoSlice.util.updateQueryData('getTodos', undefined, (draft) =>
            todoAdapter.upsertMany(draft, response.data as ITodo[])));
        } catch (error) {
          moveResult.undo();
        }
      },

      // получаем от сервера вычисленную позицию
      transformResponse: (response: { data: ITodoResource[] }) => {
        const { data } = response;
        const todos: ITodo[] = [];

        data.forEach(({ id, attributes }) => {
          if (attributes) {
            todos.push({ id, ...attributes });
          }
        });

        return todos;
      },
    }),
  }),
});

export default todoSlice;

export const {
  useGetTodosQuery: useGetTodos,
  useGetTodosByListIdQuery: useGetTodosByListId,
  useMoveTodoMutation: useMoveTodo,
  useUpdateTodoMutation: useUpdateTodo,
  useDeleteTodoMutation: useDeleteTodo,
  useCreateTodoMutation: useCreateTodo,
} = todoSlice;

const selectGetTodosData = createSelector(
  todoSlice.endpoints.getTodos.select(undefined),
  (result) => result.data,
);

export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
} = todoAdapter.getSelectors<RootState>((state) => selectGetTodosData(state) ?? initialEmptyState);

export const selectSortedTodos = (state: RootState) =>
  selectAllTodos(state).sort((a, b) => a.position - b.position);

export const selectAllTodosIds = (state: RootState) =>
  selectSortedTodos(state).map((todo) => todo.id);

export const selectTodosByListId = (state: RootState, listId: TodoListId) =>
  selectSortedTodos(state).filter((todo) => todo.listId === listId);

export const selectTodosIdsByListId = (state: RootState, listId: TodoListId) =>
  selectTodosByListId(state, listId).map((todo) => todo.id);

export const selectLastTodoPositionInList = (state: RootState, listId: TodoListId) =>
  selectTodosByListId(state, listId)
    .map((todo) => todo.position)
    .reduce((prev, cur) => Math.max(prev, cur), 0);
