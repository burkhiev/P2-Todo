/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react';

import { useAppSelector } from '../../../hooks/reduxHooks';
import { TodoListId } from '../../../models/ITodoList';
import { selectListById } from '../../../store/api/listSlice';
import List from './List/List';

interface IListProps {
  listId: TodoListId,
  // onDropOver: () => void,
  // onDragging: () => void
}

export default function ListDragDropWrap(props: IListProps) {
  const { listId } = props;

  const list = useAppSelector((state) => selectListById(state, listId));
  if (!list) {
    throw new Error('ListDragDropWrap component must have a valid "listId".');
  }

  // const [{ isDragging }, listDrag] = useTodoListDrag(list.id);
  // const [{ listIsOver }, listDrop] = useTodoListDropInfo();

  // useEffect(() => {
  //   // console.info('ListDragDropWrap.onDragging: isDragging =', isDragging);
  //   if (isDragging) onDragging();
  // }, [isDragging]);

  // useEffect(() => {
  //   // console.info('ListDragDropWrap.onDropOver: listIsOver =', listIsOver);
  //   if (listIsOver) onDropOver();
  // }, [listIsOver]);

  return (
    <List key={listId} listId={listId} />
    // <div ref={listDrop}>
    //   <div ref={listDrag}>
    //     <List key={listId} listId={listId} />
    //   </div>
    // </div>
  );
}
