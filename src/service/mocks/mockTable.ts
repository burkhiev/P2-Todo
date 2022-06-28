import { nanoid } from '@reduxjs/toolkit';

import { ITodoTable } from '../../models/ITodoTable';
import { getTitle } from '../Lorem';

const mockTable: ITodoTable = {
  tableId: nanoid(),
  name: getTitle(),
};

export default mockTable;
