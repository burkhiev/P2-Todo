import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Table from '../todo/table/Table';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectAllTables } from '../../store/todo/tableSlice';

export default function PageBody() {
  const tables = useAppSelector(selectAllTables);
  const table = tables[0];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        Body
        <Table tableId={table.tableId} />
      </div>
    </DndProvider>
  );
}
