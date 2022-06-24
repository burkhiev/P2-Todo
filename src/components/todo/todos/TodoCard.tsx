import React, { useState } from 'react';

import './todoCard.css';
import '../../css/relative.css';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { selectTodoById } from '../../../store/todo/todoSlice';
import EditTodoForm from './EditTodoForm';
import { curtainOff, curtainOn } from '../../../store/service/curtainSlice';

interface ITodoItemProps {
  todoId: string
}

export default function TodoCard(props: ITodoItemProps) {
  const { todoId } = props;

  const todo = useAppSelector((state) => selectTodoById(state, todoId));
  if (!todo) {
    throw new Error('todo item is empty.');
  }

  const dispatch = useAppDispatch();

  const [isOpened, setIsOpened] = useState(false);

  function onCloseEdit(this: HTMLElement) {
    dispatch(curtainOff());
    setIsOpened(false);
    document.body.removeEventListener('click', onCloseEdit);
  }

  function onOpenEdit(e: React.MouseEvent) {
    e.stopPropagation();

    dispatch(curtainOn());
    setIsOpened(true);
    document.body.addEventListener('click', onCloseEdit);
  }

  let content: any;

  if (isOpened) {
    content = (
      <div className="relative-editor">
        <EditTodoForm todoId={todo.todoId} onClose={onCloseEdit} />
      </div>
    );
  }

  return (
    <div className="v-stack mb-1">
      {content}
      <div className="d-flex">
        <button
          type="button"
          className="flex-grow-1 border rounded bg-white text-start"
          onClick={onOpenEdit}
        >
          <div className="appearing-pen-container d-flex">
            <span>{todo.title}</span>
            <span className="appearing-pen ms-auto bi bi-pen text-muted fs-6" />
          </div>
        </button>
      </div>
    </div>
  );
}
