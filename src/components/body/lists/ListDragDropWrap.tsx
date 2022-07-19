/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';

import useTodoListDrag from '../../../hooks/dnd/useTodoListDrag';
import useTodoListDropInfo from '../../../hooks/dnd/useTodoListDropInfo';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { TodoListId } from '../../../models/ITodoList';
import { selectListById } from '../../../store/api/listSlice';
import List from './List/List';

interface IListProps {
  listId: TodoListId,
  onDropOver: () => void,
  onDragging: () => void
}

export default function ListDragDropWrap(props: IListProps) {
  const { listId, onDropOver, onDragging } = props;

  const list = useAppSelector((state) => selectListById(state, listId));
  if (!list) {
    throw new Error('ListDragDropWrap component must have a valid "listId".');
  }

  const [{ isDragging }, listDrag] = useTodoListDrag(list.id);
  const [{ listIsOver }, listDrop] = useTodoListDropInfo();

  useEffect(() => {
    if (isDragging) {
      onDragging();
    }
  }, [isDragging]);

  useEffect(() => {
    if (listIsOver) {
      onDropOver();
    }
  }, [listIsOver]);

  return (
    <div ref={listDrop}>
      <div ref={listDrag}>
        <List key={listId} listId={listId} />
      </div>
    </div>
  );
}
