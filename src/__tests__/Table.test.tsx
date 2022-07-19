import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  act,
  RenderResult,
  findByText as g_findByText,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import {
  testId_SidebarTableItem_DeleteBtn,
  testId_SidebarTableItem_OpenDropdownBtn,
  testId_SidebarTableItem,
} from '../components/sidebar/SidebarTableItem/SidebarTableItem';
import {
  testId_SidebarCreateTableForm_NameField,
  testId_SidebarCreateTableForm_AcceptBtn,
} from '../components/sidebar/SidebarCreateTableForm/SidebarCreateTableForm';
import {
  testId_TablePlaceholder_Spinner,
  testId_TablePlaceholder,
} from '../components/body/table/TablePlaceholder/TablePlaceholder';
import { testId_SidebarOpenCreateForm_OpenBtn } from '../components/sidebar/SidebarTableCreatorExpander';
import { testId_SidebarTableTitle_Name } from '../components/sidebar/SidebarTableTitle/SidebarTableTitle';
import { testId_SidebarEditTableTitleForm_Field } from '../components/sidebar/SidebarTableTitle/SidebarEditTableTitleForm';
import { testId_SidebarList } from '../components/sidebar/Sidebar/Sidebar';
import { testId_Table_Header } from '../components/body/table/Table';

import createServer from '../mocks/api/mirageApi';
import renderWithProviders from '../utils/test-utils';
import Main from '../components/body/Main';

let server: ReturnType<typeof createServer>;
let app: RenderResult;

async function renderTestApp() {
  await act(() => {
    app = renderWithProviders(<Main />);
  });
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

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

    expect(queryByTestId(testId_TablePlaceholder)).toBeInTheDocument();
    expect(queryAllByTestId(testId_SidebarTableItem)).toHaveLength(0);
  });

  it('shows tables list when get a few tables from server', async () => {
    const tables = server.createList('table', 4);

    await renderTestApp();
    const { findByTestId, findAllByTestId, getByTestId } = app;

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

    await findAllByTestId(testId_SidebarTableItem);
    expect(await findAllByTestId(testId_SidebarTableItem)).toHaveLength(4);

    const tableListElem = getByTestId(testId_SidebarList);

    tables.forEach((table) => {
      expect(tableListElem).toHaveTextContent(table.name);
    });

    expect(await findByTestId(testId_Table_Header)).toBeInTheDocument();
  });

  it('adds a new table when submit name by sidebar creating form', async () => {
    await renderTestApp();
    const { getByTestId, findByTestId } = app;

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

    const createTableBtnId = testId_SidebarOpenCreateForm_OpenBtn;
    const tableInputId = testId_SidebarCreateTableForm_NameField;
    const addBtnId = testId_SidebarCreateTableForm_AcceptBtn;
    const tableItemId = testId_SidebarTableItem;

    const newTableName = 'TABLE_NAME';

    const createTableBtn = getByTestId(createTableBtnId);
    await act(async () => {
      await userEvent.click(createTableBtn);
    });

    const tableInput = await findByTestId(tableInputId);
    await act(async () => {
      await userEvent.type(tableInput, newTableName);
    });

    await act(async () => {
      await userEvent.click(getByTestId(addBtnId));
    });

    await findByTestId(testId_TablePlaceholder_Spinner);
    await waitForElementToBeRemoved(() => getByTestId(testId_TablePlaceholder_Spinner));

    const tables = server.schema.all('table');
    expect(tables.length).toEqual(1);

    const tableEl = getByTestId(tableItemId);
    const table = tables.models[0];
    expect(tableEl.id).toEqual(table.id);
  });

  it('remove one table when click delete option btn', async () => {
    server.create('table');
    await renderTestApp();

    const { getByTestId, queryAllByTestId } = app;

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

    const optionsBtnId = testId_SidebarTableItem_OpenDropdownBtn;
    const deleteBtnId = testId_SidebarTableItem_DeleteBtn;
    const itemId = testId_SidebarTableItem;

    await act(() => getByTestId(optionsBtnId).click());
    await act(() => getByTestId(deleteBtnId).click());

    await waitFor(() => getByTestId(testId_TablePlaceholder_Spinner));
    await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));

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

    let spinner = await findByTestId(testId_TablePlaceholder_Spinner);
    if (spinner) {
      await waitForElementToBeRemoved(spinner);
    }

    expect(getAllByTestId(testId_SidebarTableItem)).toHaveLength(1);

    // Имя таблицы в заголовке sidebar'а появляется с задержкой
    const tableNameBtn = getByTestId(testId_SidebarTableTitle_Name);
    expect(await g_findByText(tableNameBtn, oldTableName)).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(tableNameBtn);
    });

    const tableNameInput = getByTestId(testId_SidebarEditTableTitleForm_Field);
    await act(async () => {
      await userEvent.clear(tableNameInput);
    });

    await act(async () => {
      await userEvent.type(tableNameInput, newTableName);
    });

    await act(async () => {
      await userEvent.keyboard('{enter}');
    });

    spinner = await findByTestId(testId_TablePlaceholder_Spinner);
    if (spinner) {
      await waitForElementToBeRemoved(getByTestId(testId_TablePlaceholder_Spinner));
    }

    expect(getByTestId(testId_SidebarTableTitle_Name)).toHaveTextContent(newTableName);
    expect(getAllByTestId(testId_SidebarTableItem)).toHaveLength(1);
  });

  it('doesn\'t rename table if name is empty', async () => {
    const oldTableName = 'OLD_TABLE_NAME';

    server.create('table', { name: oldTableName });
    await renderTestApp();

    const {
      getByTestId, getAllByTestId, findByTestId,
    } = app;

    const spinner = await findByTestId(testId_TablePlaceholder_Spinner);
    if (spinner) {
      await waitForElementToBeRemoved(spinner);
    }

    expect(getAllByTestId(testId_SidebarTableItem)).toHaveLength(1);

    // Имя таблицы в заголовке sidebar'а появляется с задержкой
    const tableNameBtn = getByTestId(testId_SidebarTableTitle_Name);
    expect(await g_findByText(tableNameBtn, oldTableName)).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(tableNameBtn);
    });

    const tableNameInput = getByTestId(testId_SidebarEditTableTitleForm_Field);
    await act(async () => {
      await userEvent.clear(tableNameInput);
    });

    await act(async () => {
      await userEvent.keyboard('{enter}');
    });

    expect(getByTestId(testId_SidebarEditTableTitleForm_Field)).toBeInTheDocument();
    expect(getByTestId(testId_SidebarEditTableTitleForm_Field)).toHaveTextContent('');
    expect(getByTestId(testId_SidebarEditTableTitleForm_Field)).toHaveClass('is-invalid');
  });
});
