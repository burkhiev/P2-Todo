import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import useTodoEditor from '../../../hooks/useTodoEditor';
import { TodoListId } from '../../../models/ITodoList';
import { selectTodoListById, updateList } from '../../../store/todo/listSlice';
import FieldEditor from '../editors/FieldEditor';

interface IListTitleProps {
  listId: TodoListId
}

export default function ListTitle(props: IListTitleProps) {
  const { listId } = props;

  const list = useAppSelector((state) => selectTodoListById(state, listId));
  if (!list) {
    throw new Error('ListTitle component must have a valid listId prop.');
  }

  const dispatch = useAppDispatch();

  const [isEdit, setIsEdit] = useState(false);

  const {
    resetStates,
    title,
    setTitle,
    isTitleValid,
    isValidated,
    setIsValidated,
  } = useTodoEditor({ title: list.title });

  function onClose() {
    setIsEdit(false);
    document.body.removeEventListener('click', onClose);
  }

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsEdit(true);
    document.body.addEventListener('click', onClose);
  }

  function onSave() {
    if (isTitleValid) {
      dispatch(updateList({
        id: list!.listId,
        changes: { title },
      }));

      setIsEdit(false);
      resetStates();
    }

    setIsValidated(true);
  }

  let content: JSX.Element;

  if (isEdit) {
    content = (
      <FieldEditor
        text={title}
        placeholder="Имя списка"
        mustValidate
        isValid={isTitleValid}
        isValidated={isValidated}
        onChange={setTitle}
        onEntered={onSave}
        takeFocus
      />
    );
  } else {
    content = (
      <button
        type="button"
        className="btn text-start"
        onClick={onClick}
      >
        <span className="fw-bold">{list.title}</span>
      </button>
    );
  }

  return content;
}
