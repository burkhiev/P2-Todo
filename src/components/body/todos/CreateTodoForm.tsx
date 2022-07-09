import React, { useState } from 'react';
import { useAppDispatch } from '../../../hooks/reduxHooks';

import useTodoValidators from '../../../hooks/useTodoValidators';
import { TodoListId } from '../../../models/ITodoList';
import { addTodo } from '../../../store/todo/todoSlice';
import CreateBtns from '../shared/buttons/CreateBtns';
import FieldEditor from '../shared/editors/FieldEditor';

export const CreateTodoForm_TestId = 'CreateTodoForm';
export const CreateTodoForm_TodoTitle_TestId = 'CreateTodoForm_TodoTitle';
export const CreateTodoForm_CreateBtn_TestId = 'CreateTodoForm_CreateBtn';
export const CreateTodoForm_CloseBtn_TestId = 'CreateTodoForm_CloseBtn';

interface ICreateTodoFormProps {
  listId: TodoListId,
  onClose?: () => void
}

export default function CreateTodoForm(props: ICreateTodoFormProps) {
  const { listId, onClose = () => {} } = props;

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validateTitle] = useTodoValidators();

  function onTitleChange(value: string) {
    setTitle(value);
    setIsTitleValid(validateTitle(value));
  }

  function onAddTodo() {
    setIsValidated(true);

    if (isTitleValid) {
      dispatch(addTodo({ listId, title }));
      onClose();
    }
  }

  return (
    <>
      <div className="mb-2">
        <FieldEditor
          text={title}
          placeholder="Добавить карточку"
          mustValidate
          isValid={isTitleValid}
          isValidated={isValidated}
          isLoading={false}
          onChange={onTitleChange}
          onEntered={onAddTodo}
          takeFocus
          testId={CreateTodoForm_TodoTitle_TestId}
        />
      </div>
      <CreateBtns
        acceptBtnText="Добавить"
        isLoading={false}
        onAccept={onAddTodo}
        onClose={onClose}
        actionBtnTestId={CreateTodoForm_CreateBtn_TestId}
        closeBtnTestId={CreateTodoForm_CloseBtn_TestId}
      />
    </>
  );
}
