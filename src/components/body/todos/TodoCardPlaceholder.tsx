import React from 'react';

import useTodoDrop from '../../../hooks/dnd/useTodoDrop';
import { TodoListId } from '../../../models/ITodoList';

interface ITodoCardPlaceholderProps {
  listId: TodoListId,
  insertIndex: number,
  onDrop: () => void
}

export default function TodoCardPlaceholder(props: ITodoCardPlaceholderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { insertIndex, listId, onDrop } = props;

  const [, drop] = useTodoDrop(listId, insertIndex, onDrop);

  return (
    <div ref={drop} className="v-stack mb-1">
      <div className="d-flex rounded border-bottom">
        <button
          type="button"
          className="d-block flex-grow-1 p-4 btn rounded bg-success opacity-50 text-start"
        >
          <span className="visually-hidden">placeholder</span>
        </button>
      </div>
    </div>
  );
}
