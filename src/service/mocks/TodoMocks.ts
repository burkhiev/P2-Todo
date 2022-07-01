import tables from './MockTable';
import lists from './MockLists';
import todos from './MockTodos';
import random from '../random';

// Сопоставление задач со списками
for (let i = 0; i < todos.length; i += 1) {
  const todo = todos[i];

  todo.listId = lists[random.int(0, lists.length - 1)].listId;
}

// Сопоставление cписков задач с таблицей
for (let i = 0; i < lists.length; i += 1) {
  const list = lists[i];

  const table = tables[random.int(0, tables.length - 1)];
  list.tableId = table.tableId;
}

const TodoMocks = {
  todos,
  lists,
  tables,
};

export default TodoMocks;
