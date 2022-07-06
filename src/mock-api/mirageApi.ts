import { faker } from '@faker-js/faker';
import { nanoid } from '@reduxjs/toolkit';
import {
  createServer, Factory, Model, RestSerializer,
} from 'miragejs';
import { ITodoTable, TodoTableId } from '../models/ITodoTable';

import firstToUpperCase from '../service/StringFunctions';

interface IMirageError {
  data: {
    message: string,
    stack: string
  },
  status: number
}

export default function makeServer({ environment = 'development' }) {
  // eslint-disable-next-line no-console
  console.info('creating mirage server...');

  return createServer({
    environment,

    models: {
      table: Model.extend<Partial<ITodoTable>>({}),
    },

    factories: {
      table: Factory.extend<ITodoTable>({
        id() {
          return nanoid();
        },
        name() {
          return firstToUpperCase(faker.science.chemicalElement().name);
        },
      }),
    },

    seeds(server) {
      server.createList('table', 3);
    },

    serializers: {
      table: RestSerializer,
    },

    routes() {
      this.namespace = 'api';
      this.timing = 1000;

      this.get('table');

      this.post('table', (schema, request) => {
        schema.db.dump();

        const data: Omit<ITodoTable, 'id'> = JSON.parse(request.requestBody);
        const newTable: ITodoTable = {
          id: nanoid(),
          name: data.name,
        };

        return schema.create('table', newTable);
      });

      this.put('table', (schema, request) => {
        schema.db.dump();

        const { id, ...data }: ITodoTable = JSON.parse(request.requestBody);
        const table = schema.find('table', id);

        if (table) {
          table.update({ ...data });
          return table;
        }
        const error: IMirageError = {
          status: 500,
          data: {
            message: 'Invalid table id is received.',
            stack: 'table.put',
          },
        };
        return { error };
      });

      this.delete('table', (schema, request) => {
        schema.db.dump();

        const data: { id: TodoTableId } = JSON.parse(request.requestBody);
        const table = schema.find('table', data.id);

        table?.destroy();

        return {
          table: {
            id: data.id,
          },
        };
      });
    },
  });
}
