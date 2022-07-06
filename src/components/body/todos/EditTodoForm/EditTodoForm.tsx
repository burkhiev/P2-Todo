import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from './EditTodoForm.css';

import { useAppSelector } from '../../../../hooks/reduxHooks';
import { TodoId } from '../../../../models/ITodo';
import { removeTodo, selectTodoById, updateTodoText } from '../../../../store/todo/todoSlice';
import BtnStyles from '../../buttons/BootstrapBtnStyles';
import FieldEditor from '../../editors/FieldEditor';
import useTodoValidators from '../../../../hooks/useTodoValidators';

const NO_EXIST_TODO_ID_ERR_MSG = 'Invalid argument error. Non-existent "todoId" received.';

interface ITodoCardEditorProps {
  todoId: TodoId,
  onRemove?: () => void,
  onClose?: (...args: any[]) => void,
}

export default function EditTodoForm(args: ITodoCardEditorProps) {
  const {
    todoId,
    onClose: onCloseAction = () => { },
    onRemove = () => { },
  } = args;

  const todo = useAppSelector((state) => selectTodoById(state, todoId));
  if (!todo) {
    throw new Error(NO_EXIST_TODO_ID_ERR_MSG);
  }

  const dispatch = useDispatch();

  const [validateTitle] = useTodoValidators();

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [isTitleValid, setIsTitleValid] = useState(validateTitle(todo.title));
  const [isValidated, setIsValidated] = useState(false);

  function onTitleChange(value: string) {
    setTitle(value);
    setIsTitleValid(validateTitle(value));
  }

  function resetStates() {
    if (!todo) {
      throw new Error(NO_EXIST_TODO_ID_ERR_MSG);
    }

    setTitle(todo.title);
    setDescription(todo.description);
    setIsTitleValid(validateTitle(todo.title));
    setIsValidated(false);
  }

  function onClose(e: React.MouseEvent) {
    e.stopPropagation();
    onCloseAction();
  }

  function onSaveTodo(e?: React.MouseEvent) {
    e?.stopPropagation();

    if (isTitleValid) {
      dispatch(updateTodoText({
        todoId,
        title,
        description,
      }));

      resetStates();
      onCloseAction();
    }

    setIsValidated(true);
  }

  function onRemoveTodo(e: React.MouseEvent) {
    e.stopPropagation();

    dispatch(removeTodo(todoId));
    resetStates();
    onRemove();

    onCloseAction();
  }

  const content = (
    <div className={`${styles.edit_todo_form}`}>
      <div className="mb-2">
        <FieldEditor
          text={title}
          placeholder="Заголовок карточки"
          mustValidate
          isValid={isTitleValid}
          isValidated={isValidated}
          isLoading={false}
          onChange={onTitleChange}
          onEntered={onSaveTodo}
          takeFocus
        />
      </div>
      <div className="mb-2">
        <FieldEditor
          text={description ?? ''}
          placeholder="Описание карточки"
          isLoading={false}
          onChange={setDescription}
          onEntered={onSaveTodo}
        />
      </div>
      <div className="d-flex">
        <div className="mt-1">
          <button
            type="button"
            className={`${BtnStyles.accept} mb-2`}
            onClick={onSaveTodo}
          >
            Сохранить
          </button>
          <button
            type="button"
            className={BtnStyles.delete}
            onClick={onRemoveTodo}
          >
            Удалить
          </button>
        </div>
        <button
          type="button"
          className={`${BtnStyles.close} align-self-start`}
          onClick={onClose}
        >
          <span className={BtnStyles.closeIcon} />
        </button>
      </div>
    </div>
  );

  return content;
}
