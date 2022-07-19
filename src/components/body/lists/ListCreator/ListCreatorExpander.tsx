import React, { useState } from 'react';

import { TodoTableId } from '../../../../models/ITodoTable';
import OpenCreateFormBtn from '../../shared/buttons/OpenCreateFormBtn';
import TableStyles from '../List/bootstrapListStyles';
import CreateListForm from './CreateListForm';

export const ListCreatorExpander_TestId = 'ListCreatorExpander';

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
        {isOpened && <CreateListForm tableId={tableId} onClose={onClose} />}
        {!isOpened && (
          <OpenCreateFormBtn
            text="Добавить список"
            onOpen={onOpen}
            testId={ListCreatorExpander_TestId}
          />
        )}
      </div>
    </div>
  );
}
