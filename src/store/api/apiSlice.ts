import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ITodoTable, TodoTableId } from '../../models/ITodoTable';
import { RootState } from '../store';

const BASE_URL = 'http://127.0.0.1:5500/api/';
const TABLE_TAG_TYPE = 'TABLE_TAG_TYPE';
const TABLE_TAG_ID = 'TABLE_TAG_ID';

const apiAdapter = createEntityAdapter<ITodoTable>({
  selectId: (table) => table.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = apiAdapter.getInitialState();

const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),

  tagTypes: [TABLE_TAG_TYPE],

  endpoints: (builder) => ({
    getTables: builder.query <EntityState<ITodoTable>, undefined>({
      query: () => 'table',

      providesTags(result) {
        const tables = Object.values(result?.entities ?? {});
        const tabs = tables.filter((table) => !!table);

        const tablesIds = [
          ...tabs.map((table) => ({ type: TABLE_TAG_TYPE, id: table!.id } as const)),
          { type: TABLE_TAG_TYPE, id: TABLE_TAG_ID } as const,
        ];

        return tablesIds;
      },

      transformResponse: (response: { tables: ITodoTable[] }) =>
        apiAdapter.setAll(initialState, response.tables),
    }),

    createTable: builder.mutation<ITodoTable, Omit<ITodoTable, 'id'>>({
      query: (data) => ({
        url: 'table',
        method: 'POST',
        body: { ...data },
      }),

      invalidatesTags() {
        return [{ type: TABLE_TAG_TYPE, id: TABLE_TAG_ID }];
      },

      transformResponse: (response: { table: ITodoTable }) => {
        const { table } = response;
        apiAdapter.addOne(initialState, table);
        return table;
      },
    }),

    updateTable: builder.mutation<ITodoTable, ITodoTable>({
      query: (data) => ({
        url: 'table',
        method: 'PUT',
        body: { ...data },
      }),

      invalidatesTags(result) {
        return [{ type: TABLE_TAG_TYPE, id: result?.id }];
      },

      transformResponse: (response: { table: ITodoTable }) => {
        const { table } = response;
        apiAdapter.upsertOne(initialState, table);
        return { ...table };
      },
    }),

    deleteTable: builder.mutation<{ id: TodoTableId }, { id: TodoTableId }>({
      query: (data) => ({
        url: 'table',
        method: 'DELETE',
        body: { id: data.id },
      }),

      invalidatesTags(result) {
        return [{ type: TABLE_TAG_TYPE, id: result?.id }];
      },

      transformResponse: (response: { table: { id: TodoTableId } }) => {
        const { table: { id } } = response;
        apiAdapter.removeOne(initialState, id);
        return { id };
      },
    }),
  }),
});

export default apiSlice;

export const {
  useGetTablesQuery: useGetTables,
  useCreateTableMutation: useCreateTable,
  useUpdateTableMutation: useUpdateTable,
  useDeleteTableMutation: useDeleteTable,
} = apiSlice;

const selectGetTablesResult = apiSlice.endpoints.getTables.select(undefined);
const selectGetTablesData = createSelector(
  selectGetTablesResult,
  (result) => result.data,
);

export const {
  selectAll: selectAllTables,
  selectById: selectTableById,
} = apiAdapter.getSelectors<RootState>((state) => selectGetTablesData(state) ?? initialState);

export const selectAllTablesIds = (state: RootState) =>
  selectAllTables(state).map((table) => table.id);
