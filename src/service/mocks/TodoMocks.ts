import { faker } from '@faker-js/faker';
import { INVALID_LIST_ID, INVALID_TABLE_ID } from '../Consts';

import tables from './MockTable';
import lists from './MockLists';
import todos from './MockTodos';

// Сопоставление задач со списками
for (let i = 0; i < todos.length; i += 1) {
  if (lists.length) {
    const index = faker.mersenne.rand(lists.length, 0);
    todos[i].listId = lists[index].id;
  } else {
    todos[i].listId = INVALID_TABLE_ID;
  }
}

// Сопоставление списков задач с таблицей
for (let i = 0; i < lists.length; i += 1) {
  if (tables.length > 0) {
    const index = faker.mersenne.rand(tables.length, 0);
    lists[i].tableId = tables[index].id;
  } else {
    lists[i].tableId = INVALID_LIST_ID;
  }
}

const TodoMocks = {
  todos,
  lists,
  tables,
};

export default TodoMocks;
