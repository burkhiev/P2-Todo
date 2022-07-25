import React, { useState } from 'react';

import styles from './sidebarTableItem1.css';

import { useAppSelector } from '../../../hooks/reduxHooks';
import { TodoTableId } from '../../../models/ITodoTable';
import { selectTableById, useDeleteTable } from '../../../store/api/tableSlice';
import InvalidArgumentError from '../../../service/errors/InvalidArgumentError';

export const SidebarTableItem_TestId = 'SidebarTableItemTestId';
export const SidebarTableItem_OpenDropdownBtn_TestId = 'SidebarTableItem_OpenDropdownBtn';
export const SidebarTableItem_DeleteBtn_TestId = 'SidebarTableItem_DeleteBtn';

interface ISidebarTableItemProps {
  tableId: TodoTableId,
  selectedTableId: TodoTableId | undefined,
  curDropdownTableId: TodoTableId | undefined,
  itsFirst: boolean,
  onSelectTable: (id: TodoTableId) => void,
  onDeleteTable: (tableId: TodoTableId) => void,
  setCurDropdownTableId: (tableId?: TodoTableId) => void
}

export default function SidebarTableItem(props: ISidebarTableItemProps) {
  const {
    tableId,
    selectedTableId,
    curDropdownTableId: curTableId,
    itsFirst,
    onSelectTable,
    onDeleteTable,
    setCurDropdownTableId,
  } = props;

  const table = useAppSelector((state) => selectTableById(state, tableId));

  if (!table) {
    throw new InvalidArgumentError('Non-existent "tableId" received.');
  }

  const [dropdownIsOpened, setDropdownIsOpened] = useState(false);
  const [deleteTable, { isLoading }] = useDeleteTable();

  function onSelect() {
    onSelectTable(tableId);
  }

  async function onDelete() {
    if (table) {
      try {
        await deleteTable(table.id).unwrap();
        onDeleteTable(table.id);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }

  function onCloseDropdownMenu() {
    setDropdownIsOpened(false);
    document.body.removeEventListener('click', onCloseDropdownMenu);
  }

  function onOpenDropdownMenu(e: React.MouseEvent) {
    e.stopPropagation();
    setCurDropdownTableId(table?.id);

    setDropdownIsOpened(true);
    document.body.addEventListener('click', onCloseDropdownMenu);
  }

  let dropdownMenu: any;

  if (curTableId === table.id && dropdownIsOpened) {
    dropdownMenu = (
      <div className={`dropdown-menu d-block ${styles.sidebar_options_dropdown_menu}`}>
        <button
          type="button"
          className="dropdown-item"
          onClick={onDelete}
          data-testid={SidebarTableItem_DeleteBtn_TestId}
        >
          Удалить
        </button>
      </div>
    );
  }

  const margin = itsFirst ? '' : 'mt-1';
  const selected = selectedTableId === tableId ? 'bg-light' : '';
  const selectedText = selectedTableId === tableId ? '' : 'text-white';
  const selectedOptionBtnColor = selectedTableId === tableId ? '' : 'text-white';
  const placeholder = (isLoading) ? 'placeholder' : '';
  const bgColor = (isLoading) ? 'bg-danger' : '';
  const textColor = (isLoading) ? 'text-white' : '';

  return (
    <div
      id={table.id}
      className={`
        d-flex
        px-3
        placeholder-glow
        ${margin} 
        ${selected} 
        ${bgColor}
        ${styles.sidebar_table_item}
      `}
      data-testid={SidebarTableItem_TestId}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`
          text-start
          text-truncate
          w-100
          ${textColor}
          ${placeholder}
          ${selectedText} 
          ${styles.sidebar_table_item_btn}
        `}
      >
        {table.name}
      </button>
      <div className="m-1 dropend">
        <button
          type="button"
          onClick={onOpenDropdownMenu}
          className={`
            ${selectedOptionBtnColor}
            ${styles.sidebar_table_item_btn} 
            ${styles.sidebar_table_item_options}
          `}
          data-testid={SidebarTableItem_OpenDropdownBtn_TestId}
        >
          <span className="bi bi-three-dots" />
        </button>
        {dropdownMenu}
      </div>
    </div>
  );
}
