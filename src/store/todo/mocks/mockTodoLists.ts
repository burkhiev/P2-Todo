import { nanoid } from '@reduxjs/toolkit';

import { ITodoList } from '../../../models/ITodoList';
import table from './mockTodoTable';
import { getTitle } from '../../../services/Lorem';

const mockLists: Array<ITodoList> = [];
const listsCount = 4;

for (let i = 0; i < listsCount; i++) {
    const column: ITodoList = {
        listId: nanoid(),
        tableId: table.tableId,
        title: getTitle()
    }

    mockLists.push(column);
}

export default mockLists;
