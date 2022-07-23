import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  RenderResult,
  findByText as g_findByText,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import {
  SidebarTableItem_DeleteBtn_TestId,
  SidebarTableItem_OpenDropdownBtn_TestId,
  SidebarTableItem_TestId,
} from '../components/sidebar/SidebarTableItem/SidebarTableItem';
import {
  SidebarCreateTableForm_NameField_TestId,
  SidebarCreateTableForm_AcceptBtn_TestId,
  SidebarCreateTableForm_TestId,
} from '../components/sidebar/SidebarCreateTableForm/SidebarCreateTableForm';
import {
  TablePlaceholder_Spinner_TestId,
  TablePlaceholder_TestId,
} from '../components/body/table/TablePlaceholder/TablePlaceholder';
import {
  SidebarEditTableTitleForm_Field_TestId,
  SidebarEditTableTitleForm_TestId,
} from '../components/sidebar/SidebarTableTitle/SidebarEditTableTitleForm';
import { testId_SidebarOpenCreateForm_OpenBtn } from '../components/sidebar/SidebarTableCreatorExpander';
import { SidebarTableTitle_Name_TestId } from '../components/sidebar/SidebarTableTitle/SidebarTableTitle';
import { testId_SidebarList } from '../components/sidebar/Sidebar/Sidebar';
import { testId_Table_Header } from '../components/body/table/Table';
import createServer from '../mocks/api/mirageApi';
import renderWithProviders from '../utils/test-utils';
import Main from '../components/body/Main';

let server: ReturnType<typeof createServer>;
let app: RenderResult;

async function renderTestApp() {
  app = await renderWithProviders(<Main />);
}

beforeEach(async () => {
  server = createServer({ environment: 'test' });
});

afterEach(() => {
  app?.unmount();
  server?.shutdown();
});

