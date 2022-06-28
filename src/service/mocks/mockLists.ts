import { nanoid } from '@reduxjs/toolkit';

import { ITodoList } from '../../models/ITodoList';
import { getTitle } from '../Lorem';

const mockLists: Array<ITodoList> = [];
const listsCount = 4;

for (let i = 0; i < listsCount; i += 1) {
  const column: ITodoList = {
    listId: nanoid(),
    tableId: '',
    title: getTitle(),
  };

  mockLists.push(column);
}

export default mockLists;
