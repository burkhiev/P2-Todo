import { nanoid } from '@reduxjs/toolkit';

import { ITodoList } from '../../models/ITodoList';
import { POSITION_STEP } from '../Consts';
import { getTitle } from '../Lorem';

const mockLists: Array<ITodoList> = [];
const listsCount = 4;

for (let i = 0; i < listsCount; i += 1) {
  const column: ITodoList = {
    listId: nanoid(),
    tableId: '',
    title: getTitle(),
    position: (i + 1) * POSITION_STEP,
  };

  mockLists.push(column);
}

export default mockLists;
