import React from 'react';

import { useAppDispatch } from '../../../hooks/reduxHooks';
import useTodoEditor from '../../../hooks/useTodoEditor';
import { TodoTableId } from '../../../models/ITodoTable';
import { addList } from '../../../store/todo/listSlice';
import CreateBtns from '../buttons/CreateBtns';
import FieldEditor from '../editors/FieldEditor';

interface ITodoListCreatorProps {
  tableId: TodoTableId,
  onClose?: () => void
}

export default function CreateListForm(props: ITodoListCreatorProps) {
  const { tableId, onClose = () => {} } = props;

  const dispatch = useAppDispatch();

  const {
    title,
    setTitle,
    isTitleValid,
    setIsValidated,
    isValidated,
  } = useTodoEditor({ title: '' });

  function onAddList() {
    if (isTitleValid) {
      dispatch(addList(tableId, title));
      onClose();
    }

    setIsValidated(true);
  }

  return (
    <>
      <FieldEditor
        text={title}
        placeholder="Добавить список"
        mustValidate
        isValid={isTitleValid}
        isValidated={isValidated}
        onChange={setTitle}
        onEntered={onAddList}
        takeFocus
      />
      <CreateBtns
        onAccept={onAddList}
        onClose={onClose}
        acceptBtnText="Добавить"
      />
    </>
  );
}
