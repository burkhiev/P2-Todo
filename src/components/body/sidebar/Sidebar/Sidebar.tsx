import React, { useState } from 'react';

import styles from './Sidebar.css';
import { INVALID_TABLE_ID } from '../../../../service/Consts';

import { useAppSelector } from '../../../../hooks/reduxHooks';
import { TodoTableId } from '../../../../models/ITodoTable';
import { selectAllTableIds, selectTableById } from '../../../../store/todo/tableSlice';
import SidebarTableItem from '../SidebarTableItem/SidebarTableItem';
import SidebarTableTitle from '../SidebarTableTitle/SidebarTableTitle';
import SidebarTableCreatorExpander from '../SidebarTableCreatorExpander';

interface ISidebarProps {
  selectedTableId?: TodoTableId,
  selectTable: (id?: TodoTableId) => void
}

export default function Sidebar(props: ISidebarProps) {
  const { selectedTableId, selectTable } = props;
  const table = useAppSelector((state) =>
    selectTableById(state, selectedTableId ?? INVALID_TABLE_ID));

  const defaultTableIds = useAppSelector(selectAllTableIds);

  const [tableIds, setTableIds] = useState(defaultTableIds);

  // Служит для закрытия dropdown menu в SidebarTableItems.
  // Необходимо, чтобы при нажатии на другой SidebarTableItems, закрывался dropdown.
  // Все поведения предлагаемые Bootstrap не работают должным образом.
  const [curDropdownTableId, setCurDropdownTableId] = useState<TodoTableId | undefined>(
    tableIds.length > 0 ? tableIds[0] : undefined,
  );

  function onAddTable(tableId: TodoTableId) {
    if (tableId !== INVALID_TABLE_ID) {
      setTableIds([...tableIds, tableId]);
      selectTable(tableId);
    }
  }

  function onDeleteTable(id: TodoTableId) {
    const tabIds = tableIds.slice();
    const index = tabIds.findIndex((tabId) => tabId === id);

    if (index === undefined) {
      return;
    }

    let nextTableId = selectedTableId;

    if (id === selectedTableId) {
      if (index > 0) {
        nextTableId = tabIds[index - 1];
      } else if (tabIds.length === 1) {
        nextTableId = undefined;
      } else {
        [, nextTableId] = tabIds;
      }
    }

    tabIds.splice(index, 1);

    selectTable(nextTableId);
    setTableIds([...tabIds]);
  }

  const renderedTables = tableIds.map((id, index) => (
    <SidebarTableItem
      key={id}
      tableId={id}
      itsFirst={index === 0}
      curDropdownTableId={curDropdownTableId}
      setCurDropdownTableId={setCurDropdownTableId}
      selectTable={selectTable}
      onDeleteTable={onDeleteTable}
    />
  ));

  return (
    <div className={`border ${styles.sidebar}`}>
      <div className="d-flex align-items-center m-3 ms-4">
        <span className="bi bi-table me-2" />
        <div className="w-100 text-nowrap text-truncate">
          <SidebarTableTitle tableId={table?.tableId} />
        </div>
      </div>
      <hr />
      <div className="mb-3">
        {renderedTables}
      </div>
      <div className="mx-2">
        <SidebarTableCreatorExpander
          key="SidebarTableCreatorExpander"
          onAddTable={onAddTable}
        />
      </div>
    </div>
  );
}
