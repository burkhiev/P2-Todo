import React, { useState } from 'react';
import { TodoTableId } from '../../models/ITodoTable';

import OpenCreateFormBtn from '../body/shared/buttons/OpenCreateFormBtn';
import SidebarCreateTableForm from './SidebarCreateTableForm/SidebarCreateTableForm';

export const testId_SidebarTableCreator_Expander = 'SidebarTableCreator_Expander';
export const testId_SidebarOpenCreateForm_OpenBtn = 'SidebarOpenCreateForm_OpenBtn';

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
      {!isOpened && (
        <OpenCreateFormBtn
          text="Добавить таблицу"
          onOpen={onOpen}
          testId={testId_SidebarOpenCreateForm_OpenBtn}
        />
      )}
    </>
  );
}
