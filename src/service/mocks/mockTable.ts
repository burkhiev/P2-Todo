import { nanoid } from '@reduxjs/toolkit';
import { faker } from '@faker-js/faker';

import { ITodoTable } from '../../models/ITodoTable';
import { firstToUpperCase } from '../StringFunctions';

const tablesCount = 3;
const tables: ITodoTable[] = [];

for (let i = 0; i < tablesCount; i += 1) {
  const newName = faker.science.chemicalElement().name;

  const table: ITodoTable = {
    id: nanoid(),
    name: firstToUpperCase(newName),
  };

  tables.push(table);
}

export default tables;
