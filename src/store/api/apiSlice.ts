import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { MIRAGE_NAMESPACE, MIRAGE_URL } from '../../mocks/api/mirageApi';

export const TABLE_TAG_TYPE = 'TABLE_TAG_TYPE';
export const TABLE_TAG_ID = 'TABLE_TAG_ID';
export const EMPTY_TABLE_TAG_ID = 'EMPTY_TABLE_TAG_ID';

export const LIST_TAG_TYPE = 'LIST_TAG_TYPE';
export const LIST_TAG_ID = 'LIST_TAG_ID';
export const ALL_LISTS_TAG_ID = 'EMPTY_LIST_TAG_ID';
export const EMPTY_LIST_TAG_ID = 'EMPTY_LIST_TAG_ID';

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${MIRAGE_URL}/${MIRAGE_NAMESPACE}` }),
  tagTypes: [TABLE_TAG_TYPE, LIST_TAG_TYPE],
  endpoints: () => ({}),
});

export default apiSlice;
