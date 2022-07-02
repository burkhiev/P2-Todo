import React, { useState } from 'react';

import { TodoTableId } from '../../../../models/ITodoTable';
import OpenCreateFormBtn from '../../buttons/OpenCreateFormBtn';
import TableStyles from '../List/bootstrapListStyles';
import ListCreatorForm from './CreateListForm';

interface IListCreatorExpanderProps {
  tableId: TodoTableId
}

export default function ListCreatorExpander(props: IListCreatorExpanderProps) {
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
      <div className={TableStyles.list}>
        {isOpened && <ListCreatorForm tableId={tableId} onClose={onClose} />}
        {!isOpened && <OpenCreateFormBtn text="Добавить список" onOpen={onOpen} />}
      </div>
    </div>
  );
}
