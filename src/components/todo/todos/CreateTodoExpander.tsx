import React, { useState } from 'react';

import { TodoListId } from '../../../models/ITodoList';
import OpenCreateFormBtn from '../buttons/OpenCreateFormBtn';
import CreateTodoForm from './CreateTodoForm';

interface ICreateTodoExpanderProps {
  listId: TodoListId
}

export default function CreateTodoExpander(props: ICreateTodoExpanderProps) {
  const { listId } = props;

  const [isOpened, setIsOpened] = useState(false);

  function onOpenAddForm() {
    setIsOpened(true);
  }

  function onCloseAddForm() {
    setIsOpened(false);
  }

  return (
    <div className="">
      {isOpened && <CreateTodoForm listId={listId} onClose={onCloseAddForm} />}
      {!isOpened && <OpenCreateFormBtn text="Добавить карточку" onOpen={onOpenAddForm} />}
    </div>
  );
}
