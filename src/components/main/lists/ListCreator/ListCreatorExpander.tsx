import React, { useState } from 'react';

import { Draggable } from 'react-beautiful-dnd';
import styles from '../List/list.css';

import { TodoTableId } from '../../../../models/ITodoTable';
import OpenCreateFormBtn from '../../shared/buttons/OpenCreateFormBtn';
import CreateListForm from './CreateListForm';

export const ListCreatorExpander_TestId = 'ListCreatorExpander';

interface IListCreatorExpanderProps {
  tableId: TodoTableId,
  index: number
}

export default function ListCreatorExpander(props: IListCreatorExpanderProps) {
  const { tableId, index } = props;

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
    <Draggable draggableId="ListCreatorExpander" index={index} isDragDisabled>
      {(provider) => (
        <div
          ref={provider.innerRef}
          {...provider.draggableProps}
          {...provider.dragHandleProps}
          className={styles.list}
        >
          {isOpened && <CreateListForm tableId={tableId} onClose={onClose} />}
          {!isOpened && (
            <OpenCreateFormBtn
              text="Добавить список"
              onOpen={onOpen}
              testId={ListCreatorExpander_TestId}
            />
          )}
        </div>
      )}
    </Draggable>
  );
}
