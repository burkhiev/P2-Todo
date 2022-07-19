import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
// import { FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query';
// import { ResultDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { TodoListDropSide } from '../../components/body/table/Table';

import { ITodoList, TodoListId } from '../../models/ITodoList';
import { TodoTableId } from '../../models/ITodoTable';
import ITodoListResource from '../../models/json-api-models/ITodoListResource';
import InvalidDataError from '../../service/errors/InvalidDataError';
import { RootState } from '../store';
import apiSlice, {
  ALL_LISTS_TAG_ID, EMPTY_LIST_TAG_ID, LIST_TAG_ID, LIST_TAG_TYPE,
} from './apiSlice';

export interface IMoveListPayload {
  /**
   * Id списка который взят посредством Drag and Drop.
   */
  draggedList: ITodoList,
  /**
   * Id списка рядом с которым находится взятый
   * с помощью Drag and Drop список.
   */
  targetList: ITodoList,
  /**
   * Будущая позиция вставляемого списка относительно
   * списка с id = targetListId.
   */
  dropSide: TodoListDropSide
}

export const EmptyListResultDescription = [{ type: LIST_TAG_TYPE, id: ALL_LISTS_TAG_ID }] as const;
// ResultDescription<
//   typeof LIST_TAG_TYPE,
//   { id: string; },
//   { id: string; },
//   FetchBaseQueryError,
//   FetchBaseQueryMeta | undefined
// > | undefined = ;

export const listAdapter = createEntityAdapter<ITodoList>({
  selectId: (table) => table.id,
  sortComparer: (a, b) => a.position - b.position,
});

export const initialApiState = listAdapter.getInitialState();

const listSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLists: builder.query<EntityState<ITodoList>, undefined>({
      query: () => 'list',

      transformResponse: (response: { data: ITodoListResource[] }) => {
        const { data } = response;
        console.log('[api/list]', response);

        const lists: ITodoList[] = [];

        data.forEach(({ id, attributes }) => {
          if (!attributes) {
            throw new InvalidDataError('Some table didn\'t receive any attributes.');
          }

          lists.push({ id, ...attributes });
        });

        return listAdapter.setAll(initialApiState, lists);
      },

      providesTags(result) {
        const listsIds = result?.ids;

        if (!listsIds) {
          return [{ type: LIST_TAG_TYPE, id: EMPTY_LIST_TAG_ID } as const];
        }

        const listsTags = [
          ...listsIds.map((id) => ({ type: LIST_TAG_TYPE, id } as const)),
          { type: LIST_TAG_TYPE, id: LIST_TAG_ID } as const,
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
          url: 'table',
          method: 'POST',
          body: { data },
        };
      },

      transformResponse: (response: { data: ITodoListResource }) => {
        const { data: { id, attributes } } = response;

        if (!attributes) {
          throw new InvalidDataError('There is not list attributes received.');
        }

        const table: ITodoList = { id, ...attributes };
        listAdapter.addOne(initialApiState, table);

        return table;
      },

      invalidatesTags(_, error) {
        if (error) {
          return EmptyListResultDescription;
        }
        return [{ type: LIST_TAG_TYPE, id: LIST_TAG_ID }];
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
          url: 'table',
          method: 'PUT',
          body: { data },
        };
      },

      transformResponse: (response: { data: ITodoListResource }) => {
        const { data: { id, attributes } } = response;

        if (!attributes) {
          throw new InvalidDataError('There is not list attributes received.');
        }

        const table: ITodoList = { id, ...attributes };
        listAdapter.upsertOne(initialApiState, table);

        return table;
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
        listAdapter.removeOne(initialApiState, data.id);
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
        body: { data: args.data },
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

const selectGetListsResult = listSlice.endpoints.getLists.select(undefined);
const selectGetListsData = createSelector(
  selectGetListsResult,
  (result) => result.data,
);

export const {
  selectAll: selectAllLists,
  selectById: selectListById,
} = listAdapter.getSelectors<RootState>((state) => selectGetListsData(state) ?? initialApiState);

export const selectAllListsIds = (state: RootState) =>
  selectAllLists(state).map((list) => list.id);

export const selectListsByTableId = (state: RootState, tableId?: TodoTableId) =>
  selectAllLists(state).filter((list) => list.tableId === tableId);

export const selectLastListsPositionOnTable = (state: RootState, tableId?: TodoTableId) =>
  selectAllLists(state)
    .filter((list) => list.tableId === tableId)
    .map((list) => list.position)
    .reduce((prev, cur) => Math.max(prev, cur), 0);
