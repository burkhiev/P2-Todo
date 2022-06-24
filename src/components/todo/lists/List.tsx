import React from 'react';

import { TodoListId } from '../../../models/ITodoList';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { selectTodoIdsByListId } from '../../../store/todo/todoSlice';
import TodoCard from '../todos/TodoCard';
import { selectTodoListById } from '../../../store/todo/listSlice';
import TableStyles from './ListStylesStrings';
import CreateTodoExpander from '../todos/CreateTodoExpander';
import ListOptions from './ListOptions';
import ListTitle from './ListTitle';

interface IListProps {
  listId: TodoListId
}

export default function List(props: IListProps) {
  const { listId } = props;

  const list = useAppSelector((state) => selectTodoListById(state, listId));
  if (!list) {
    throw new Error('TodoColumn component must have column entity.');
  }

  const todoIds = useAppSelector((state) => selectTodoIdsByListId(state, listId));

  let content: any = '';

  if (todoIds.length > 0) {
    content = todoIds.map((todoId) => <TodoCard key={todoId} todoId={todoId} />);
  }

  return (
    <div>
      <div className={`${TableStyles.listColumn}`}>
        <div className="row row-cols-2 g-0 m-0 mb-2 ">
          <div className="col-9 p-2">
            <ListTitle listId={listId} />
          </div>
          <div className="col-3 d-flex justify-content-end">
            <ListOptions listId={list.listId} />
          </div>
        </div>
        <div className="v-stack mb-3">
          {content}
        </div>
        <div>
          <CreateTodoExpander listId={listId} />
        </div>
      </div>
    </div>
  );
}
