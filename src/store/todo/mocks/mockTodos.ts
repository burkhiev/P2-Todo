import { nanoid } from '@reduxjs/toolkit';

import { ITodo } from '../../../models/ITodo';
import lists from './mockTodoLists';
import { getTitle, getSentence } from '../../../services/Lorem';
import random from '../../../services/random';

const mockTodos: Array<ITodo> = [];
const todosCount = 12;
const date = new Date();

for (let i = 0; i < todosCount; i += 1) {
  const columnId = lists[random.int(0, lists.length - 1)].listId;

  date.setSeconds(i);

  const item: ITodo = {
    todoId: nanoid(),
    listId: columnId,
    title: getTitle(),
    description: '',
    addedAt: date.toISOString(),
  };

  if (random.bool()) {
    item.description = getSentence();
  }

  mockTodos.push(item);
}

export default mockTodos;
