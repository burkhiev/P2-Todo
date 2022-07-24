import React, { useState } from 'react';

import { useAppSelector } from '../../../../hooks/reduxHooks';
import useTodoValidators from '../../../../hooks/useTodoValidators';
import { TodoListId } from '../../../../models/ITodoList';
import { selectListById, useUpdateList } from '../../../../store/api/listSlice';
import FieldEditor from '../../shared/editors/FieldEditor';

export const ListTitleEditor_TestId = 'ListTitleEditor';
export const ListTitleEditor_Input_TestId = 'ListTitleEditor_Input';

const INVALID_LIST_ID_ERROR_MSG = 'Invalid argument error. Non-existent "listId" received.';

interface IListTitleEditorProps {
  listId: TodoListId,
  onSave: () => void
}

export default function ListTitleEditor(props: IListTitleEditorProps) {
  const { listId, onSave: onSaveAction } = props;

  const list = useAppSelector((state) => selectListById(state, listId));
  if (!list) {
    throw new Error(INVALID_LIST_ID_ERROR_MSG);
  }

  const [validateTitle] = useTodoValidators();

  const [title, setTitle] = useState(list.title);
  const [isTitleValid, setIsTitleValid] = useState(validateTitle(list.title));
  const [isValidated, setIsValidated] = useState(false);

  function onTitleChange(value: string) {
    setTitle(value);
    setIsTitleValid(validateTitle(value));
  }

  function resetStates() {
    if (!list) {
      throw new Error(INVALID_LIST_ID_ERROR_MSG);
    }

    setTitle(list.title);
    setIsTitleValid(validateTitle(list.title));
    setIsValidated(false);
  }

  const [updateList, { isLoading }] = useUpdateList();

  async function onSave() {
    if (!list) {
      throw new Error(INVALID_LIST_ID_ERROR_MSG);
    }

    if (isTitleValid) {
      await updateList({ ...list, title }).unwrap();
      resetStates();
      onSaveAction();
    }

    setIsValidated(true);
  }

  return (
    <div data-testid={ListTitleEditor_TestId}>
      <FieldEditor
        text={title}
        placeholder="Имя списка"
        mustValidate
        isValid={isTitleValid}
        isValidated={isValidated}
        isLoading={isLoading}
        onChange={onTitleChange}
        onEntered={onSave}
        takeFocus
        testId={ListTitleEditor_Input_TestId}
      />
    </div>
  );
}
