import { faker } from '@faker-js/faker';
import { nanoid } from '@reduxjs/toolkit';

import { ITodo } from '../../models/ITodo';
import { POSITION_STEP } from '../Consts';
import { firstToUpperCase } from '../StringFunctions';

const mockTodos: Array<ITodo> = [];
const todosCount = 50;
const date = new Date();

for (let i = 0; i < todosCount; i += 1) {
  date.setSeconds(i);

  const wordsCount = faker.mersenne.rand(2, 1);
  const newTitle = faker.lorem.words(wordsCount);

  const sentCount = faker.mersenne.rand(3, 0);
  const description = faker.lorem.sentences(sentCount);

  const addedAt = faker.date
    .between('2020-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')
    .toISOString();

  const item: ITodo = {
    id: nanoid(),
    listId: '',
    title: firstToUpperCase(newTitle),
    description,
    addedAt,
    position: POSITION_STEP * (i + 1),
  };

  mockTodos.push(item);
}

export default mockTodos;
