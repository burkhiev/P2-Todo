import table from './mockTable';
import lists from './mockLists';
import todos from './mockTodos';
import random from '../random';
import { ITodoOrderItem } from '../../store/todo/todosOrderSlice';

const todosOrder: ITodoOrderItem[] = [];

// Сопоставление задач со списками
for (let i = 0; i < todos.length; i += 1) {
  const todo = todos[i];

  todo.listId = lists[random.int(0, lists.length - 1)].listId;
  const orderItem = todosOrder.find((item) => item.listId === todo.listId);

  if (orderItem) {
    orderItem.todoIds.push(todo.todoId);
    continue;
  }

  todosOrder.push({
    listId: todo.listId,
    todoIds: [todo.todoId],
  });
}

// Сопоставление cписков задач с таблицей
for (let i = 0; i < lists.length; i += 1) {
  lists[i].tableId = table.tableId;
}

const TodoMocks = {
  todos,
  lists,
  table,
  todosOrder,
};

export default TodoMocks;
