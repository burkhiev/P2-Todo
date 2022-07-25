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
import { ITodoList, TodoListId } from '../../models/ITodoList';
import InvalidOperationError from '../../service/errors/InvalidOperationError';
import ITodoListResource from '../../models/json-api-models/ITodoListResource';
import { MAX_POSITION_FRACTION_DIGITS_NUMBER, POSITION_STEP } from '../../service/Consts';
import { ITodo } from '../../models/ITodo';
import ITodoResource from '../../models/json-api-models/ITodoResource';
import IMoveTodoResource from '../../models/json-api-models/IMoveTodoResource';
import MathService from '../../service/MathService';
import { getListNewPosition as getNewListPosition, getNewTodoPosition } from '../../store/api/apiHelpers';
import IMoveTodoPayload from '../../models/IMoveTodoPayload';
import IMoveListPayload from '../../models/IMoveListPayload';
import OutOfRangeError from '../../service/errors/OutOfRangeError';

export const MIRAGE_URL = 'http://127.0.0.1:5500';
export const MIRAGE_NAMESPACE = 'api';
export const MIRAGE_DELAY = 200;

const MAX_TABLE_IDS_COUNT = 50;
const MAX_LIST_IDS_COUNT = 100;
const TABLES_COUNT = 5;
const LISTS_COUNT = 30;
const TODOS_COUNT = 60;
const tableIds: TodoTableId[] = [];
const listIds: TodoListId[] = [];

for (let i = 0; i < MAX_TABLE_IDS_COUNT; i += 1) {
  tableIds.push(nanoid());
}

for (let i = 0; i < MAX_LIST_IDS_COUNT; i += 1) {
  listIds.push(nanoid());
}

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

    const table = schema.find('table', id);
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
    const { data }: { data: IMoveListPayload } = JSON.parse(request.requestBody);
    const {
      tableId, srcIndex, destIndex,
    } = data;

    const table = schema.find('table', tableId);

    if (!table) {
      throw new InvalidDataError('Invalid table ID.');
    }

    const lists = schema.all('list')
      .filter((l) => l.tableId === tableId)
      .sort((a, b) => a.position - b.position)
      .models;

    const list = lists[srcIndex];

    if (list.id !== lists[srcIndex].id) {
      throw new InvalidDataError('Invalid list ID.');
    }

    if (
      srcIndex < 0 || lists.length <= srcIndex
      || destIndex < 0 || lists.length <= destIndex
    ) {
      throw new OutOfRangeError('Invalid "srcIndex" or "destIndex".');
    }

    const newPos = getNewListPosition(lists, data);

    if (!newPos) {
      return { data: [] };
    }

    if (MathService.countOfFractionalPartNumbers(newPos) <= MAX_POSITION_FRACTION_DIGITS_NUMBER) {
      list.update('position', newPos);
      const { id, attrs } = list;

      const resource: ITodoListResource = {
        type: 'list',
        id,
        attributes: attrs,
      };

      return { data: [resource] };
    }

    const resources: ITodoListResource[] = [];
    list.update('position', newPos);
    lists.sort((a, b) => a.position - b.position);

    for (let i = 0; i < lists.length; i += 1) {
      const curList = lists[i];
      curList.update('position', (i + 1) * POSITION_STEP);

      const { id, attrs } = curList;

      resources.push({
        type: 'list',
        id,
        attributes: attrs,
      });
    }

    return { data: resources };
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

