import React from 'react';
import { useDispatch } from 'react-redux';

import useTodoEditor from '../../../hooks/useTodoEditor';
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

  const dispatch = useDispatch();

  const {
    title,
    setTitle,
    isTitleValid,
    setIsValidated,
    isValidated,
  } = useTodoEditor({ title: '' });

  function onAddTodo() {
    setIsValidated(true);

    if (isTitleValid) {
      dispatch(addTodo(listId, title));
      onClose();
    }
  }

  return (
    <>
      <FieldEditor
        text={title}
        placeholder="Добавить карточку"
        mustValidate
        isValid={isTitleValid}
        isValidated={isValidated}
        onChange={setTitle}
        onEntered={onAddTodo}
        takeFocus
      />
      <CreateBtns
        onAccept={onAddTodo}
        onClose={onClose}
        acceptBtnText="Добавить"
      />
    </>
  );
}
