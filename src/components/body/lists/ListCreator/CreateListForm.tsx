import React, { useState } from 'react';

import { useAppDispatch } from '../../../../hooks/reduxHooks';
import useTodoValidators from '../../../../hooks/useTodoValidators';
import { TodoTableId } from '../../../../models/ITodoTable';
import { addList } from '../../../../store/todo/listSlice';
import CreateBtns from '../../shared/buttons/CreateBtns';
import FieldEditor from '../../shared/editors/FieldEditor';

export const CreateListForm_TestId = 'CreateListForm';
export const CreateListForm_ListTitle_TestId = 'CreateListForm_ListTitle';
export const CreateListForm_CreateBtn_TestId = 'CreateListForm_CreateBtn';
export const CreateListForm_CloseBtn_TestId = 'CreateListForm_CloseBtn';

interface IListCreatorFormProps {
  tableId: TodoTableId,
  onClose?: () => void
}

export default function CreateListForm(props: IListCreatorFormProps) {
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
          testId={CreateListForm_ListTitle_TestId}
        />
      </div>
      <div>
        <CreateBtns
          acceptBtnText="Добавить"
          isLoading={false}
          onAccept={onAddList}
          onClose={onClose}
          actionBtnTestId={CreateListForm_CreateBtn_TestId}
          closeBtnTestId={CreateListForm_CloseBtn_TestId}
        />
      </div>
    </>
  );
}
