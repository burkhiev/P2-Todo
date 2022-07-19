import { faker } from '@faker-js/faker';
import { nanoid } from '@reduxjs/toolkit';
import {
  createServer,
  Factory,
  JSONAPISerializer,
  Model,
} from 'miragejs';

import { ITodoTable, TodoTableId } from '../../models/ITodoTable';
import firstToUpperCase from '../../service/StringFunctions';
import ITodoTableResource from '../../models/json-api-models/ITodoTableResource';
import InvalidDataError from '../../service/errors/InvalidDataError';
import { ITodoList } from '../../models/ITodoList';
import InvalidOperationError from '../../service/errors/InvalidOperationError';
import ITodoListResource from '../../models/json-api-models/ITodoListResource';
import { POSITION_STEP } from '../../service/Consts';

export const MIRAGE_URL = 'http://127.0.0.1:5500';
export const MIRAGE_NAMESPACE = 'api';
export const MIRAGE_DELAY = 200;

const tableIds: TodoTableId[] = [];

// eslint-disable-next-line no-use-before-define
function configureTablesEndpoints(server: MockServer) {
  server.get('table');

  server.post('table', (schema, request) => {
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

  server.put('table', (schema, request) => {
    const { data }: { data: ITodoTableResource } = JSON.parse(request.requestBody);
    const { id, attributes } = data;

    const table = schema.find('table', id);

    if (!table) {
      throw new InvalidDataError('[table.put] - Invalid table id is received.');
    }

    if (!attributes?.name) {
      throw new InvalidDataError('[table.put] - Invalid table name is received.');
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

  server.delete('table', (schema, request) => {
    const { data }: { data: ITodoTableResource } = JSON.parse(request.requestBody);
    const { id } = data;

    const table = schema.find('table', data.id);
    table?.destroy();

    return { data: { id } };
  });
}

// eslint-disable-next-line no-use-before-define
function configureListsEndpoints(server: MockServer) {
  server.get('list');

  server.post('list', (schema, request) => {
    const { data }: { data: ITodoListResource } = JSON.parse(request.requestBody);
    const { attributes } = data;

    if (!attributes || !attributes.title) {
      throw new InvalidDataError('[list.post] - There is no name for table.');
    }

    const newList: ITodoList = {
      id: nanoid(),
      ...attributes,
    };

    const result = schema.create('list', newList);
    result.save();

    return result;
  });

  server.put('list', (schema, request) => {
    const { data }: { data: ITodoListResource } = JSON.parse(request.requestBody);
    const { id, attributes } = data;

    const list = schema.find('list', id);

    if (!list) {
      throw new InvalidDataError('[list.put] - Invalid list id is received.');
    }

    const invalidTableId = !attributes?.tableId
      || tableIds.every((tableId) => tableId !== attributes.tableId);
    if (invalidTableId) {
      throw new InvalidDataError('[list.put] - Invalid table id is received.');
    }

    if (!attributes?.title) {
      throw new InvalidDataError('[list.put] - Invalid list title is received.');
    }

    list.update({ id, ...attributes });
    list.save();

    const result: ITodoListResource = {
      type: 'list',
      id,
      attributes,
    };

    return { data: result };
  });

  server.put('move-lists', (schema, request) => {
    const { data }: { data: ITodoListResource[] } = JSON.parse(request.requestBody);

    const results: ITodoListResource[] = [];
    const updatedLists: any[] = [];

    for (let i = 0; i < data.length; i += 1) {
      const { id, attributes } = data[i];

      const list = schema.find('list', id);

      if (!list) {
        throw new InvalidDataError('[list.put] - Invalid list id is received.');
      }

      const invalidTableId = !attributes?.tableId
        || tableIds.every((tableId) => tableId !== attributes.tableId);
      if (invalidTableId) {
        throw new InvalidDataError('[list.put] - Invalid table id is received.');
      }

      if (!attributes?.title) {
        throw new InvalidDataError('[list.put] - Invalid list title is received.');
      }

      list.update({ id, ...attributes });
      updatedLists.push(list);

      results.push({
        type: 'list',
        id,
        attributes,
      });
    }

    for (let i = 0; i < updatedLists.length; i += 1) {
      updatedLists[i].save();
    }

    // let result: AnyResponse = { id: nanoid() };
    return { data: results };
  });

  server.delete('list', (schema, request) => {
    const { data }: { data: ITodoListResource } = JSON.parse(request.requestBody);
    const { id } = data;

    const list = schema.find('list', id);

    if (!list) {
      throw new InvalidDataError('[list.put] - Invalid list id is received.');
    }

    list.destroy();

    return { data: { id } };
  });
}

export default function makeServer({ environment = 'development' }) {
  // eslint-disable-next-line no-console
  // console.info('creating mirage server...');

  return createServer({
    environment,

    models: {
      table: Model.extend<Partial<ITodoTable>>({}),
      list: Model.extend<Partial<ITodoList>>({}),
    },

    factories: {
      table: Factory.extend<ITodoTable>({
        id() {
          const tId = nanoid();
          tableIds.push(tId);
          return tId;
        },
        name() {
          return firstToUpperCase(faker.science.chemicalElement().name);
        },
      }),
      list: Factory.extend<ITodoList>({
        id() {
          return nanoid();
        },
        title() {
          return firstToUpperCase(faker.company.companyName());
        },
        tableId() {
          if (tableIds.length === 0) {
            throw new InvalidOperationError('List cannot exist without table.');
          }
          const index = faker.mersenne.rand(0, tableIds.length);
          return tableIds[index];
        },
        position(i) {
          return i * POSITION_STEP;
        },
      }),
    },

    seeds(server) {
      server.createList('table', 3);
      server.createList('list', 20);
    },

    serializers: {
      application: JSONAPISerializer.extend({
        keyForAttribute: (attr) => attr,
      }),
    },

    routes() {
      this.urlPrefix = MIRAGE_URL;
      this.namespace = MIRAGE_NAMESPACE;
      this.timing = MIRAGE_DELAY;

      configureTablesEndpoints(this);
      configureListsEndpoints(this);
    },
  });
}

type MockServer = ReturnType<typeof makeServer>;
