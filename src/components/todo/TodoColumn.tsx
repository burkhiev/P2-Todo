import React from 'react'
import classnames from 'classnames';

import TodoInputForm from './TodoInputForm';
import { TodoColumnId } from '../../models/ITodoColumn';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectTodoIdsByColumnId } from '../../store/todo/todoSlice';
import TodoCard from './TodoCard';
import { selectTodoColumnById } from '../../store/todo/columnSlice';

const noColumnErrorMsg = 'TodoColumn component must have column entity.';

const css = classnames([
  'col-4',
  'col-md-3',
  'col-xl-2',
  'border'
]);

interface ITodoColumnProps {
  columnId: TodoColumnId
}

export default function TodoColumn(props: ITodoColumnProps) {
  const { columnId } = props;

  const column = useAppSelector(state => selectTodoColumnById(state, columnId));
  if (!column)
    throw new Error(noColumnErrorMsg);
  
  const todoIds = useAppSelector(state => selectTodoIdsByColumnId(state, columnId));

  let content: any = '';

  if (todoIds.length > 0) {
    content = todoIds.map(todoId =>
      <TodoCard key={todoId} todoId={todoId} />);
  }

  return (
    <div className={css}>
      <h2>{column.name}</h2>
      <div>
        {content}
      </div>
      <div>
        <TodoInputForm />
      </div>
    </div>
  )
}
