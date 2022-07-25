import React, { useState } from 'react';

import styles from './sidebar.css';
import { INVALID_TABLE_ID } from '../../../service/Consts';

import { useAppSelector } from '../../../hooks/reduxHooks';
import { TodoTableId } from '../../../models/ITodoTable';
import SidebarTableItem from '../SidebarTableItem/SidebarTableItem';
import SidebarTableTitle from '../SidebarTableTitle/SidebarTableTitle';
import SidebarTableCreatorExpander from '../SidebarTableCreatorExpander';
import { selectAllTablesIds } from '../../../store/api/tableSlice';

export const testId_SidebarList = 'SidebarList';

interface ISidebarProps {
  tableId: TodoTableId,
  selectTable: (id: TodoTableId) => void
}

export default function Sidebar(props: ISidebarProps) {
  const { tableId, selectTable } = props;

  const tableIds = useAppSelector(selectAllTablesIds);

  // Служит для закрытия dropdown menu в SidebarTableItems.
  // Необходимо, чтобы при нажатии на другой SidebarTableItems, закрывался dropdown.
  // Все поведения предлагаемые Bootstrap не работают должным образом.
  const [curDropdownTableId, setCurDropdownTableId] = useState<TodoTableId | undefined>(
    tableIds.length > 0 ? tableIds[0] : undefined,
  );

  function onAddTable(id: TodoTableId) {
    if (id !== INVALID_TABLE_ID) {
      selectTable(id);
    }
  }

  function onDeleteTable(id: TodoTableId) {
    if (tableIds.length === 0) {
      selectTable(INVALID_TABLE_ID);
      return;
    }

    if (id !== tableId) {
      return;
    }

    const index = tableIds.findIndex((tabId) => tabId === id);

    if (index === undefined) {
      selectTable(tableIds[0]);
    } else if (index > 0) {
      selectTable(tableIds[index - 1]);
    } else if (index === 0 && tableIds.length > 1) {
      selectTable(tableIds[1]);
    } else {
      selectTable(INVALID_TABLE_ID);
    }
  }

  const renderedTableItems = tableIds.map((id, index) => (
    <SidebarTableItem
      key={id}
      tableId={id}
      selectedTableId={tableId}
      curDropdownTableId={curDropdownTableId}
      itsFirst={index === 0}
      setCurDropdownTableId={setCurDropdownTableId}
      onSelectTable={selectTable}
      onDeleteTable={onDeleteTable}
    />
  ));

  return (
    <div className={styles.sidebar}>
      <SidebarTableTitle tableId={tableId} />
      <hr />
      <div>
        <div className="mb-3" data-testid={testId_SidebarList}>
          {renderedTableItems}
        </div>
        <div className="mx-2">
          <SidebarTableCreatorExpander
            key="SidebarTableCreatorExpander"
            onAddTable={onAddTable}
          />
        </div>
      </div>
    </div>
  );
}
