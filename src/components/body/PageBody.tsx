import React from 'react';

import Table from '../todo/table/Table';
import table from '../../store/todo/mocks/mockTodoTable';

export default function PageBody() {
  return (
    <div className="container">
      Body
      <Table tableId={table.tableId} />
    </div>
  );
}
