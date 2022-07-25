import React from 'react';
import { nanoid } from '@reduxjs/toolkit';
import {
  getByTestId as g_getByTestId,
  Matcher,
  MatcherOptions,
  RenderResult,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { act } from 'react-dom/test-utils';
import Main from '../components/main/Main';
import { TablePlaceholder_Spinner_TestId } from '../components/main/table/TablePlaceholder/TablePlaceholder';
import { CreateTodoExpanderOpenBtn_TestId } from '../components/main/todos/CreateTodoExpander';
import { CreateTodoForm_CreateBtn_TestId, CreateTodoForm_TestId, CreateTodoForm_TodoTitle_TestId } from '../components/main/todos/CreateTodoForm';
import { TodoCard_OpenEditForm_TestId, TodoCard_TestId, TodoCard_Title_TestId } from '../components/main/todos/TodoCard/TodoCard';
import makeServer from '../mocks/api/mirageApi';
import renderWithProviders from '../utils/test-utils';
import {
  EditTodoForm_DeleteBtn_TestId,
  EditTodoForm_TitleInput_TestId,
  EditTodoForm_SaveBtn_TestId,
  EditTodoForm_DescriptionInput_TestId,
  EditTodoForm_TestId,
} from '../components/main/todos/EditTodoForm/EditTodoForm';

let app: RenderResult;
let server: ReturnType<typeof makeServer>;

beforeEach(async () => {
  server = await makeServer({ environment: 'test' });
});

afterEach(() => {
  app?.unmount();
  server?.shutdown();
});

async function renderMainComponent() {
  app = await renderWithProviders(<Main />);
  return app;
}

async function waitForTableSpinnerWillToBeRemoved(
  getByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement,
) {
  await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
  await waitForElementToBeRemoved(() => getByTestId(TablePlaceholder_Spinner_TestId));
}

async function sleep(milliseconds: number) {
  const ms = (milliseconds < 0) ? 0 : milliseconds;
  await act(() => new Promise((res) => { setTimeout(res, ms); }));
}

describe('todos CRUD tests', () => {
  it('shows todos when list just loaded', async () => {
    const table = server.create('table');
    const list = server.create('list');
    const todos = server.createList('todo', 4);

    list.update('tableId', table.id);
    for (let i = 0; i < todos.length; i += 1) {
      todos[i].update('listId', list.id);
    }

    await renderMainComponent();
    const { getByTestId, findAllByTestId } = app;

    await waitForTableSpinnerWillToBeRemoved(getByTestId);

    const todosCards = await findAllByTestId(TodoCard_TestId);
    expect(todosCards).toHaveLength(4);

    for (let i = 0; i < todosCards.length; i += 1) {
      const card = todosCards[i];
      expect(g_getByTestId(card, TodoCard_Title_TestId)).toHaveTextContent(todos[i].title);
    }
  });

  it('creates a new todo by todo create form.', async () => {
    const table = server.create('table');
    const list = server.create('list');
    list.update('tableId', table.id);

    await renderMainComponent();
    const { getByTestId, findByTestId, queryByTestId } = app;

    await waitForTableSpinnerWillToBeRemoved(getByTestId);

    const newTodoTitle = nanoid();
    await userEvent.click(await findByTestId(CreateTodoExpanderOpenBtn_TestId));
    await userEvent.clear(getByTestId(CreateTodoForm_TodoTitle_TestId));
    await userEvent.type(getByTestId(CreateTodoForm_TodoTitle_TestId), newTodoTitle);
    await userEvent.click(getByTestId(CreateTodoForm_CreateBtn_TestId));

    await sleep(50);

    expect(queryByTestId(CreateTodoForm_TestId)).toBeNull();
    expect(getByTestId(TodoCard_TestId)).toBeInTheDocument();
    expect(getByTestId(TodoCard_Title_TestId)).toHaveTextContent(newTodoTitle);

    const todos = server.schema.all('todo').models;
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe(newTodoTitle);
  });

  it('doesn\'t create a new todo because title is invalid.', async () => {
    const table = server.create('table');
    const list = server.create('list');
    list.update('tableId', table.id);

    await renderMainComponent();
    const { getByTestId, findByTestId } = app;

    await waitForTableSpinnerWillToBeRemoved(getByTestId);

    await userEvent.click(await findByTestId(CreateTodoExpanderOpenBtn_TestId));
    await userEvent.clear(getByTestId(CreateTodoForm_TodoTitle_TestId));
    await userEvent.click(getByTestId(CreateTodoForm_CreateBtn_TestId));

    const todoForm = getByTestId(CreateTodoForm_TestId);
    expect(todoForm).toBeInTheDocument();
    expect(todoForm.querySelector('.is-invalid')).toBeInTheDocument();

    const todos = server.schema.all('todo').models;
    expect(todos).toHaveLength(0);
  });

  it('remove one todo when there is one todo in the list', async () => {
    const table = server.create('table');
    const list = server.create('list');
    const todo = server.create('todo');
    list.update('tableId', table.id);
    todo.update('listId', list.id);

    await renderMainComponent();
    const { getByTestId, findByTestId, queryByTestId } = app;

    await waitForTableSpinnerWillToBeRemoved(getByTestId);

    await userEvent.click(await findByTestId(TodoCard_OpenEditForm_TestId));
    await userEvent.click(getByTestId(EditTodoForm_DeleteBtn_TestId));

    expect(queryByTestId(TodoCard_TestId)).toBeNull();
  });

  it('remove one todo when there are many todos in the list', async () => {
    const table = server.create('table');
    const list = server.create('list');
    const todos = server.createList('todo', 5);

    expect(todos.length).toBeGreaterThan(1);

    list.update('tableId', table.id);
    for (let i = 0; i < todos.length; i += 1) {
      todos[i].update('listId', list.id);
    }

    const todoForRemoveIndex = 2;
    const todoForRemove = todos[todoForRemoveIndex];

    await renderMainComponent();
    const { getByTestId, findAllByTestId } = app;

    await waitForTableSpinnerWillToBeRemoved(getByTestId);

    const todosCards = await findAllByTestId(TodoCard_TestId);
    expect(todosCards).toHaveLength(todos.length);

    const cardForRemove = todosCards[todoForRemoveIndex];
    await userEvent.click(g_getByTestId(cardForRemove, TodoCard_OpenEditForm_TestId));
    await userEvent.click(g_getByTestId(cardForRemove, EditTodoForm_DeleteBtn_TestId));

    const newTodosCards = await findAllByTestId(TodoCard_TestId);
    expect(newTodosCards).toHaveLength(todos.length - 1);

    for (let i = 0; i < newTodosCards.length; i += 1) {
      const card = newTodosCards[i];
      expect(g_getByTestId(card, TodoCard_Title_TestId))
        .not.toHaveTextContent(todoForRemove.title);
    }

    const newTodosInServer = server.schema.all('todo').models;
    expect(newTodosInServer).toHaveLength(todos.length - 1);

    for (let i = 0; i < newTodosInServer.length; i += 1) {
      const todo = newTodosInServer[i];
      expect(todo.id).not.toBe(todoForRemove.id);
    }
  });

  it('should update a todo by todo edit form', async () => {
    const table = server.create('table');
    const list = server.create('list');
    const todo = server.create('todo');
    list.update('tableId', table.id);
    todo.update('listId', list.id);

    await renderMainComponent();
    const { getByTestId, findByTestId } = app;

    await waitForTableSpinnerWillToBeRemoved(getByTestId);

    const newTodoTitle = nanoid();
    const newTodoDescription = nanoid();

    await userEvent.click(await findByTestId(TodoCard_OpenEditForm_TestId));
    await userEvent.clear(getByTestId(EditTodoForm_TitleInput_TestId));
    await userEvent.type(getByTestId(EditTodoForm_TitleInput_TestId), newTodoTitle);
    await userEvent.clear(getByTestId(EditTodoForm_DescriptionInput_TestId));
    await userEvent.type(getByTestId(EditTodoForm_DescriptionInput_TestId), newTodoDescription);
    await userEvent.click(getByTestId(EditTodoForm_SaveBtn_TestId));

    await sleep(25);

    expect(getByTestId(TodoCard_Title_TestId)).toHaveTextContent(newTodoTitle);

    const newTodosInServer = server.schema.all('todo').models;
    expect(newTodosInServer).toHaveLength(1);

    const newTodo = newTodosInServer[0];
    expect(newTodo.title).toBe(newTodoTitle);
    expect(newTodo.description).toBe(newTodoDescription);
  });

  it('shouldn\'t update a todo because title is invalid', async () => {
    const table = server.create('table');
    const list = server.create('list');
    const todo = server.create('todo');
    list.update('tableId', table.id);
    todo.update('listId', list.id);

    await renderMainComponent();
    const { getByTestId, findByTestId } = app;

    await waitForTableSpinnerWillToBeRemoved(getByTestId);

    const newTodoDescription = nanoid();

    await userEvent.click(await findByTestId(TodoCard_OpenEditForm_TestId));
    await userEvent.clear(getByTestId(EditTodoForm_TitleInput_TestId));
    await userEvent.clear(getByTestId(EditTodoForm_DescriptionInput_TestId));
    await userEvent.type(getByTestId(EditTodoForm_DescriptionInput_TestId), newTodoDescription);
    await userEvent.click(getByTestId(EditTodoForm_SaveBtn_TestId));

    expect(getByTestId(EditTodoForm_TestId)).toBeInTheDocument();
    expect(getByTestId(EditTodoForm_TestId).querySelector('.is-invalid')).toBeInTheDocument();

    const newTodosInServer = server.schema.all('todo').models;
    expect(newTodosInServer).toHaveLength(1);

    const newTodo = newTodosInServer[0];
    expect(newTodo.title).toBe(todo.title);
    expect(newTodo.description).toBe(todo.description);
  });
});
