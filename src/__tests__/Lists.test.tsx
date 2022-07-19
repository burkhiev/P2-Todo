import React from 'react';
import { act } from 'react-dom/test-utils';
import {
  RenderResult,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { nanoid } from '@reduxjs/toolkit';
import renderWithProviders from '../utils/test-utils';
import Main from '../components/body/Main';
import { testId_TablePlaceholder_Spinner } from '../components/body/table/TablePlaceholder/TablePlaceholder';
import { ListCreatorExpander_TestId } from '../components/body/lists/ListCreator/ListCreatorExpander';
import { List_TestId } from '../components/body/lists/List/List';
import makeServer from '../mocks/api/mirageApi';
import { ListOptionsDeleteBtn_TestId, ListOptionsOpenBtn_TestId } from '../components/body/lists/ListOptions/ListOptions';
import { ListTitleOpenEditorBtn_TestId } from '../components/body/lists/ListTitle/ListTitle';
import { ListTitleEditor_TestId } from '../components/body/lists/ListTitle/ListTitleEditor';
import {
  CreateListForm_CreateBtn_TestId,
  CreateListForm_ListTitle_TestId,
  CreateListForm_TestId,
} from '../components/body/lists/ListCreator/CreateListForm';

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
  act(() => { app = renderWithProviders(<Main />); });
}

describe('lists CRUD testing', () => {
  it('should show 4 lists on the table view', async () => {
    server.create('table');
    const lists = server.createList('list', 4);

    await renderTestApp();
    const { getByTestId, findAllByTestId, getByText } = app;

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

    expect((await findAllByTestId(List_TestId)).length).toBe(4);

    lists.forEach((list) => {
      expect(getByText(list.title)).not.toBeNull();
    });
  });

  it('should add new list by list form', async () => {
    server.create('table');

    await renderTestApp();
    const {
      getByTestId, findByTestId, findAllByTestId, getByText,
    } = app;

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

    const openListFormBtnId = ListCreatorExpander_TestId;
    const listTitleId = CreateListForm_ListTitle_TestId;
    const createBtnId = CreateListForm_CreateBtn_TestId;
    const listTitleText = 'SOME_LIST_TITLE';

    const openListFormBtn = await findByTestId(openListFormBtnId);
    await act(async () => { await userEvent.click(openListFormBtn); });

    const listTitleInput = getByTestId(listTitleId);
    await act(async () => { await userEvent.type(listTitleInput, listTitleText); });

    const createBtn = getByTestId(createBtnId);
    await act(async () => { await userEvent.click(createBtn); });

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

  it('should add new list by list form', async () => {
    server.create('table');

    await renderTestApp();
    const { getByTestId, findByTestId } = app;

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

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
    server.create('table');
    server.create('list');

    await renderTestApp();
    const { getByTestId, findByTestId, queryByTestId } = app;

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

    const openOptionsBtn = await findByTestId(ListOptionsOpenBtn_TestId);
    await act(() => userEvent.click(openOptionsBtn));

    const deleteBtn = await findByTestId(ListOptionsDeleteBtn_TestId);
    await act(() => userEvent.click(deleteBtn));

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
    server.create('table');
    server.create('list');

    await renderTestApp();
    const { getByTestId, findByTestId, findByText } = app;

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

    await waitFor(() => findByTestId(ListTitleOpenEditorBtn_TestId));
    const openBtn = getByTestId(ListTitleOpenEditorBtn_TestId);
    await userEvent.click(openBtn);

    const newTitle = nanoid();
    const titleInput = getByTestId(ListTitleEditor_TestId);

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

  it('should doesn\' update list title if it\'s invalid (empty).', async () => {
    server.create('table');
    const list = server.create('list');
    const oldTitle = list.title;

    await renderTestApp();
    const { getByTestId, findByTestId } = app;

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

    await waitFor(() => findByTestId(List_TestId));
    const openBtn = await findByTestId(ListTitleOpenEditorBtn_TestId);
    await userEvent.click(openBtn);

    const titleInput = await findByTestId(ListTitleEditor_TestId);

    await userEvent.clear(titleInput);
    await userEvent.keyboard('{enter}');

    const listElem = getByTestId(List_TestId);
    const invalidInput = listElem.querySelector('.is-invalid');
    expect(invalidInput).not.toBeNull();

    const newLists = server.schema.all('list').models;
    expect(newLists.length).toBe(1);

    const newList = newLists[0];
    expect(newList.title).toBe(oldTitle);
  });
});
