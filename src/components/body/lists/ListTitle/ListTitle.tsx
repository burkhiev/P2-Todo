import React, { useState } from 'react';

import { useAppSelector } from '../../../../hooks/reduxHooks';
import { TodoListId } from '../../../../models/ITodoList';
import { selectTodoListById } from '../../../../store/todo/listSlice';
import ListTitleEditor from './ListTitleEditor';

interface IListTitleProps {
  listId: TodoListId
}

export default function ListTitle(props: IListTitleProps) {
  const { listId } = props;

  const list = useAppSelector((state) => selectTodoListById(state, listId));
  if (!list) {
    throw new Error('ListTitle component must have a valid listId prop.');
  }

  const [isEdit, setIsEdit] = useState(false);

  function onClose() {
    setIsEdit(false);
    document.body.removeEventListener('click', onClose);
  }

  function onOpen(e: React.MouseEvent<any>) {
    e.stopPropagation();
    setIsEdit(true);
    document.body.addEventListener('click', onClose);
  }

  let content: JSX.Element;

  if (isEdit) {
    content = <ListTitleEditor listId={list.id} onSave={onClose} />;
  } else {
    content = (
      <button
        type="button"
        className="btn text-start"
        onClick={onOpen}
      >
        <span className="fw-bold">{list.title}</span>
      </button>
    );
  }

  return content;
}
