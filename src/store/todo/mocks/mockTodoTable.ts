import { nanoid } from '@reduxjs/toolkit';

import { ITodoTable } from '../../../models/ITodoTable';
import { getTitle } from '../../../services/Lorem';

const mockTodoTable: ITodoTable = {
  tableId: nanoid(),
  name: getTitle(),
};

export default mockTodoTable;
