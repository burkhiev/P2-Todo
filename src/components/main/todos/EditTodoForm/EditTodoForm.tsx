import React, { useState } from 'react';

import styles from './EditTodoForm.css';

import { useAppSelector } from '../../../../hooks/reduxHooks';
import { ITodo, TodoId } from '../../../../models/ITodo';
import BtnStyles from '../../shared/buttons/BootstrapBtnStyles';
import FieldEditor from '../../shared/editors/FieldEditor';
import useTodoValidators from '../../../../hooks/useTodoValidators';
import { selectTodoById, useDeleteTodo, useUpdateTodo } from '../../../../store/api/todoSlice';

export const EditTodoForm_TestId = 'EditTodoForm';
export const EditTodoForm_TitleInput_TestId = 'EditTodoForm_TitleInput';
export const EditTodoForm_DescriptionInput_TestId = 'EditTodoForm_DescriptionInput';
export const EditTodoForm_SaveBtn_TestId = 'EditTodoForm_SaveBtn';
export const EditTodoForm_DeleteBtn_TestId = 'EditTodoForm_DeleteBtn';

const NO_EXIST_TODO_ID_ERR_MSG = 'Invalid argument error. Non-existent "todoId" received.';

interface ITodoCardEditorProps {
  todoId: TodoId,
  onClose: (...args: any[]) => void,
}

export default function EditTodoForm(args: ITodoCardEditorProps) {
  const { todoId, onClose: onCloseAction } = args;

  const todo = useAppSelector((state) => selectTodoById(state, todoId));
  if (!todo) {
    throw new Error(NO_EXIST_TODO_ID_ERR_MSG);
  }

  const [validateTitle] = useTodoValidators();
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [isTitleValid, setIsTitleValid] = useState(validateTitle(todo.title));
  const [isValidated, setIsValidated] = useState(false);
  const [updateTodo] = useUpdateTodo();
  const [deleteTodo] = useDeleteTodo();

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

    if (isTitleValid && todo) {
      const newTodo: ITodo = {
        ...todo,
        title,
        description,
      };

      updateTodo(newTodo);
      resetStates();
      onCloseAction();
    }

    setIsValidated(true);
  }

  async function onRemoveTodo(e: React.MouseEvent) {
    e.stopPropagation();

    if (todo) {
      await deleteTodo(todo.id).unwrap();
      resetStates();
      onCloseAction();
    }
  }

  const content = (
    <div
      className={`${styles.edit_todo_form}`}
      data-testid={EditTodoForm_TestId}
    >
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
          testId={EditTodoForm_TitleInput_TestId}
        />
      </div>
      <div className="mb-2">
        <FieldEditor
          text={description ?? ''}
          placeholder="Описание карточки"
          isLoading={false}
          onChange={setDescription}
          onEntered={onSaveTodo}
          testId={EditTodoForm_DescriptionInput_TestId}
        />
      </div>
      <div className="d-flex">
        <div className="mt-1">
          <button
            type="button"
            className={`${BtnStyles.accept} mb-2`}
            onClick={onSaveTodo}
            data-testid={EditTodoForm_SaveBtn_TestId}
          >
            Сохранить
          </button>
          <button
            type="button"
            className={BtnStyles.delete}
            onClick={onRemoveTodo}
            data-testid={EditTodoForm_DeleteBtn_TestId}
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
