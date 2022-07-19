import React, { useState } from 'react';

import { INVALID_TABLE_ID } from '../../../service/Consts';

import { useAppSelector } from '../../../hooks/reduxHooks';
import { TodoTableId } from '../../../models/ITodoTable';
import SidebarTableItem from '../SidebarTableItem/SidebarTableItem';
import SidebarTableTitle from '../SidebarTableTitle/SidebarTableTitle';
import SidebarTableCreatorExpander from '../SidebarTableCreatorExpander';
import { selectAllTablesIds } from '../../../store/api/tableSlice';

export const testId_SidebarList = 'SidebarList';

interface ISidebarProps {
  tableId?: TodoTableId,
  selectTable: (id?: TodoTableId) => void
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
    const index = tableIds.findIndex((tabId) => tabId === id);

    if (index === undefined) {
      return;
    }

    let nextTableId = tableId;

    if (id === tableId) {
      if (index > 0) {
        nextTableId = tableIds[index - 1];
      } else if (index === 0 && tableIds.length > 1) {
        [, nextTableId] = tableIds;
      } else {
        nextTableId = undefined;
      }
    }

    selectTable(nextTableId);
  }

  const renderedTables = tableIds.map((id, index) => (
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
    <div className="p-3">
      <SidebarTableTitle tableId={tableId} />
      <hr />
      <div>
        <div
          className="mb-3"
          data-testid={testId_SidebarList}
        >
          {renderedTables}
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
