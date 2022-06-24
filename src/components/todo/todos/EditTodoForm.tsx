import React from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../../hooks/reduxHooks';
import useTodoEditor from '../../../hooks/useTodoEditor';
import { TodoId } from '../../../models/ITodo';
import { removeTodo, selectTodoById, updateTodo } from '../../../store/todo/todoSlice';
import BtnStyles from '../buttons/BtnStyles';
import FieldEditor from '../editors/FieldEditor';

interface ITodoCardEditorProps {
  todoId: TodoId,
  onClose?: (...args: any[]) => void
}

export default function EditTodoForm(args: ITodoCardEditorProps) {
  const { todoId, onClose: onCloseAction = () => {} } = args;

  const dispatch = useDispatch();

  const todo = useAppSelector((state) => selectTodoById(state, todoId));
  if (!todo) {
    throw new Error('EditTodoForm component cannot be used with inexistent todo.');
  }

  const {
    resetStates,
    title,
    setTitle,
    isTitleValid,
    description,
    setDescription,
    isValidated,
    setIsValidated,
  } = useTodoEditor({
    title: todo.title,
    description: todo.description,
  });

  function onClose(e: React.MouseEvent) {
    e.stopPropagation();
    onCloseAction();
  }

  function onSaveTodo(e: React.MouseEvent) {
    e.stopPropagation();

    if (isTitleValid) {
      dispatch(updateTodo(todoId, title, description));
      resetStates();
      onCloseAction();
    }

    setIsValidated(true);
  }

  function onRemoveTodo(e: React.MouseEvent) {
    e.stopPropagation();

    resetStates();
    dispatch(removeTodo(todoId));
    onCloseAction();
  }

  const content = (
    <div>
      <FieldEditor
        text={title}
        placeholder="Заголовок карточки"
        mustValidate
        isValid={isTitleValid}
        isValidated={isValidated}
        onChange={setTitle}
        takeFocus
      />
      <FieldEditor
        text={description}
        placeholder="Описание карточки"
        onChange={setDescription}
      />
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
