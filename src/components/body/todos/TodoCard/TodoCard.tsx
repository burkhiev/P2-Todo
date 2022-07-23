/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import styles from './TodoCard.css';

import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import EditTodoForm from '../EditTodoForm/EditTodoForm';
import { curtainOff, curtainOn } from '../../../../store/style/curtainSlice';
import { TodoId } from '../../../../models/ITodo';
import { selectTodoById } from '../../../../store/api/todoSlice';

export interface ITodoCardProps {
  todoId: TodoId,
  index: number
}

export default function TodoCard(props: ITodoCardProps) {
  const { todoId, index } = props;

  const todo = useAppSelector((state) => selectTodoById(state, todoId));
  if (!todo) {
    throw new Error('Invalid argument error. Specified "todoId" doesn\'t exist.');
  }

  const dispatch = useAppDispatch();
  const [showEditForm, setShowEditForm] = useState<any>(null);

  const onCloseEdit = useCallback(() => {
    document.body.removeEventListener('click', onCloseEdit);
    dispatch(curtainOff());
    setShowEditForm(false);
  }, [dispatch]);

  const onOpenEdit = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    dispatch(curtainOn());
    document.body.addEventListener('click', onCloseEdit);
    setShowEditForm(true);
  }, [dispatch, onCloseEdit]);

  const onKeyDownOpenEdit = useCallback(() => {
    onOpenEdit();
  }, [onOpenEdit]);

  const editForm = showEditForm
    ? <EditTodoForm todoId={todo.id} onClose={onCloseEdit} />
    : undefined;

  const btnCss = 'd-flex w-100 p-2 rounded border bg-white text-start';

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className="mb-1"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {editForm}
          <div
            onClick={onOpenEdit}
            onKeyDown={onKeyDownOpenEdit}
            className={`${btnCss} ${styles.appearing_pen_container}`}
            role="button"
            tabIndex={0}
          >
            <span className="text-truncate text-nowrap">{todo.title}</span>
            <span className={`ms-auto bi bi-pen text-muted fs-6 ${styles.appearing_pen}`} />
          </div>
        </div>
      )}
    </Draggable>
  );
}
