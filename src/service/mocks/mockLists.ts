import { nanoid } from '@reduxjs/toolkit';
import { faker } from '@faker-js/faker';

import { ITodoList } from '../../models/ITodoList';
import { POSITION_STEP } from '../Consts';
import { firstToUpperCase } from '../StringFunctions';

const mockLists: Array<ITodoList> = [];
const listsCount = 15;

for (let i = 0; i < listsCount; i += 1) {
  const newTitle = faker.commerce.department();

  const column: ITodoList = {
    id: nanoid(),
    tableId: '',
    title: firstToUpperCase(newTitle),
    position: (i + 1) * POSITION_STEP,
  };

  mockLists.push(column);
}

export default mockLists;
