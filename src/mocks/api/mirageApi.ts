import {
  createServer,
  Factory,
  JSONAPISerializer,
  Model,
} from 'miragejs';
import { faker } from '@faker-js/faker';
import { nanoid } from '@reduxjs/toolkit';

import { ITodoTable } from '../../models/ITodoTable';
import firstToUpperCase from '../../service/StringFunctions';
import ITodoTableResource from '../../models/json-api-models/ITodoTableResource';
import InvalidDataError from '../../service/errors/InvalidDataError';

export const MIRAGE_URL = 'http://127.0.0.1:5500';
export const MIRAGE_NAMESPACE = 'api';
export const MIRAGE_DELAY = 200;

export default function makeServer({ environment = 'development' }) {
  // eslint-disable-next-line no-console
  // console.info('creating mirage server...');

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
      table: JSONAPISerializer,
    },

    routes() {
      this.urlPrefix = MIRAGE_URL;
      this.namespace = MIRAGE_NAMESPACE;
      this.timing = MIRAGE_DELAY;

      this.get('table');

      this.post('table', (schema, request) => {
        const { data }: { data: ITodoTableResource } = JSON.parse(request.requestBody);
        const { attributes } = data;

        if (!attributes || !attributes.name) {
          throw new InvalidDataError('[table.post] - There is no name for table.');
        }

        const newTable: ITodoTable = {
          id: nanoid(),
          ...attributes,
        };

        const result = schema.create('table', newTable);
        result.save();

        return result;
      });

      this.put('table', (schema, request) => {
        const { data }: { data: ITodoTableResource } = JSON.parse(request.requestBody);
        const { id, attributes } = data;

        const table = schema.find('table', id);

        if (!table) {
          throw new InvalidDataError('[table.post] - Invalid table id is received.');
        }

        if (!attributes?.name) {
          throw new InvalidDataError('[table.post] - Invalid table name is received.');
        }

        table.update({ id, name: attributes?.name ?? '' });
        table.save();

        const { attrs } = table;

        const result: ITodoTableResource = {
          type: 'table',
          id: attrs.id,
          attributes: { name: attrs.name },
        };

        return { data: result };
      });

      this.delete('table', (schema, request) => {
        const { data }: { data: ITodoTableResource } = JSON.parse(request.requestBody);
        const { id } = data;

        const table = schema.find('table', data.id);
        table?.destroy();

        return { data: { id } };
      });
    },
  });
}