// eslint-disable-next-line no-use-before-define
function configureTodosEndpoints(server: MockServer) {
  server.get('todo');

  server.get('todo/:listid', (schema, request) => {
    const listId = request.params.listid as TodoListId;

    const todos = schema.all<'todo'>('todo').filter((todo) => todo.listId === listId);

    return todos;
  });

  server.post('todo', (schema, request) => {
    const { data }: { data: ITodoResource } = JSON.parse(request.requestBody);
    const { attributes } = data;

    if (!attributes) {
      throw new InvalidDataError('[post/todo]: There are no attributes.');
    }

    if (!attributes.title) {
      throw new InvalidDataError('[post/todo]: Invalid todo title received.');
    }

    if (!attributes.listId) {
      throw new InvalidDataError('[post/todo]: Invalid todo listId received.');
    }

    const todos = schema.all('todo').filter((t) => t.listId === attributes.listId).models;
    const lastPosition = todos.reduce((prev, t) => Math.max(prev, t.position), 0);

    const newTodo: ITodo = {
      ...attributes,
      id: nanoid(),
      addedAt: (new Date()).toISOString(),
      position: lastPosition + POSITION_STEP,
    };

    const entity = schema.create('todo', newTodo);
    return entity;
  });

  server.put('todo', (schema, request) => {
    const { data }: { data: ITodoResource } = JSON.parse(request.requestBody);
    const { id, attributes: attrs } = data;

    const entity = schema.find('todo', id);
    const lists = schema.all('list').models;

    if (!entity) {
      throw new InvalidDataError('[put/todo]: There are no todo for received id.');
    }

    if (!attrs) {
      throw new InvalidDataError('[put/todo]: There are no attributes for todo.');
    }

    if (!attrs.listId || !lists.find((l) => l.id === attrs.listId)) {
      throw new InvalidDataError('[put/todo]: Invalid todo listId received.');
    }

    if (!attrs.position) {
      throw new InvalidDataError('[put/todo]: Invalid todo position received.');
    }

    if (!attrs.title) {
      throw new InvalidDataError('[put/todo]: Invalid todo title received.');
    }

    entity.update('title', attrs.title);
    entity.update('description', attrs.description);
    entity.update('listId', attrs.listId);
    entity.update('position', attrs.position);
    entity.save();

    return entity;
  });

  server.patch('move-todo', (schema, request) => {
    const { data }: { data: IMoveTodoResource } = JSON.parse(request.requestBody);
    const { id, attributes: attrs } = data;

    const todo = schema.find('todo', id);

    if (!todo) {
      throw new InvalidDataError('[patch/move-todo]: There are no todo for received id.');
    }

    if (!attrs) {
      throw new InvalidDataError('[patch/move-todo]: There are no attributes for todo.');
    }

    const lists = schema.all('list').models;
    const {
      destIndex, destListId, srcIndex, srcListId,
    } = attrs;

    if (!lists.some((l) => l.id === destListId)) {
      throw new InvalidDataError('[patch/move-todo]: Invalid destinationListId received.');
    }

    const todos = schema.all('todo').models;

    if (destIndex < 0 || todos.length < destIndex) {
      throw new InvalidDataError('[patch/move-todo]: Invalid destinationIndex received.');
    }

    const moveInfos: IMoveTodoPayload = {
      todoId: data.id,
      ...data.attributes,
    };

    const newPos = getNewTodoPosition(todos, moveInfos);

    if (!newPos) {
      return { data: [] };
    }

    let result: ITodoResource[] = [];

    if (MathService.countOfFractionalPartNumbers(newPos) <= MAX_POSITION_FRACTION_DIGITS_NUMBER) {
      todo.listId = destListId;
      todo.position = newPos;
      todo.save();

      const { id: todoId, ...attributes } = todo.attrs;
      const resource: ITodoResource = {
        id: todoId,
        type: 'todo',
        attributes,
      };

      result = [resource];
    } else {
      const destTodos = todos
        .filter((t) => t.listId === destListId)
        .sort((a, b) => a.position - b.position);

      if (srcListId === destListId) {
        destTodos.splice(srcIndex, 1);

        if (srcIndex < destIndex) {
          if (destIndex === destTodos.length) {
            destTodos.push(todo);
          } else {
            destTodos.splice(destIndex, 0, todo);
          }
        }
      } else {
        destTodos.splice(destIndex, 0, todo);
      }

      for (let i = 0; i < todos.length; i += 1) {
        const t = todos[i];

        t.listId = destListId;
        t.position = (i + 1) * POSITION_STEP;
        t.save();

        const { id: todoId, ...attributes } = t.attrs;
        const resource: ITodoResource = {
          id: todoId,
          type: 'todo',
          attributes,
        };

        result.push(resource);
      }
    }

    // console.log('[patch/move-todo]: result =', result);

    return { data: result };
  });

  server.delete('todo', (schema, requestInfo) => {
    const request: { data: ITodoResource } = JSON.parse(requestInfo.requestBody);
    const { data: { id } } = request;

    const entity = schema.find('todo', id);
    if (!entity) {
      throw new InvalidDataError('[todo/delete]: Invalid todo id received.');
    }

    entity.destroy();

    const data: ITodoResource = {
      id: entity.id,
      type: 'todo',
    };

    return { data };
  });
}

export default function makeServer({ environment = 'development' }) {
  // eslint-disable-next-line no-console

  return createServer({
    environment,

    models: {
      table: Model.extend<Partial<ITodoTable>>({}),
      list: Model.extend<Partial<ITodoList>>({}),
      todo: Model.extend<Partial<ITodo>>({}),
    },

    factories: {
      table: Factory.extend<ITodoTable>({
        id(i) {
          if (tableIds.length === 0) {
            throw new InvalidOperationError('List cannot exist without table.');
          }
          return tableIds[i];
        },
        name: () => firstToUpperCase(faker.science.chemicalElement().name),
      }),

      list: Factory.extend<ITodoList>({
        id: (i) => {
          if (tableIds.length === 0) {
            throw new InvalidOperationError('List cannot exist without table.');
          }
          return listIds[i];
        },
        title: () => firstToUpperCase(faker.company.companyName()),
        tableId() {
          if (tableIds.length === 0) {
            throw new InvalidOperationError('List cannot exist without table.');
          }

          const index = faker.mersenne.rand(0, TABLES_COUNT);
          return tableIds[index];
        },
        position: (i) => i * POSITION_STEP,
      }),

      todo: Factory.extend<ITodo>({
        id: () => nanoid(),
        title: () => firstToUpperCase(faker.lorem.sentence(faker.mersenne.rand(2, 5))),
        addedAt: () => faker.date.recent().toISOString(),
        position: (i) => (i + 1) * POSITION_STEP,
        description: () => faker.lorem.sentence(faker.mersenne.rand(0, 10)),
        listId: () => {
          if (listIds.length === 0) {
            throw new InvalidDataError('Todo cannot exists without list.');
          }

          const index = faker.mersenne.rand(0, LISTS_COUNT);
          return listIds[index];
        },
      }),
    },

    seeds(server) {
      server.createList('table', TABLES_COUNT);
      server.createList('list', LISTS_COUNT);
      server.createList('todo', TODOS_COUNT);
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
      configureTodosEndpoints(this);
    },
  });
}

type MockServer = ReturnType<typeof makeServer>;
