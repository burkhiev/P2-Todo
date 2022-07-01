import React from 'react';

import { useAppDispatch } from '../../../../hooks/reduxHooks';
import useTodoEditor from '../../../../hooks/useTodoEditor';
import { TodoTableId } from '../../../../models/ITodoTable';
import { addList } from '../../../../store/todo/listSlice';
import CreateBtns from '../../buttons/CreateBtns';
import FieldEditor from '../../editors/FieldEditor';

interface IListCreatorFormProps {
  tableId: TodoTableId,
  onClose?: () => void
}

export default function ListCreatorForm(props: IListCreatorFormProps) {
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
      <div className="mb-2">
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
      </div>
      <div>
        <CreateBtns
          onAccept={onAddList}
          onClose={onClose}
          acceptBtnText="Добавить"
        />
      </div>
    </>
  );
}
