import React, { useState } from 'react';
import { useAppDispatch } from '../../../hooks/reduxHooks';

import useTodoValidators from '../../../hooks/useTodoValidators';
import { TodoListId } from '../../../models/ITodoList';
import { addTodo } from '../../../store/todo/todoSlice';
import CreateBtns from '../buttons/CreateBtns';
import FieldEditor from '../editors/FieldEditor';

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
        />
      </div>
      <CreateBtns
        acceptBtnText="Добавить"
        isLoading={false}
        onAccept={onAddTodo}
        onClose={onClose}
      />
    </>
  );
}
