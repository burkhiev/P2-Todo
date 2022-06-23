import React from 'react';

import TodoColumn from './TodoColumn';
import { TodoTableId } from '../../models/ITodoTable';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectTableById } from '../../store/todo/tableSlice';
import { selectTodoColumnIdsByTable } from '../../store/todo/columnSlice';

interface ITodoTableProps {
  tableId: TodoTableId
}

const noTableErrorMsg = 'TodoTable component should have an appropriate table entity.';

export default function TodoTable(props: ITodoTableProps) {
  const { tableId } = props;

  const table = useAppSelector(state => selectTableById(state, tableId));
  if (!table)
    throw new Error(noTableErrorMsg);

  const columnIds = useAppSelector(state => selectTodoColumnIdsByTable(state, tableId));

  let content: any = <span>Задач нет</span>;

  if (columnIds.length > 0) {
    content = columnIds.map(columnId =>
      <TodoColumn key={columnId} columnId={columnId} />);
  }

  return (
    <div className='border bg-light my-3'>
      <h1>{table.name}</h1>
      <div className='d-flex flex-wrap m-2'>
        {content}
      </div>
    </div>
  )
}
