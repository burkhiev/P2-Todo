import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';

import { ITodoList, TodoListId } from '../../models/ITodoList';
import { TodoTableId } from '../../models/ITodoTable';
import ITodoListResource from '../../models/json-api-models/ITodoListResource';
import InvalidDataError from '../../service/errors/InvalidDataError';
import { RootState } from '../store';
import apiSlice, {
  ALL_LISTS_TAG_ID,
  LIST_TAG_TYPE,
} from './apiSlice';

export const EmptyListResultDescription = [{ type: LIST_TAG_TYPE, id: ALL_LISTS_TAG_ID }] as const;

export const listAdapter = createEntityAdapter<ITodoList>({
  selectId: (list) => list.id,
  sortComparer: (a, b) => a.position - b.position,
});

export const initialApiState = listAdapter.getInitialState();

const listSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLists: builder.query<EntityState<ITodoList>, undefined>({
      query: () => 'list',

      transformResponse: (response: { data: ITodoListResource[] }) => {
        const { data } = response;
        // console.log('[api/list]', response);

        const lists: ITodoList[] = [];

        data.forEach(({ id, attributes }) => {
          if (!attributes) {
            throw new InvalidDataError('Some list didn\'t receive any attributes.');
          }

          lists.push({ id, ...attributes });
        });

        return listAdapter.setAll(initialApiState, lists);
      },

      // onQueryStarted: async (_, api) => {
      //   const { dispatch, queryFulfilled } = api;

      //   try {
      //     const response = await queryFulfilled;
      //     dispatch(
      //       listSlice.util.updateQueryData('getLists', undefined, draft =>
      //         listAdapter.setAll(initialApiState, response.data))
      //     )
      //   } catch (error) {

      //   }
      // },

      providesTags(result) {
        const listsIds = result?.ids;

        if (!listsIds) {
          return [];
        }

        const listsTags = [
          ...listsIds.map((id) => ({ type: LIST_TAG_TYPE, id } as const)),
          { type: LIST_TAG_TYPE, id: ALL_LISTS_TAG_ID } as const,
        ];

        return listsTags;
      },
    }),

    createList: builder.mutation<ITodoList, Omit<ITodoList, 'id'>>({
      query: (args) => {
        const data: ITodoListResource = {
          id: '',
          type: 'list',
          attributes: { ...args },
        };

        return {
          url: 'list',
          method: 'POST',
          body: { data },
        };
      },

      transformResponse: (response: { data: ITodoListResource }) => {
        const { data: { id, attributes } } = response;

        if (!attributes) {
          throw new InvalidDataError('There is not list attributes received.');
        }

        const list: ITodoList = { id, ...attributes };
        return list;
      },

      invalidatesTags(_, error) {
        if (error) {
          return EmptyListResultDescription;
        }
        return [{ type: LIST_TAG_TYPE, id: ALL_LISTS_TAG_ID }];
      },
    }),

    updateList: builder.mutation<ITodoList, ITodoList>({
      query: (args) => {
        const data: ITodoListResource = {
          id: args.id,
          type: 'list',
          attributes: { ...(args as Omit<ITodoList, 'id'>) },
        };

        return {
          url: 'list',
          method: 'PUT',
          body: { data },
        };
      },

      transformResponse: (response: { data: ITodoListResource }) => {
        const { data: { id, attributes } } = response;

        if (!attributes) {
          throw new InvalidDataError('There is not list attributes received.');
        }

        const list: ITodoList = { id, ...attributes };
        return list;
      },

      invalidatesTags(result, error) {
        if (error) {
          return EmptyListResultDescription;
        }
        return [{ type: LIST_TAG_TYPE, id: result?.id }];
      },
    }),

    deleteList: builder.mutation<{ id: TodoListId }, { id: TodoListId }>({
      query: (args) => ({
        url: 'list',
        method: 'DELETE',
        body: { data: args },
      }),

      transformResponse: (response: { data: ITodoListResource }) => {
        const { data } = response;
        return data;
      },

      invalidatesTags(result, error) {
        if (error) {
          return EmptyListResultDescription;
        }
        return [{ type: LIST_TAG_TYPE, id: result?.id }];
      },
    }),

    moveList: builder.mutation<ITodoList[], { data: ITodoListResource[] }>({
      query: (args) => ({
        url: 'move-lists',
        method: 'PUT',
        body: { args },
      }),

      async onQueryStarted(args, api) {
        const { data } = args;
        const { dispatch, getState, queryFulfilled } = api;

        const getRootState = getState as () => RootState;

        const moveResult = dispatch(
          listSlice.util.updateQueryData('getLists', undefined, (draft) => {
            // eslint-disable-next-line no-use-before-define
            const lists = selectAllLists(getRootState());
            const listsForUpdate: ITodoList[] = [];

            lists.forEach((list) => {
              const response = data.find((res) => res.id === list.id);

              if (response && response.attributes) {
                listsForUpdate.push({
                  ...list,
                  position: response.attributes.position,
                });
              }
            });

            listAdapter.upsertMany(draft, listsForUpdate);
          }),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          moveResult.undo();
        }
      },

      transformResponse: (response: { data: ITodoListResource[] }) => {
        const { data } = response;

        data.forEach((res) => {
          if (!res.attributes) {
            throw new InvalidDataError('There are not attributes for single list.');
          }
        });

        const lists: ITodoList[] = [];

        data.forEach((res) => {
          lists.push({
            ...(res.attributes as Required<ITodoList>),
            id: res.id,
          });
        });

        return lists;
      },
    }),
  }),
});

export default listSlice;

export const {
  useGetListsQuery: useGetLists,
  useCreateListMutation: useCreateList,
  useUpdateListMutation: useUpdateList,
  useDeleteListMutation: useDeleteList,
  useMoveListMutation: useMoveList,
} = listSlice;

const selectGetListsData = createSelector(
  listSlice.endpoints.getLists.select(undefined),
  (result) => result.data,
);

export const {
  selectAll: selectAllLists,
  selectById: selectListById,
} = listAdapter.getSelectors<RootState>((state) => selectGetListsData(state) ?? initialApiState);

export const selectAllListsIds = (state: RootState) =>
  selectAllLists(state).map((list) => list.id);

export const selectListsByTableId = (state: RootState, tableId: TodoTableId) =>
  selectAllLists(state).filter((list) => list.tableId === tableId);

export const selectLastListsPositionOnTable = (state: RootState, tableId: TodoTableId) =>
  selectListsByTableId(state, tableId)
    .map((list) => list.position)
    .reduce((prev, cur) => Math.max(prev, cur), 0);
