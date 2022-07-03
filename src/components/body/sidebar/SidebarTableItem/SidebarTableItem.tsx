import React, { useState } from 'react';

import styles from './SidebarTableItem.css';

import { useAppSelector } from '../../../../hooks/reduxHooks';
import { TodoTableId } from '../../../../models/ITodoTable';
import { selectTableById } from '../../../../store/todo/tableSlice';
import useTableService from '../../../../hooks/useTableService';

const INVALID_TABLE_ID_ERR_MSG = 'Invalid argument error. Non-existent "tableId" received.';

interface ISidebarTableItemProps {
  tableId: TodoTableId,
  itsFirst: boolean,
  curDropdownTableId: TodoTableId | undefined,
  selectTable: (id: TodoTableId) => void,
  onDeleteTable: (tableId: TodoTableId) => void,
  setCurDropdownTableId: (tableId?: TodoTableId) => void
}

export default function SidebarTableItem(props: ISidebarTableItemProps) {
  const {
    tableId,
    itsFirst,
    curDropdownTableId: curTableId,
    selectTable,
    onDeleteTable,
    setCurDropdownTableId,
  } = props;

  const table = useAppSelector((state) => selectTableById(state, tableId));

  if (!table) {
    throw new Error(INVALID_TABLE_ID_ERR_MSG);
  }

  const { removeTable } = useTableService(table.tableId);

  function onSelect() {
    selectTable(tableId);
  }

  function onDelete() {
    if (table) {
      removeTable();
      onDeleteTable(table.tableId);
    }
  }

  const [dropdownIsOpened, setDropdownIsOpened] = useState(false);

  function onCloseDropdownMenu() {
    setDropdownIsOpened(false);
    document.body.removeEventListener('click', onCloseDropdownMenu);
  }

  function onOpenDropdownMenu(e: React.MouseEvent) {
    e.stopPropagation();
    setCurDropdownTableId(table?.tableId);

    setDropdownIsOpened(true);
    document.body.addEventListener('click', onCloseDropdownMenu);
  }

  let dropdownMenu: any;

  if (curTableId === table.tableId && dropdownIsOpened) {
    dropdownMenu = (
      <div className={`dropdown-menu d-block ${styles.sidebar_options_dropdown_menu}`}>
        <button
          type="button"
          className="dropdown-item"
          onClick={onDelete}
        >
          Удалить
        </button>
      </div>
    );
  }

  const margin = itsFirst ? '' : 'mt-1';

  return (
    <div className={`d-flex px-3 ${margin} ${styles.sidebar_table_item}`}>
      <button
        type="button"
        onClick={onSelect}
        className={`text-start w-100 ${styles.sidebar_table_item_btn}`}
      >
        {table.name}
      </button>
      <div className="m-1 dropend">
        <button
          type="button"
          onClick={onOpenDropdownMenu}
          className={`${styles.sidebar_table_item_btn} ${styles.sidebar_table_item_options}`}
        >
          <span className="bi bi-three-dots" />
        </button>
        {dropdownMenu}
      </div>
    </div>
  );
}
