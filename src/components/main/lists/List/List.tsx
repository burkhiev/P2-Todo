import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import styles from './List.css';

import { TodoListId } from '../../../../models/ITodoList';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import TodoCard from '../../todos/TodoCard/TodoCard';
import CreateTodoExpander from '../../todos/CreateTodoExpander';
import ListOptions from '../ListOptions/ListOptions';
import ListTitle from '../ListTitle/ListTitle';
import { selectListById } from '../../../../store/api/listSlice';
import { selectTodosByListId } from '../../../../store/api/todoSlice';
import DndTypes from '../../../../service/DndTypes';

export const List_TestId = 'List';

interface IListProps {
  listId: TodoListId,
  index: number
}

export default function List(props: IListProps) {
  const { listId, index: listIndex } = props;
  const list = useAppSelector((state) => selectListById(state, listId));

  if (!list) {
    throw new Error('List component must have a valid list id.');
  }

  const todos = useAppSelector((state) => selectTodosByListId(state, listId));
  const renderedTodos = todos.map((todo, index) =>
    <TodoCard key={todo.id} todoId={todo.id} index={index} />);

  return (
    <Draggable draggableId={list.id} index={listIndex}>
      {(dragProvider) => (
        <div
          id={list.id}
          ref={dragProvider.innerRef}
          {...dragProvider.draggableProps}
          {...dragProvider.dragHandleProps}
          className={styles.list}
          data-testid={List_TestId}
        >
          <div className={styles.list_header}>
            <ListTitle listId={listId} />
            <ListOptions listId={listId} />
          </div>
          <Droppable droppableId={list.id} type={DndTypes.todo}>
            {(dropProvider) => (
              <div
                ref={dropProvider.innerRef}
                {...dropProvider.droppableProps}
              >
                <div className="v-stack mb-3">
                  {renderedTodos}
                </div>
                {dropProvider.placeholder}
              </div>
            )}
          </Droppable>
          <CreateTodoExpander listId={listId} />
        </div>
      )}
    </Draggable>
  );
}
