import React, { useState } from 'react';

import { useAppDispatch } from '../../../../hooks/reduxHooks';
import useTodoValidators from '../../../../hooks/useTodoValidators';
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

  const [title, setTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validateTitle] = useTodoValidators();

  function onTitleChange(value: string) {
    setTitle(value);
    setIsTitleValid(validateTitle(value));
  }

  function onAddList() {
    setIsValidated(true);

    if (isTitleValid) {
      dispatch(addList(tableId, title));
      onClose();
    }
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
          isLoading={false}
          onChange={onTitleChange}
          onEntered={onAddList}
          takeFocus
        />
      </div>
      <div>
        <CreateBtns
          acceptBtnText="Добавить"
          isLoading={false}
          onAccept={onAddList}
          onClose={onClose}
        />
      </div>
    </>
  );
}
