import React, { useCallback } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import styles from './Table.css';

import { TodoTableId } from '../../../models/ITodoTable';
import { useAppSelector } from '../../../hooks/reduxHooks';
import ListCreatorExpander from '../lists/ListCreator/ListCreatorExpander';
import { ITodoList, TodoListId } from '../../../models/ITodoList';
import { INVALID_TABLE_ID } from '../../../service/Consts';
import TablePlaceholder from './TablePlaceholder/TablePlaceholder';
import { selectTableById } from '../../../store/api/tableSlice';
import { selectListsByTableId, useGetLists, useMoveList } from '../../../store/api/listSlice';
import { useGetTodos, useMoveTodo } from '../../../store/api/todoSlice';
import List from '../lists/List/List';
import DndTypes from '../../../service/DndTypes';
import InvalidArgumentError from '../../../service/errors/InvalidArgumentError';

export const Table_Header_TestId = 'Table_Header';

// Баг ESLint
// eslint-disable-next-line no-shadow
export enum TodoListDropSide {
  AFTER,
  BEFORE
}

export interface IOnDropArg {
  listId: TodoListId,
  placeholderIndex: number,
  placeholderDropSide: TodoListDropSide
}

export interface IOnDropReturnType {
  list: ITodoList,
  dropSide: TodoListDropSide
}

interface ITableProps {
  tableId?: TodoTableId,
}

export default function Table(props: ITableProps) {
  const { tableId } = props;
  const table = useAppSelector((state) => selectTableById(state, tableId ?? INVALID_TABLE_ID));

  if (!table) {
    throw new InvalidArgumentError('Invalid table ID received.');
  }

  const lists = useAppSelector((state) => selectListsByTableId(state, table.id));

  const [moveTodo] = useMoveTodo(undefined);
  const [moveList] = useMoveList(undefined);

  const {
    isLoading: isListsLoading,
    isSuccess: isListsSuccess,
  } = useGetLists(undefined);

  const {
    isLoading: isTodosLoading,
    isSuccess: isTodosSuccess,
  } = useGetTodos(undefined);

  let listContent: JSX.Element[] = [];

  if (
    !isListsLoading
    && isListsSuccess
    && !isTodosLoading
    && isTodosSuccess
  ) {
    listContent = lists.map((list, index) =>
      <List key={list.id} listId={list.id} index={index} />);
  }

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (isTodosLoading || !isTodosSuccess) {
      return;
    }

    if (!destination) {
      return;
    }

    if (source.index < 0 || lists.length <= source.index) {
      return;
    }

    if (
      source.droppableId === destination.droppableId
      && source.index === destination.index
    ) {
      return;
    }

    if (result.type === DndTypes.todo) {
      moveTodo({
        todoId: draggableId,
        srcListId: source.droppableId,
        srcIndex: source.index,
        destListId: destination.droppableId,
        destIndex: destination.index,
      });
    }

    if (result.type === DndTypes.list) {
      moveList({
        listId: draggableId,
        tableId: source.droppableId,
        srcIndex: source.index,
        destIndex: destination.index,
      });
    }
  }, [isTodosSuccess, isTodosLoading, moveTodo, moveList, lists.length]);

  let content: any;

  if (!isListsLoading && table) {
    content = (
      <>
        <div className={styles.table_name} data-testid={Table_Header_TestId}>
          {table.name}
        </div>
        <Droppable droppableId={table.id} type={DndTypes.list} direction="horizontal">
          {(provider) => (
            <div
              id={table.id}
              ref={provider.innerRef}
              {...provider.droppableProps}
              className={`${styles.table_lists}`}
            >
              {listContent}
              <ListCreatorExpander key={tableId} tableId={table.id} index={lists.length} />
              {provider.placeholder}
            </div>
          )}
        </Droppable>
      </>
    );
  } else {
    content = <TablePlaceholder isLoading={isListsLoading} />;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`bg-white ${styles.table_container}`}>
        {content}
      </div>
    </DragDropContext>
  );
}
