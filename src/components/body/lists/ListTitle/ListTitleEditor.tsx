import React, { useState } from 'react';

import { useAppSelector } from '../../../../hooks/reduxHooks';
import useListService from '../../../../hooks/useListService';
import useTodoValidators from '../../../../hooks/useTodoValidators';
import { TodoListId } from '../../../../models/ITodoList';
import { selectTodoListById } from '../../../../store/todo/listSlice';
import FieldEditor from '../../shared/editors/FieldEditor';

const INVALID_LIST_ID_ERROR_MSG = 'Invalid argument error. Non-existent "listId" received.';

export const ListTitleEditor_TestId = 'ListTitleEditor';

interface IListTitleEditorProps {
  listId: TodoListId,
  onSave: () => void
}

export default function ListTitleEditor(props: IListTitleEditorProps) {
  const { listId, onSave: onSaveAction } = props;

  const list = useAppSelector((state) => selectTodoListById(state, listId));
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

  const { updateList } = useListService(listId);

  function onSave() {
    if (isTitleValid) {
      updateList(title);
      resetStates();
      onSaveAction();
    }

    setIsValidated(true);
  }

  return (
    <FieldEditor
      text={title}
      placeholder="Имя списка"
      mustValidate
      isValid={isTitleValid}
      isValidated={isValidated}
      isLoading={false}
      onChange={onTitleChange}
      onEntered={onSave}
      takeFocus
      testId={ListTitleEditor_TestId}
    />
  );
}
