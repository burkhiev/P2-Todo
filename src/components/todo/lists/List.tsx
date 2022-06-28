import React, { useEffect, useState } from 'react';

import { nanoid } from '@reduxjs/toolkit';
import { TodoListId } from '../../../models/ITodoList';
import { useAppSelector } from '../../../hooks/reduxHooks';
import TodoCard from '../todos/TodoCard';
import TableStyles from './ListStylesStrings';
import CreateTodoExpander from '../todos/CreateTodoExpander';
import ListOptions from './ListOptions';
import ListTitle from './ListTitle';
import TodoCardPlaceholder from '../todos/TodoCardPlaceholder';
import { TodoId } from '../../../models/ITodo';
import useTodoDropWithoutInsert from '../../../hooks/useTodoDropWithoutInsert';
import { selectOrderedTodoIdsByListId } from '../../../store/todo/todosOrderSlice';

interface IListProps {
  listId: TodoListId
}

export default function List(props: IListProps) {
  const { listId } = props;

  const [{ isOver, draggedTodo }, drop] = useTodoDropWithoutInsert(listId);

  const defaultTodoIds = useAppSelector((state) => selectOrderedTodoIdsByListId(state, listId));

  const [todos, setTodos] = useState<(TodoId | null)[]>([...defaultTodoIds]);

  // Убираем все placeholders
  useEffect(() => {
    if (!isOver) setTodos([...defaultTodoIds]);
  }, [isOver, defaultTodoIds]);

  // Обновляем todos в списке
  useEffect(() => {
    setTodos([...defaultTodoIds]);
  }, [defaultTodoIds]);

  // Отвечает за сдвиг карточек(Drag&Drop)
  function setPlaceholderAtNotEnd(todoId: TodoId) {
    if (draggedTodo?.todoId === todoId) {
      return;
    }

    const todoListCopy = todos.slice();

    const todoIndex = todoListCopy.indexOf(todoId);
    const nullIndex = todoListCopy.indexOf(null);

    // заполнителя нет
    if (nullIndex < 0) {
      todoListCopy.splice(todoIndex, 0, null);
      setTodos(todoListCopy);
      return;
    }

    // --- [ !!! ] ---
    // Каждое изменение массива необходимо фиксировать в state ПО ОТДЕЛЬНОСТИ.
    // Иначе поведение сдвига карточек становится непредсказуемым.
    if (nullIndex >= 0) {
      todoListCopy.splice(nullIndex, 1);
      setTodos(todoListCopy);

      // заполнитель над сдвигаемым элементом
      if (nullIndex < todoIndex) {
        todoListCopy.splice(nullIndex + 1, 0, null);
      }

      // заполнитель под сдвигаемым элементом
      if (todoIndex < nullIndex) {
        todoListCopy.splice(todoIndex, 0, null);
      }

      setTodos(todoListCopy);
    }
  }

  // Добавление в конец списка(Drag&Drop) при наведении на кнопку создания todo
  function setPlaceholderAtEnd() {
    const todoListCopy = todos.slice();
    const nullIndex = todoListCopy.indexOf(null);

    if (nullIndex < 0) {
      setTodos([...todoListCopy, null]);
      return;
    }

    if (nullIndex === (todoListCopy.length - 1)) {
      return;
    }

    todoListCopy.splice(nullIndex, 1);
    setTodos(todoListCopy);

    todoListCopy.push(null);
    setTodos(todoListCopy);
  }

  function onIsDropOver(todoId: TodoId) {
    return () => setPlaceholderAtNotEnd(todoId);
  }

  const renderedTodos = todos.map((todoId, index) => {
    if (todoId === null) {
      return (
        <TodoCardPlaceholder
          key={nanoid()}
          listId={listId}
          insertBeforeTodoIndex={index}
        />
      );
    }

    const temp = onIsDropOver(todoId);

    return (
      <TodoCard
        key={todoId}
        todoId={todoId}
        onIsDropOver={temp}
      />
    );
  });

  return (
    // div обертка нужна для использования внутренних row отступов Bootstrap
    <div>
      <div ref={drop} className={`${TableStyles.listColumn}`}>
        <div className="row row-cols-2 g-0 m-0 mb-2 ">
          <div className="col-9 p-2">
            <ListTitle listId={listId} />
          </div>
          <div className="col-3 d-flex justify-content-end">
            <ListOptions listId={listId} />
          </div>
        </div>
        <div className="v-stack mb-3">
          {renderedTodos}
        </div>
        <div>
          <CreateTodoExpander listId={listId} onIsDropOver={setPlaceholderAtEnd} />
        </div>
      </div>
    </div>
  );
}
