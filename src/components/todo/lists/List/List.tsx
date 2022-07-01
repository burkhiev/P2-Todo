import React, { useEffect, useState } from 'react';

import { nanoid } from '@reduxjs/toolkit';

import { TodoListId } from '../../../../models/ITodoList';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import TodoCard from '../../todos/TodoCard/TodoCard';
import TableStyles from './ListBootstrapStyles';
import CreateTodoExpander from '../../todos/CreateTodoExpander';
import ListOptions from '../ListOptions/ListOptions';
import ListTitle from '../ListTitle';
import TodoCardPlaceholder from '../../todos/TodoCardPlaceholder';
import { TodoId } from '../../../../models/ITodo';
import useTodoDropWithoutInsert from '../../../../hooks/dragDrop/useTodoDropWithoutInsert';
import { selectTodoListById } from '../../../../store/todo/listSlice';
import { selectTodoIdsByListId } from '../../../../store/todo/todoSlice';

interface IListProps {
  listId: TodoListId,
}

export default function List(props: IListProps) {
  const { listId } = props;

  const list = useAppSelector((state) => selectTodoListById(state, listId));
  if (!list) {
    throw new Error('List component must have a valid list id.');
  }

  const sortedTodoIds = useAppSelector((state) => selectTodoIdsByListId(state, listId));

  const [todos, setTodos] = useState<(TodoId | undefined)[]>([...sortedTodoIds]);

  const [{ todoIsOver, draggedTodo }, todoDrop] = useTodoDropWithoutInsert(listId);

  // ***** !!! *****
  // Placeholder стоит на месте null в списке задач

  // Удаление placeholder
  useEffect(() => {
    if (!todoIsOver) {
      const todoListCopy = todos.slice();
      const index = todoListCopy.indexOf(undefined);

      if (index >= 0) {
        todoListCopy.splice(index, 1);
        setTodos(todoListCopy);
      }
    }
  }, [todoIsOver, todos]);

  // Обновляем компонент если:
  // 1. В список добавлялись элементы.
  // 2. Из списка удалялись элементы.
  useEffect(() => {
    setTodos([...sortedTodoIds]);

  // Предотвращаем бесконечный рендеринг следя
  // за кол-вом элементов, а не за ссылкой на объект.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedTodoIds.length]);

  /**
   * Отвечает за сдвиг карточек(Drag&Drop)
   * @param todoId id сдвигаемой карточки
   * @returns void
   */
  function setTodoPlaceholder(todoId?: TodoId) {
    if (draggedTodo?.todoId === todoId) {
      return;
    }

    const todoListCopy = todos.slice();

    const todoIndex = todoListCopy.indexOf(todoId);
    const nullIndex = todoListCopy.indexOf(undefined);

    // сдвигаемой карточки или заполнителя нет
    if (nullIndex < 0) {
      todoListCopy.splice(todoIndex < 0 ? todoListCopy.length : todoIndex, 0, undefined);
      setTodos(todoListCopy);
      return;
    }

    if (nullIndex >= 0) {
      todoListCopy.splice(nullIndex, 1);

      // заполнитель был над сдвигаемым элементом
      if (nullIndex < todoIndex) {
        todoListCopy.splice(nullIndex + 1, 0, undefined);
      }

      // заполнитель был под сдвигаемым элементом
      if (todoIndex < nullIndex) {
        todoListCopy.splice(todoIndex, 0, undefined);
      }

      if (nullIndex !== todoIndex) {
        setTodos(todoListCopy);
      }
    }
  }

  const renderedTodos = todos.map((todoId, index) => {
    if (todoId === undefined) {
      return (
        <TodoCardPlaceholder
          key={nanoid()}
          listId={listId}
          insertBeforeTodoIndex={index}
        />
      );
    }

    return (
      <TodoCard
        key={todoId}
        todoId={todoId}
        setPlaceholder={setTodoPlaceholder}
      />
    );
  });

  return (
    // div обертка нужна для использования внутренних row отступов Bootstrap
    <div>
      <div ref={todoDrop} className={`${TableStyles.list}`}>
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
          <CreateTodoExpander listId={listId} setPlaceholder={setTodoPlaceholder} />
        </div>
      </div>
    </div>
  );
}
