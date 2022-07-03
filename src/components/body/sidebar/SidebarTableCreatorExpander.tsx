import React, { useState } from 'react';
import { TodoTableId } from '../../../models/ITodoTable';

import OpenCreateFormBtn from '../buttons/OpenCreateFormBtn';
import SidebarCreateTableForm from './SidebarCreateTableForm';

interface ISidebarTableCreatorExpanderProps {
  onAddTable: (tableId: TodoTableId) => void
}

export default function SidebarTableCreatorExpander(props: ISidebarTableCreatorExpanderProps) {
  const { onAddTable } = props;

  const [isOpened, setIsOpened] = useState(false);

  function onOpen() {
    setIsOpened(true);
  }

  function onClose(tableId?: TodoTableId) {
    if (tableId) {
      onAddTable(tableId);
    }

    setIsOpened(false);
  }

  return (
    <>
      {isOpened && <SidebarCreateTableForm onClose={onClose} />}
      {!isOpened && <OpenCreateFormBtn text="Добавить таблицу" onOpen={onOpen} />}
    </>
  );
}
