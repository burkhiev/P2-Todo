import React, { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { INVALID_TABLE_ID } from '../../service/Consts';

import Table from './table/Table';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectAllTables } from '../../store/todo/tableSlice';
import Sidebar from './sidebar/Sidebar/Sidebar';
import { TodoTableId } from '../../models/ITodoTable';

export default function PageBody() {
  const tables = useAppSelector(selectAllTables);
  const defaultTable = (tables.length > 0) ? tables[0] : undefined;

  const [tableId, setTableId] = useState(defaultTable?.tableId);

  const selectTable = useCallback((id?: TodoTableId) => setTableId(id ?? INVALID_TABLE_ID), []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3">
            <Sidebar selectedTableId={tableId} selectTable={selectTable} />
          </div>
          <div className="col">
            <Table tableId={tableId} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
