import React, { useState } from 'react';

import { TodoTableId } from '../../../models/ITodoTable';
import OpenCreateFormBtn from '../buttons/OpenCreateFormBtn';
import TableStyles from './ListStylesStrings';
import CreateListForm from './CreateListForm';

interface ICreateListExpanderProps {
  tableId: TodoTableId
}

export default function CreateListExpander(props: ICreateListExpanderProps) {
  const { tableId } = props;

  const [isOpened, setIsOpened] = useState(false);

  function onClose() {
    setIsOpened(false);
    document.body.removeEventListener('click', onClose);
  }

  function onOpen(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsOpened(true);
    document.body.addEventListener('click', onClose);
  }

  return (
    <div>
      <div className={TableStyles.listColumn}>
        {isOpened && <CreateListForm tableId={tableId} onClose={onClose} />}
        {!isOpened && <OpenCreateFormBtn text="Добавить колонку" onOpen={onOpen} />}
      </div>
    </div>
  );
}
