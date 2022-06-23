import { nanoid } from '@reduxjs/toolkit';

import { ITodoColumn } from '../../../models/ITodoColumn';
import table from './mockTodoTable';
import { getTitle } from '../../../services/Lorem';

const mockColumns: Array<ITodoColumn> = [];
const columnsCount = 5;

for (let i = 0; i < columnsCount; i++) {
    const column: ITodoColumn = {
        columnId: nanoid(),
        tableId: table.tableId,
        name: getTitle()
    }

    mockColumns.push(column);
}

export default mockColumns;
