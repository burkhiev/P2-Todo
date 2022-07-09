import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
import {
  createApi, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';

// eslint-disable-next-line import/no-unresolved
import { ResultDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { RootState } from '../store';
import { ITodoTable, TodoTableId } from '../../models/ITodoTable';
import ITodoTableResource from '../../models/json-api-models/ITodoTableResource';
import { MIRAGE_NAMESPACE, MIRAGE_URL } from '../../mocks/api/mirageApi';

const TABLE_TAG_TYPE = 'TABLE_TAG_TYPE';
const TABLE_TAG_ID = 'TABLE_TAG_ID';
const EMPTY_TABLE_TAG_ID = 'EMPTY_TABLE_TAG_ID';

const EmptyResultDescription:
  ResultDescription<
    'TABLE_TAG_TYPE',
    { id: string; },
    { id: string; },
    FetchBaseQueryError,
    FetchBaseQueryMeta | undefined
  > | undefined = [{ type: TABLE_TAG_TYPE, id: EMPTY_TABLE_TAG_ID }];

const apiAdapter = createEntityAdapter<ITodoTable>({
  selectId: (table) => table.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = apiAdapter.getInitialState();

const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({ baseUrl: `${MIRAGE_URL}/${MIRAGE_NAMESPACE}` }),

  tagTypes: [TABLE_TAG_TYPE],

  endpoints: (builder) => ({
    getTables: builder.query<EntityState<ITodoTable>, undefined>({
      query: () => 'table',

      transformResponse: (response: { data: ITodoTableResource[] }) => {
        const { data } = response;

        const tables: ITodoTable[] = [];
        data.forEach(({ id, attributes }) =>
          tables.push({ id, name: attributes?.name ?? '' }));

        return apiAdapter.setAll(initialState, tables);
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
        apiAdapter.addOne(initialState, table);

        return table;
      },

      invalidatesTags(_, error) {
        if (error) {
          return EmptyResultDescription;
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
        apiAdapter.upsertOne(initialState, table);

        return { ...table };
      },

      invalidatesTags(result, error) {
        if (error) {
          return EmptyResultDescription;
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

        apiAdapter.removeOne(initialState, id);

        return { id };
      },

      invalidatesTags(result, error) {
        if (error) {
          return EmptyResultDescription;
        }
        return [{ type: TABLE_TAG_TYPE, id: result?.id }];
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
