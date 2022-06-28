import React from 'react';
import useTodoDrop from '../../../hooks/useTodoDrop';
import { TodoListId } from '../../../models/ITodoList';

interface ITodoCardPlaceholderProps {
  listId: TodoListId,
  insertBeforeTodoIndex: number
}

export default function TodoCardPlaceholder(props: ITodoCardPlaceholderProps) {
  const { insertBeforeTodoIndex, listId } = props;

  const [, drop] = useTodoDrop(listId, insertBeforeTodoIndex);

  return (
    <div ref={drop} className="v-stack mb-1">
      <div className="d-flex rounded border-bottom">
        <button
          type="button"
          className="d-block flex-grow-1 pt-3 pb-3 btn rounded bg-success text-start"
        >
          <span className="visually-hidden">placeholder</span>
        </button>
      </div>
    </div>
  );
}
