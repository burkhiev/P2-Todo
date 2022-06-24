import React from 'react';

import './table.css';

import List from '../lists/List';
import { TodoTableId } from '../../../models/ITodoTable';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { selectTableById } from '../../../store/todo/tableSlice';
import { selectTodoListIdsByTable } from '../../../store/todo/listSlice';
import CreateListExpander from '../lists/CreateListExpander';

interface ITableProps {
  tableId: TodoTableId
}

const noTableErrorMsg = 'TodoTable component should have an appropriate table entity.';

export default function Table(props: ITableProps) {
  const { tableId } = props;

  const table = useAppSelector((state) => selectTableById(state, tableId));
  if (!table) {
    throw new Error(noTableErrorMsg);
  }

  const listIds = useAppSelector((state) => selectTodoListIdsByTable(state, tableId));

  let listContent: Array<JSX.Element> = [];

  if (listIds.length > 0) {
    listContent = listIds.map((listId) => <List key={listId} listId={listId} />);
  }

  return (
    <div className="v-stack border pb-3 current-table">
      <div className="p-2">
        <h1 className="ms-3 mt-2 mb-5 fs-3">{table.name}</h1>
      </div>
      <div className="container">
        <div className="row gy-4 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
          {listContent}
          <CreateListExpander tableId={tableId} />
        </div>
      </div>
    </div>
  );
}
