import React, { useEffect, useState } from 'react';

import './todoCard.css';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import EditTodoForm from './EditTodoForm';
import { curtainOff, curtainOn } from '../../../store/style/curtainSlice';
import { TodoId } from '../../../models/ITodo';
import { selectTodoById } from '../../../store/todo/todoSlice';
import useTodoDrag from '../../../hooks/useTodoDrag';
import useTodoDropWithoutInsert from '../../../hooks/useTodoDropWithoutInsert';

export interface ITodoCardProps {
  todoId: TodoId,
  onIsDropOver: () => void
}

export default function TodoCard(props: ITodoCardProps) {
  const { todoId, onIsDropOver } = props;

  const todo = useAppSelector((state) => selectTodoById(state, todoId));

  if (!todo) {
    throw new Error('Invalid todoId prop.');
  }

  const dispatch = useAppDispatch();

  const [showEditForm, setShowEditForm] = useState<any>(null);

  const [{ isDragging }, drag] = useTodoDrag(todo.todoId);
  const [{ isOver, draggedTodo }, drop] = useTodoDropWithoutInsert(todo.listId);

  useEffect(() => {
    if (isOver && draggedTodo.todoId !== todo.todoId) {
      onIsDropOver();
    }
  }, [isOver, draggedTodo, todo.todoId, onIsDropOver]);

  function onCloseEdit(this: HTMLElement) {
    dispatch(curtainOff());
    document.body.removeEventListener('click', onCloseEdit);
    setShowEditForm(false);
  }

  function onOpenEdit(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch(curtainOn());
    document.body.addEventListener('click', onCloseEdit);
    setShowEditForm(true);
  }

  let editForm: any;

  if (showEditForm) {
    editForm = <EditTodoForm todoId={todo.todoId} onClose={onCloseEdit} />;
  }

  return (
    <div ref={drop} className={`v-stack pb-1 ${isDragging ? 'd-none' : ''}`}>
      {editForm}
      <div ref={drag} className="d-flex rounded border-bottom">
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
