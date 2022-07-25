import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/reduxHooks';

import { TodoListId } from '../../../models/ITodoList';
import { selectListById } from '../../../store/api/listSlice';
import OpenCreateFormBtn from '../shared/buttons/OpenCreateFormBtn';
import CreateTodoForm from './CreateTodoForm';

export const CreateTodoExpander_TestId = 'CreateTodoExpander';
export const CreateTodoExpanderOpenBtn_TestId = 'CreateTodoExpanderOpenBtn';

interface ICreateTodoExpanderProps {
  listId: TodoListId
}

export default function CreateTodoExpander(props: ICreateTodoExpanderProps) {
  const { listId } = props;
  const list = useAppSelector((state) => selectListById(state, listId));

  if (!list) {
    throw new Error('Invalid listId prop.');
  }

  const [isOpened, setIsOpened] = useState(false);

  function onOpenAddForm() {
    setIsOpened(true);
  }

  function onCloseAddForm() {
    setIsOpened(false);
  }

  return (
    <div>
      {isOpened && <CreateTodoForm listId={listId} onClose={onCloseAddForm} />}
      {!isOpened && (
        <OpenCreateFormBtn
          text="Добавить карточку"
          onOpen={onOpenAddForm}
          testId={CreateTodoExpanderOpenBtn_TestId}
        />
      )}
    </div>
    // // CreateTodoExpander не является "draggable" элементом, но для корректного
    // // анимированного взаимодействия необходимо "завернуть" компонент в Draggable
    // <Draggable draggableId={expanderDragId} index={expanderIndex} isDragDisabled >
    //   {(provided) => (
    //     <div
    //       ref={provided.innerRef}
    //       data-testid={CreateTodoExpander_TestId}
    //       // eslint-disable-next-line react/jsx-props-no-spreading
    //       {...provided.draggableProps}
    //     >
    //       {isOpened && <CreateTodoForm listId={listId} onClose={onCloseAddForm} />}
    //       {!isOpened && (
    //         <OpenCreateFormBtn
    //           text="Добавить карточку"
    //           onOpen={onOpenAddForm}
    //           testId={CreateTodoExpanderOpenBtn_TestId}
    //         />
    //       )}
    //     </div>
    //   )}
    // </Draggable>
  );
}
