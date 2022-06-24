import React from 'react';

import TodoList from './lists/TodoList';
import { TodoTableId } from '../../models/ITodoTable';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectTableById } from '../../store/todo/tableSlice';
import { selectTodoListIdsByTable } from '../../store/todo/listSlice';
import TodoListCreator from './lists/TodoListCreator';

interface ITodoTableProps {
  tableId: TodoTableId
}

const noTableErrorMsg = 'TodoTable component should have an appropriate table entity.';

export default function TodoTable(props: ITodoTableProps) {
  const { tableId } = props;

  const table = useAppSelector(state => selectTableById(state, tableId));
  if (!table)
    throw new Error(noTableErrorMsg);

  const listIds = useAppSelector(state => selectTodoListIdsByTable(state, tableId));

  let listContent: Array<any> = [];

  if (listIds.length > 0) {
    listContent = listIds.map(listId =>
      <TodoList key={listId} listId={listId} />);
  }

  listContent.push(
    <TodoListCreator key='listCreator' tableId={tableId} />
  );

  return (
    <div className='v-stack bg-light pb-3'>
      <div className='p-2'>
        <h1 className='ms-3 fs-2'>{table.name}</h1>
      </div>
      <div className='container'>
        <div className='row gy-4 row-cols-2 row-cols-md-3 row-cols-lg-5'>
          {listContent}
        </div>
      </div>
    </div>
  )
}