describe('table crud testing', () => {
  it('shows table placeholder when there is no tables', async () => {
    await renderTestApp();
    const { queryAllByTestId, queryByTestId, getByTestId } = app;

    await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
    await waitForElementToBeRemoved(getByTestId(TablePlaceholder_Spinner_TestId));

    expect(queryByTestId(TablePlaceholder_TestId)).toBeInTheDocument();
    expect(queryAllByTestId(SidebarTableItem_TestId)).toHaveLength(0);
  });

  it('shows tables list when get a few tables from server', async () => {
    const tables = server.createList('table', 4);

    await renderTestApp();
    const { findByTestId, findAllByTestId, getByTestId } = app;

    await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
    await waitForElementToBeRemoved(getByTestId(TablePlaceholder_Spinner_TestId));

    await findAllByTestId(SidebarTableItem_TestId);
    expect(await findAllByTestId(SidebarTableItem_TestId)).toHaveLength(4);

    const tableListElem = getByTestId(testId_SidebarList);

    tables.forEach((table) => {
      expect(tableListElem).toHaveTextContent(table.name);
    });

    expect(await findByTestId(testId_Table_Header)).toBeInTheDocument();
  });

  it('adds a new table when submit name by sidebar creating form', async () => {
    await renderTestApp();
    const { getByTestId, findByTestId } = app;

    await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
    await waitForElementToBeRemoved(getByTestId(TablePlaceholder_Spinner_TestId));

    const createTableBtnId = testId_SidebarOpenCreateForm_OpenBtn;
    const tableInputId = SidebarCreateTableForm_NameField_TestId;
    const addBtnId = SidebarCreateTableForm_AcceptBtn_TestId;
    const tableItemId = SidebarTableItem_TestId;

    const newTableName = 'TABLE_NAME';

    const createTableBtn = getByTestId(createTableBtnId);
    await userEvent.click(createTableBtn);
    const tableInput = await findByTestId(tableInputId);
    await userEvent.type(tableInput, newTableName);
    await userEvent.click(getByTestId(addBtnId));

    await findByTestId(SidebarCreateTableForm_TestId);
    await waitForElementToBeRemoved(() => getByTestId(SidebarCreateTableForm_TestId));

    const tables = server.schema.all('table');
    expect(tables.length).toEqual(1);

    const tableEl = getByTestId(tableItemId);
    const table = tables.models[0];
    expect(tableEl.id).toEqual(table.id);
  });

  it('remove one table when click delete option btn', async () => {
    server.create('table');
    await renderTestApp();

    const { getByTestId, queryByTestId, queryAllByTestId } = app;

    await waitFor(() => getByTestId(TablePlaceholder_Spinner_TestId));
    await waitForElementToBeRemoved(getByTestId(TablePlaceholder_Spinner_TestId));

    const optionsBtnId = SidebarTableItem_OpenDropdownBtn_TestId;
    const deleteBtnId = SidebarTableItem_DeleteBtn_TestId;
    const itemId = SidebarTableItem_TestId;

    await userEvent.click(getByTestId(optionsBtnId));
    await userEvent.click(getByTestId(deleteBtnId));

    await waitForElementToBeRemoved(() => queryByTestId(itemId));

    expect(queryAllByTestId(itemId)).toHaveLength(0);
    const tables = server.schema.all('table');
    expect(tables.length).toEqual(0);
  });

  it('renames table by sidebar header', async () => {
    const oldTableName = 'OLD_TABLE_NAME';
    const newTableName = 'NEW_TABLE_NAME';

    server.create('table', { name: oldTableName });
    await renderTestApp();

    const {
      getByTestId, getAllByTestId, findByTestId,
    } = app;

    const spinner = await findByTestId(TablePlaceholder_Spinner_TestId);
    if (spinner) {
      await waitForElementToBeRemoved(spinner);
    }

    expect(getAllByTestId(SidebarTableItem_TestId)).toHaveLength(1);

    const tableNameBtn = getByTestId(SidebarTableTitle_Name_TestId);
    expect(await g_findByText(tableNameBtn, oldTableName)).toBeInTheDocument();

    await userEvent.click(tableNameBtn);

    const tableNameInput = getByTestId(SidebarEditTableTitleForm_Field_TestId);
    await userEvent.clear(tableNameInput);
    await userEvent.type(tableNameInput, newTableName);
    await userEvent.keyboard('{enter}');

    await waitForElementToBeRemoved(getAllByTestId(SidebarEditTableTitleForm_TestId));

    expect(getByTestId(SidebarTableTitle_Name_TestId)).toHaveTextContent(newTableName);
    expect(getAllByTestId(SidebarTableItem_TestId)).toHaveLength(1);
  });

  it('doesn\'t rename table if name is empty', async () => {
    const oldTableName = 'OLD_TABLE_NAME';

    server.create('table', { name: oldTableName });
    await renderTestApp();

    const {
      getByTestId, getAllByTestId, findByTestId,
    } = app;

    const spinner = await findByTestId(TablePlaceholder_Spinner_TestId);
    if (spinner) {
      await waitForElementToBeRemoved(spinner);
    }

    expect(getAllByTestId(SidebarTableItem_TestId)).toHaveLength(1);

    // Имя таблицы в заголовке sidebar'а появляется с задержкой
    const tableNameBtn = getByTestId(SidebarTableTitle_Name_TestId);
    expect(await g_findByText(tableNameBtn, oldTableName)).toBeInTheDocument();

    await userEvent.click(tableNameBtn);
    const tableNameInput = getByTestId(SidebarEditTableTitleForm_Field_TestId);
    await userEvent.clear(tableNameInput);
    await userEvent.keyboard('{enter}');

    expect(getByTestId(SidebarEditTableTitleForm_Field_TestId)).toBeInTheDocument();
    expect(getByTestId(SidebarEditTableTitleForm_Field_TestId)).toHaveTextContent('');
    expect(getByTestId(SidebarEditTableTitleForm_Field_TestId)).toHaveClass('is-invalid');
  });
});
