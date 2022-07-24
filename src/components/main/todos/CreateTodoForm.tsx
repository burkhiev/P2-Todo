import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/reduxHooks';

import useTodoValidators from '../../../hooks/useTodoValidators';
import { TodoListId } from '../../../models/ITodoList';
import InvalidArgumentError from '../../../service/errors/InvalidArgumentError';
import { selectListById } from '../../../store/api/listSlice';
import { useCreateTodo } from '../../../store/api/todoSlice';
import CreateBtns from '../shared/buttons/CreateBtns';
import FieldEditor from '../shared/editors/FieldEditor';

export const CreateTodoForm_TestId = 'CreateTodoForm';
export const CreateTodoForm_TodoTitle_TestId = 'CreateTodoForm_TodoTitle';
export const CreateTodoForm_CreateBtn_TestId = 'CreateTodoForm_CreateBtn';
export const CreateTodoForm_CloseBtn_TestId = 'CreateTodoForm_CloseBtn';

interface ICreateTodoFormProps {
  listId: TodoListId,
  onClose: () => void
}

export default function CreateTodoForm(props: ICreateTodoFormProps) {
  const { listId, onClose } = props;
  const list = useAppSelector((state) => selectListById(state, listId));

  if (!list) {
    throw new InvalidArgumentError('Invalid list ID received.');
  }

  const [title, setTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validateTitle] = useTodoValidators();
  const [createTodo] = useCreateTodo();

  function onTitleChange(value: string) {
    setTitle(value);
    setIsTitleValid(validateTitle(value));
  }

  function onAddTodo() {
    setIsValidated(true);

    if (isTitleValid && list) {
      createTodo({
        title,
        addedAt: '',
        listId: list.id,
        position: -1,
      });
      onClose();
    }
  }

  return (
    <div data-testid={CreateTodoForm_TestId}>
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
    </div>
  );
}
