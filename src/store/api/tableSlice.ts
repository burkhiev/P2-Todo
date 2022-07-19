import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
// import { FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query';
// import { ResultDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';

import { ITodoTable, TodoTableId } from '../../models/ITodoTable';
import ITodoTableResource from '../../models/json-api-models/ITodoTableResource';
import { RootState } from '../store';
import apiSlice, { EMPTY_TABLE_TAG_ID, TABLE_TAG_ID, TABLE_TAG_TYPE } from './apiSlice';

export const EmptyTableResultDescription = [{
  type: TABLE_TAG_TYPE,
  id: EMPTY_TABLE_TAG_ID,
}] as const;

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
        console.log('[api/table]', response);

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
        tableAdapter.addOne(initialApiState, table);

        return table;
      },

      invalidatesTags(_, error) {
        if (error) {
          return EmptyTableResultDescription;
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
        tableAdapter.upsertOne(initialApiState, table);

        return { ...table };
      },

      invalidatesTags(result, error) {
        if (error) {
          return EmptyTableResultDescription;
        }
        return [{ type: TABLE_TAG_TYPE, id: result?.id }];
      },
    }),

    deleteTable: builder.mutation<{ id: TodoTableId }, { id: TodoTableId }>({
      query: (args) => ({
        url: 'table',
        method: 'DELETE',
        body: { data: args },
      }),

      transformResponse: (response: { data: ITodoTableResource }) => {
        const { data: { id } } = response;

        tableAdapter.removeOne(initialApiState, id);

        return { id };
      },

      invalidatesTags(result, error) {
        if (error) {
          return EmptyTableResultDescription;
        }
        return [{ type: TABLE_TAG_TYPE, id: result?.id }];
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
