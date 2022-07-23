import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';

import { ITodoTable, TodoTableId } from '../../models/ITodoTable';
import ITodoTableResource from '../../models/json-api-models/ITodoTableResource';
import { RootState } from '../store';
import apiSlice, { TABLE_TAG_ID, TABLE_TAG_TYPE } from './apiSlice';

export const tableAdapter = createEntityAdapter<ITodoTable>({
  selectId: (table) => table.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const initialApiState = tableAdapter.getInitialState();

const tableSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTables: builder.query<EntityState<ITodoTable>, undefined>({
      query: () => 'table',

      transformResponse: (response: { data: ITodoTableResource[] }) => {
        const { data } = response;
        // console.log('[api/table]', response);

        const tables: ITodoTable[] = [];
        data.forEach(({ id, attributes }) =>
          tables.push({ id, name: attributes?.name ?? '' }));

        return tableAdapter.setAll(initialApiState, tables);
      },

      providesTags(result) {
        const tables = Object.values(result?.entities ?? {});
        const tabs = tables.filter((table) => !!table);

        const tablesIds = [
          ...tabs.map((table) => ({ type: TABLE_TAG_TYPE, id: table!.id } as const)),
          { type: TABLE_TAG_TYPE, id: TABLE_TAG_ID } as const,
        ];

        return tablesIds;
      },
    }),

    createTable: builder.mutation<ITodoTable, Omit<ITodoTable, 'id'>>({
      query: (args) => {
        const data: ITodoTableResource = {
          id: '',
          type: 'table',
          attributes: {
            name: args.name,
          },
        };

        return {
          url: 'table',
          method: 'POST',
          body: { data },
        };
      },

      transformResponse: (response: { data: ITodoTableResource }) => {
        const { data: { id, attributes } } = response;
        const table: ITodoTable = { id, name: attributes?.name ?? '' };
        return table;
      },

      onQueryStarted: async (_, api) => {
        const { dispatch, queryFulfilled } = api;

        try {
          const response = await queryFulfilled;
          dispatch(tableSlice.util.updateQueryData('getTables', undefined, (draft) =>
            tableAdapter.setOne(draft, response.data)));
        } catch (error) {
          // пусто
        }
      },

      invalidatesTags(_, error) {
        if (error) {
          return [];
        }
        return [{ type: TABLE_TAG_TYPE, id: TABLE_TAG_ID }];
      },
    }),

    updateTable: builder.mutation<ITodoTable, ITodoTable>({
      query: (args) => {
        const data: ITodoTableResource = {
          id: args.id,
          type: 'table',
          attributes: {
            name: args.name,
          },
        };

        return {
          url: 'table',
          method: 'PUT',
          body: { data },
        };
      },

      transformResponse: (response: { data: ITodoTableResource }) => {
        const { data: { id, attributes } } = response;
        const table: ITodoTable = { id, name: attributes?.name ?? '' };
        return { ...table };
      },

      onQueryStarted: async (arg, api) => {
        const table = arg;
        const { dispatch, queryFulfilled } = api;

        const updateResult = dispatch(
          tableSlice.util.updateQueryData('getTables', undefined, (draft) =>
            tableAdapter.updateOne(draft, {
              id: table.id,
              changes: { name: table.name },
            })),
        );

        try {
          const response = await queryFulfilled;
          dispatch(tableSlice.util.updateQueryData('getTables', undefined, (draft) =>
            tableAdapter.upsertOne(draft, response.data)));
        } catch (error) {
          updateResult.undo();
        }
      },
    }),

    deleteTable: builder.mutation<TodoTableId, TodoTableId>({
      query: (tableId) => {
        const data: ITodoTableResource = {
          type: 'table',
          id: tableId,
        };

        return {
          url: 'table',
          method: 'DELETE',
          body: { data },
        };
      },

      transformResponse: (response: { data: ITodoTableResource }) => {
        const { data: { id } } = response;
        tableAdapter.removeOne(initialApiState, id);
        return id;
      },

      onQueryStarted: async (_, api) => {
        const { dispatch, queryFulfilled } = api;

        try {
          const response = await queryFulfilled;
          dispatch(tableSlice.util.updateQueryData('getTables', undefined, (draft) =>
            tableAdapter.removeOne(draft, response.data)));
        } catch (error) {
          // deleteResult.undo();
        }
      },
    }),
  }),
});

export default tableSlice;

export const {
  useGetTablesQuery: useGetTables,
  useCreateTableMutation: useCreateTable,
  useUpdateTableMutation: useUpdateTable,
  useDeleteTableMutation: useDeleteTable,
} = tableSlice;

const selectGetTablesResult = tableSlice.endpoints.getTables.select(undefined);
const selectGetTablesData = createSelector(
  selectGetTablesResult,
  (result) => result.data,
);

export const {
  selectAll: selectAllTables,
  selectById: selectTableById,
} = tableAdapter.getSelectors<RootState>((state) => selectGetTablesData(state) ?? initialApiState);

export const selectAllTablesIds = (state: RootState) =>
  selectAllTables(state).map((table) => table.id);
