import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { TodoListId } from '../../../../models/ITodoList';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import TodoCard from '../../todos/TodoCard/TodoCard';
import ListStyles from './bootstrapListStyles';
import CreateTodoExpander from '../../todos/CreateTodoExpander';
import ListOptions from '../ListOptions/ListOptions';
import ListTitle from '../ListTitle/ListTitle';
import { selectListById } from '../../../../store/api/listSlice';
import { selectTodosByListId } from '../../../../store/api/todoSlice';
import DndTypes from '../../../../service/DndTypes';

export const List_TestId = 'List';

interface IListProps {
  listId: TodoListId,
}

export default function List(props: IListProps) {
  const { listId } = props;
  const list = useAppSelector((state) => selectListById(state, listId));

  if (!list) {
    throw new Error('List component must have a valid list id.');
  }

  const todos = useAppSelector((state) => selectTodosByListId(state, listId));
  const renderedTodos = todos.map((todo, index) =>
    <TodoCard key={todo.id} todoId={todo.id} index={index} />);

  return (
    <Droppable droppableId={list.id} type={DndTypes.TODO}>
      {(provider) => (
        <div>
          <div
            id={list.id}
            ref={provider.innerRef}
            data-testid={List_TestId}
            className={`${ListStyles.list}`}
            {...provider.droppableProps}
          >
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
              <CreateTodoExpander listId={listId} />
            </div>
            {provider.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
