import { nanoid } from '@reduxjs/toolkit';

import { ITodo } from '../../../models/ITodo';
import columns from './mockTodoColumns';
import { getTitle, getSentence } from '../../../services/Lorem';
import random from '../../../services/random';

const mockTodos: Array<ITodo> = [];
const todosCount = 12;

for (let i = 0; i < todosCount; i++) {
  const columnId = columns[random.int(0, columns.length - 1)].columnId;

  const item: ITodo = {
    todoId: nanoid(),
    columnId,
    title: getTitle(),
    description: ''
  };

  if (random.bool()) {
    item.description = getSentence();
  }

  mockTodos.push(item);
}

export default mockTodos;
