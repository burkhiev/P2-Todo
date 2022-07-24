import React, { useState } from 'react';
import { TodoTableId } from '../../models/ITodoTable';

import OpenCreateFormBtn from '../main/shared/buttons/OpenCreateFormBtn';
import SidebarCreateTableForm from './SidebarCreateTableForm/SidebarCreateTableForm';

export const SidebarTableCreator_Expander_TestId = 'SidebarTableCreator_Expander';
export const SidebarOpenCreateForm_OpenBtn_TestId = 'SidebarOpenCreateForm_OpenBtn';

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
          testId={SidebarOpenCreateForm_OpenBtn_TestId}
        />
      )}
    </>
  );
}
