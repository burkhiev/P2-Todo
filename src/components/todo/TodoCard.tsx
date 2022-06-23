import React from 'react'

import { useAppSelector } from '../../hooks/reduxHooks'
import { selectTodoById } from '../../store/todo/todoSlice';

interface ITodoItemProps {
  todoId: string
}

export default function TodoCard(props: ITodoItemProps) {
  const { todoId } = props;
  const todo = useAppSelector(state => selectTodoById(state, todoId));

  if (!todo)
    throw new Error('todo item is empty.');

  return (
    <div>
      <h5>{todo.title}</h5>
    </div>
  )
}
