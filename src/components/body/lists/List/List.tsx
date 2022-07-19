import React, { useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';

import { TodoListId } from '../../../../models/ITodoList';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import TodoCard from '../../todos/TodoCard/TodoCard';
import ListStyles from './bootstrapListStyles';
import CreateTodoExpander from '../../todos/CreateTodoExpander';
import ListOptions from '../ListOptions/ListOptions';
import ListTitle from '../ListTitle/ListTitle';
import TodoCardPlaceholder from '../../todos/TodoCardPlaceholder';
import { TodoId } from '../../../../models/ITodo';
import useTodoDropInfo from '../../../../hooks/dnd/useTodoDropInfo';
import { selectTodoIdsByListId } from '../../../../store/todo/todoSlice';
import { selectListById } from '../../../../store/api/listSlice';

interface IListProps {
  listId: TodoListId,
}

export default function List(props: IListProps) {
  const { listId } = props;

  const list = useAppSelector((state) => selectListById(state, listId));
  if (!list) {
    throw new Error('List component must have a valid list id.');
  }

  const defaultTodoIds = useAppSelector((state) => selectTodoIdsByListId(state, listId));

  const [todoIds, setTodos] = useState<(TodoId | undefined)[]>([...defaultTodoIds]);
  const [needUpdateTodos, setNeedUpdateTodos] = useState(false);

  /**
   * Функция предназначена для передачи возможности
   * обновления списка дочерним компонентам.
   */
  function setNewTodos() {
    setNeedUpdateTodos(true);
  }

  if (needUpdateTodos) {
    setTodos([...defaultTodoIds]);
    setNeedUpdateTodos(false);
  }

  const [{ todoIsOver, draggedTodo }, todoDrop] = useTodoDropInfo();

  // Удаление placeholder при выходе из области списка.
  useEffect(() => {
    if (!todoIsOver) {
      const todoListCopy = todoIds.slice();
      const index = todoListCopy.indexOf(undefined);

      if (index >= 0) {
        todoListCopy.splice(index, 1);
        setTodos(todoListCopy);
      }
    }
  }, [todoIsOver, todoIds]);

  // Обновляем компонент при изменении количества в списке
  useEffect(() => {
    setNewTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTodoIds.length]);

  /**
   * Отвечает за сдвиг placeholder'а (Drag&Drop)
   * @param todoId id сдвигаемой карточки
   * @returns void
   */
  function setTodoPlaceholder(todoId?: TodoId) {
    if (draggedTodo?.id === todoId) {
      return;
    }

    const todoListCopy = todoIds.slice();

    const todoIndex = todoListCopy.indexOf(todoId);
    const nullIndex = todoListCopy.indexOf(undefined);

    // placeholder'а нет
    if (nullIndex < 0) {
      todoListCopy.splice((todoIndex < 0) ? todoListCopy.length : todoIndex, 0, undefined);
      setTodos(todoListCopy);
      return;
    }

    if (nullIndex >= 0) {
      todoListCopy.splice(nullIndex, 1);

      // заполнитель был над сдвигаемым элементом
      if (nullIndex < todoIndex) {
        // todoIndex -= 1;
        // todoListCopy.splice(todoIndex + 1, 0, undefined);
        todoListCopy.splice(todoIndex, 0, undefined);
      }

      // заполнитель был под сдвигаемым элементом
      if (todoIndex < nullIndex) {
        todoListCopy.splice(todoIndex, 0, undefined);
      }

      setTodos(todoListCopy);
    }
  }

  const renderedTodos = todoIds.map((todoId, index) => {
    if (todoId === undefined) {
      return (
        <TodoCardPlaceholder
          key={nanoid()}
          listId={listId}
          insertIndex={index}
          onDrop={setNewTodos}
        />
      );
    }

    return (
      <TodoCard
        key={todoId}
        todoId={todoId}
        isOverList={todoIsOver}
        setPlaceholder={setTodoPlaceholder}
        updateList={setNewTodos}
      />
    );
  });

  return (
    <div ref={todoDrop} className={`${ListStyles.list}`}>
      <div className="row row-cols-2 g-0 m-0 mb-2">
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
  );
}
