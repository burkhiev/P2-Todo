import React, { useEffect, useState } from 'react';
import useTodoDropInfo from '../../../hooks/dnd/useTodoDropInfo';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { TodoId } from '../../../models/ITodo';

import { TodoListId } from '../../../models/ITodoList';
import { selectListById } from '../../../store/api/listSlice';
import OpenCreateFormBtn from '../shared/buttons/OpenCreateFormBtn';
import CreateTodoForm from './CreateTodoForm';

export const CreateTodoExpanderTestId = 'CreateTodoExpander';

interface ICreateTodoExpanderProps {
  listId: TodoListId,
  setPlaceholder: (todoId?: TodoId) => void
}

export default function CreateTodoExpander(props: ICreateTodoExpanderProps) {
  const { listId, setPlaceholder } = props;

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

  const [{ todoIsOver }, drop] = useTodoDropInfo();

  useEffect(() => {
    if (todoIsOver) {
      setPlaceholder();
    }

  //   Вызов setPlaceholder обновляет список показываемых элементов, в следствие
  // чего обновляется функция setPlaceholder и снова вызывается useEffect.
  // Таким образом компонент впадает в бесконечный цикл.
  //   Но убрав setPlaceholder из списка зависимостей можно рискнуть
  // вызовом старой версии функции. В данном случае это не страшно,
  // т.к. функция setPlaceholder является частью props, и при её
  // изменении компонент создаст новый рендер.
  //
  // Использование useCallback c setPlaceholder ситуацию не спасает.
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoIsOver]);

  return (
    <div ref={drop}>
      {isOpened && <CreateTodoForm listId={listId} onClose={onCloseAddForm} />}
      {!isOpened && (
        <OpenCreateFormBtn
          text="Добавить карточку"
          onOpen={onOpenAddForm}
          testId={CreateTodoExpanderTestId}
        />
      )}
    </div>
  );
}
