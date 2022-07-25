import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { MIRAGE_NAMESPACE, MIRAGE_URL } from '../../mocks/api/mirageApi';

// Тэги расположены тут, т.к. apiSlice компилируется
// раньше чем внедренные в него endpoints (.injectEndpoints()).
export const TABLE_TAG_TYPE = 'TABLE_TAG_TYPE';
export const TABLE_TAG_ID = 'TABLE_TAG_ID';

export const LIST_TAG_TYPE = 'LIST_TAG_TYPE';
export const ALL_LISTS_TAG_ID = 'EMPTY_LIST_TAG_ID';

export const TODO_TAG_TYPE = 'TODO_TAG_TYPE';
export const ALL_TODOS_TAG_ID = 'ALL_TODOS_TAG_ID';

const baseUrl = `${MIRAGE_URL}/${MIRAGE_NAMESPACE}`;

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: [TABLE_TAG_TYPE, LIST_TAG_TYPE, TODO_TAG_TYPE],
  endpoints: () => ({}),
});

export default apiSlice;
