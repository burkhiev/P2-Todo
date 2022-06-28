import React, { useEffect, useState } from 'react';
import useTodoDropWithoutInsert from '../../../hooks/useTodoDropWithoutInsert';

import { TodoListId } from '../../../models/ITodoList';
import OpenCreateFormBtn from '../buttons/OpenCreateFormBtn';
import CreateTodoForm from './CreateTodoForm';

interface ICreateTodoExpanderProps {
  listId: TodoListId,
  onIsDropOver: () => void
}

export default function CreateTodoExpander(props: ICreateTodoExpanderProps) {
  const { listId, onIsDropOver } = props;

  const [isOpened, setIsOpened] = useState(false);

  function onOpenAddForm() {
    setIsOpened(true);
  }

  function onCloseAddForm() {
    setIsOpened(false);
  }

  const [{ isOver }, drop] = useTodoDropWithoutInsert(listId);

  useEffect(() => {
    if (isOver) {
      onIsDropOver();
    }
  }, [isOver, onIsDropOver]);

  return (
    <div ref={drop}>
      {isOpened && <CreateTodoForm listId={listId} onClose={onCloseAddForm} />}
      {!isOpened && <OpenCreateFormBtn text="Добавить карточку" onOpen={onOpenAddForm} />}
    </div>
  );
}
