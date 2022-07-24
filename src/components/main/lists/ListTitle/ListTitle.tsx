import React, { useState } from 'react';

import { useAppSelector } from '../../../../hooks/reduxHooks';
import { TodoListId } from '../../../../models/ITodoList';
import { selectListById } from '../../../../store/api/listSlice';
import ListTitleEditor from './ListTitleEditor';

export const ListTitle_TestId = 'ListTitle';
export const ListTitle_Title_TestId = 'ListTitle_Title';
export const ListTitleOpenEditorBtn_TestId = 'ListTitleOpenEditorBtn';

interface IListTitleProps {
  listId: TodoListId
}

export default function ListTitle(props: IListTitleProps) {
  const { listId } = props;

  const list = useAppSelector((state) => selectListById(state, listId));
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
        data-testid={ListTitleOpenEditorBtn_TestId}
        type="button"
        className="btn text-start"
        onClick={onOpen}
      >
        <span
          className="fw-bold"
          data-testid={ListTitle_Title_TestId}
        >
          {list.title}
        </span>
      </button>
    );
  }

  return (
    <div data-testid={ListTitle_TestId}>
      {content}
    </div>
  );
}
