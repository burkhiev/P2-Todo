import React from 'react';
import {
  RenderResult,
  waitFor,
  waitForElementToBeRemoved,
  getByTestId as g_getByTestId,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { nanoid } from '@reduxjs/toolkit';
import renderWithProviders from '../utils/test-utils';
import Main from '../components/main/Main';
import { TablePlaceholder_Spinner_TestId } from '../components/main/table/TablePlaceholder/TablePlaceholder';
import { ListCreatorExpander_TestId } from '../components/main/lists/ListCreator/ListCreatorExpander';
import { List_TestId } from '../components/main/lists/List/List';
import makeServer from '../mocks/api/mirageApi';
import { ListOptionsDeleteBtn_TestId, ListOptionsOpenBtn_TestId } from '../components/main/lists/ListOptions/ListOptions';
import { ListTitleOpenEditorBtn_TestId, ListTitle_Title_TestId } from '../components/main/lists/ListTitle/ListTitle';
import { ListTitleEditor_Input_TestId, ListTitleEditor_TestId } from '../components/main/lists/ListTitle/ListTitleEditor';
import {
  CreateListForm_CreateBtn_TestId,
  CreateListForm_TitleInput_TestId,
  CreateListForm_TestId,
} from '../components/main/lists/ListCreator/CreateListForm';

let server: ReturnType<typeof makeServer>;
let app: RenderResult;

beforeEach(async () => {
  server = makeServer({ environment: 'test' });
});

afterEach(() => {
  app?.unmount();
  server?.shutdown();
});

async function renderTestApp() {
  app = await renderWithProviders(<Main />);
}

describe('lists CRUD testing', () => {
  it('should show 4 lists on the table view', async () => {
    const table = server.create('table');
    const lists = server.createList('list', 4);

    for (let i = 0; i < lists.length; i += 1) {
      lists[i].update('tableId', table.id);
    }

    await renderTestApp();
    const { getByTestId, findAllByTestId } = app;

    await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
    await waitForElementToBeRemoved(getByTestId(TablePlaceholder_Spinner_TestId));

    const listComponents = await findAllByTestId(List_TestId);
    expect(listComponents).toHaveLength(4);

    lists.sort((a, b) => a.position - b.position);
    lists.forEach((list, index) => {
      expect(g_getByTestId(listComponents[index], ListTitle_Title_TestId))
        .toHaveTextContent(list.title);
    });
  });

  it('should add new list by list form', async () => {
    server.create('table');

    await renderTestApp();
    const {
      getByTestId, findByTestId, findAllByTestId, getByText,
    } = app;

    await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
    await waitForElementToBeRemoved(getByTestId(TablePlaceholder_Spinner_TestId));

    const openListFormBtnId = ListCreatorExpander_TestId;
    const listTitleId = CreateListForm_TitleInput_TestId;
    const createBtnId = CreateListForm_CreateBtn_TestId;
    const listTitleText = 'SOME_LIST_TITLE';

    await userEvent.click(await findByTestId(openListFormBtnId));
    await userEvent.type(getByTestId(listTitleId), listTitleText);

    const createBtn = getByTestId(createBtnId);
    await userEvent.click(createBtn);
    await waitForElementToBeRemoved(createBtn);

    const lists = server.schema.all('list');
    expect(lists.length).toBe(1);

    const list = lists.models[0];
    const listsElems = await findAllByTestId(List_TestId);
    const listTitleElem = getByText(listTitleText);

    expect(listsElems.length).toBe(1);
    expect(listsElems[0].id).toBe(list.id);
    expect(listTitleElem).not.toBeNull();
  });

  it('shouldn\'t add new list because title is empty', async () => {
    server.create('table');

    await renderTestApp();
    const { getByTestId, findByTestId } = app;

    await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
    await waitForElementToBeRemoved(getByTestId(TablePlaceholder_Spinner_TestId));

    await userEvent.click(await findByTestId(ListCreatorExpander_TestId));
    await userEvent.click(getByTestId(CreateListForm_CreateBtn_TestId));

    const form = getByTestId(CreateListForm_TestId);
    expect(form).not.toBeNull();

    const invalidElem = form.querySelector('.is-invalid');
    expect(invalidElem).not.toBeNull();

    const lists = server.schema.all('list');
    expect(lists.length).toBe(0);
  });

  it('should delete one list delete option button', async () => {
    const table = server.create('table');
    const list = server.create('list');

    list.tableId = table.id;
    list.save();

    await renderTestApp();
    const { getByTestId, findByTestId, queryByTestId } = app;

    await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
    await waitForElementToBeRemoved(getByTestId(TablePlaceholder_Spinner_TestId));

    await userEvent.click(await findByTestId(ListOptionsOpenBtn_TestId));
    await userEvent.click(getByTestId(ListOptionsDeleteBtn_TestId));

    let listElem = queryByTestId(List_TestId);
    if (listElem) {
      await waitForElementToBeRemoved(listElem);
      listElem = queryByTestId(List_TestId);
    }
    expect(listElem).toBeNull();

    const lists = server.schema.all('list');
    expect(lists.models.length).toBe(0);
  });

  it('should show new list title if it change by entering on list title clicking form', async () => {
    const table = server.create('table');
    const list = server.create('list');

    list.tableId = table.id;
    list.save();

    await renderTestApp();
    const { getByTestId, findByTestId, findByText } = app;

    await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
    await waitForElementToBeRemoved(getByTestId(TablePlaceholder_Spinner_TestId));

    await waitFor(() => findByTestId(ListTitleOpenEditorBtn_TestId));
    const openBtn = getByTestId(ListTitleOpenEditorBtn_TestId);
    await userEvent.click(openBtn);

    const newTitle = nanoid();
    const titleInput = getByTestId(ListTitleEditor_Input_TestId);

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, newTitle);
    await userEvent.keyboard('{enter}');

    await waitForElementToBeRemoved(titleInput);

    const newLists = server.schema.all('list').models;
    expect(newLists.length).toBe(1);

    const newList = newLists[0];
    expect(newList.title).toBe(newTitle);
    expect(await findByText(newTitle)).not.toBeNull();
  });

  it('should doesn\'t update list title if it\'s invalid (empty).', async () => {
    const table = server.create('table');
    const list = server.create('list');

    list.tableId = table.id;
    list.save();

    const oldTitle = list.title;

    await renderTestApp();
    const { getByTestId, findByTestId } = app;

    await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
    await waitForElementToBeRemoved(getByTestId(TablePlaceholder_Spinner_TestId));

    await waitFor(() => findByTestId(List_TestId));
    const openBtn = getByTestId(ListTitleOpenEditorBtn_TestId);
    await userEvent.click(openBtn);

    await userEvent.clear(getByTestId(ListTitleEditor_Input_TestId));
    await userEvent.keyboard('{enter}');

    const listElem = getByTestId(ListTitleEditor_TestId);
    const invalidInput = listElem.querySelector('.is-invalid');
    expect(invalidInput).not.toBeNull();

    const newLists = server.schema.all('list').models;
    expect(newLists.length).toBe(1);

    const newList = newLists[0];
    expect(newList.title).toBe(oldTitle);
  });
});
