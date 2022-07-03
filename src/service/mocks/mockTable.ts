import { nanoid } from '@reduxjs/toolkit';

import { ITodoTable } from '../../models/ITodoTable';
import { getTitle } from '../Lorem';

const tablesCount = 5;
const tables: ITodoTable[] = [];

for (let i = 0; i < tablesCount; i += 1) {
  const table: ITodoTable = {
    tableId: nanoid(),
    name: getTitle(),
  };

  tables.push(table);
}

export default tables;
