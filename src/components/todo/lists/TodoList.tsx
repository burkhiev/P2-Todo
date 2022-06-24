import React from 'react'

import TodoInputForm from '../cards/TodoCardCreator';
import { TodoListId } from '../../../models/ITodoList';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { selectTodoIdsByColumnId } from '../../../store/todo/todoSlice';
import TodoCard from '../cards/TodoCard';
import { selectTodoListById } from '../../../store/todo/listSlice';
import errorMsg from './TodoListErrorMessages';
import { listRemoved } from '../../../store/todo/listSlice';

interface ITodoColumnProps {
  listId: TodoListId
}

export default function TodoList(props: ITodoColumnProps) {
  const { listId } = props;

  const dispatch = useAppDispatch();

  const list = useAppSelector(state => selectTodoListById(state, listId));
  if (!list)
    throw new Error(errorMsg.noColumnErrorMsg);
  
  const todoIds = useAppSelector(state => selectTodoIdsByColumnId(state, listId));

  function onRemoveList() {
    dispatch(listRemoved(listId));
  }

  let content: any = '';

  if (todoIds.length > 0) {
    content = todoIds.map(todoId =>
      <TodoCard key={todoId} todoId={todoId} />);
  }

  return (
    <div>
      <div className='border rounded p-1'>
        <div className='d-flex'>
          <div className='ms-2'>
            <h2 className='fs-4'>{list.title}</h2>
          </div>
          <div className='ms-auto'>
            <button
              type='button'
              className='btn'
              onClick={onRemoveList}
            >
              <span className='bi bi-x-lg'></span>
            </button>
          </div>
        </div>
        <div className='v-stack'>
          {content}
        </div>
        <div>
          <TodoInputForm />
        </div>
      </div>
    </div>
  );
}
