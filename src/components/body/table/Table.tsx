import React, { useCallback, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import styles from './Table.css';

import { TodoTableId } from '../../../models/ITodoTable';
import { useAppSelector } from '../../../hooks/reduxHooks';
import ListCreatorExpander from '../lists/ListCreator/ListCreatorExpander';
import ListPlaceholder from '../lists/ListPlaceholder/ListPlaceholder';
import { ITodoList, TodoListId } from '../../../models/ITodoList';
import { INVALID_TABLE_ID } from '../../../service/Consts';
import TablePlaceholder from './TablePlaceholder/TablePlaceholder';
import { selectTableById } from '../../../store/api/tableSlice';
import { selectListsByTableId, useGetLists } from '../../../store/api/listSlice';
import { useGetTodos, useMoveTodo } from '../../../store/api/todoSlice';
import List from '../lists/List/List';
import DndTypes from '../../../service/DndTypes';
import InvalidArgumentError from '../../../service/errors/InvalidArgumentError';

export const testId_Table_Header = 'Table_Header';

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

  const [placeholderIndex, setPlaceholderIndex] = useState(-1);
  const [placeholderDropSide, setPlaceholderDropSide] = useState(TodoListDropSide.AFTER);
  const [fadedListIndex, setFadedListIndex] = useState(-1);
  const [moveTodo] = useMoveTodo(undefined);

  const {
    isLoading: isListsLoading,
    isSuccess: isListsSuccess,
  } = useGetLists(undefined);

  const {
    isLoading: isTodosLoading,
    isSuccess: isTodosSuccess,
  } = useGetTodos(undefined);

  function setDefaultStates() {
    setFadedListIndex(-1);
    setPlaceholderIndex(-1);
    setPlaceholderDropSide(TodoListDropSide.AFTER);
  }

  // function onDragging(index: number) {
  //   setFadedListIndex(index);

  //   if (lists.length === 1) {
  //     setPlaceholderIndex(index);
  //     return;
  //   }

  //   if (index > 0) {
  //     setPlaceholderIndex(index - 1);
  //     setPlaceholderDropSide(TodoListDropSide.AFTER);
  //   } else {
  //     setPlaceholderIndex(index + 1);
  //     setPlaceholderDropSide(TodoListDropSide.BEFORE);
  //   }
  // }

  function onDrop(arg: IOnDropArg): (IOnDropReturnType | undefined) {
    const { listId, placeholderDropSide: phDropSide, placeholderIndex: phIndex } = arg;

    if (phIndex < 0 || lists.length <= phIndex) {
      return undefined;
    }

    setDefaultStates();

    const list = lists.find((l) => l.id === listId);

    if (!list) {
      return undefined;
    }

    return { list, dropSide: phDropSide };
  }

  // function onDropOver(index: number) {
  //   if (placeholderIndex === index) {
  //     if (placeholderDropSide === TodoListDropSide.AFTER) {
  //       setPlaceholderDropSide(TodoListDropSide.BEFORE);
  //     } else {
  //       setPlaceholderDropSide(TodoListDropSide.AFTER);
  //     }
  //   }

  //   setPlaceholderIndex(index);
  // }

  let listContent: JSX.Element[] = [];

  if (!isListsLoading && isListsSuccess) {
    listContent = lists.map((list, index) => {
      const content = fadedListIndex !== index
        ? <List listId={list.id} key={list.id} />
        : undefined;

      let beforeContent;
      let afterContent;

      if (index === placeholderIndex) {
        const placeholder = (
          <ListPlaceholder
            key="PLACEHOLDER"
            listId={list.id}
            placeholderDropSide={placeholderDropSide}
            placeholderIndex={placeholderIndex}
            onDrop={onDrop}
          />
        );

        beforeContent = placeholderDropSide === TodoListDropSide.BEFORE ? placeholder : '';
        afterContent = placeholderDropSide === TodoListDropSide.AFTER ? placeholder : '';
      }

      return (
        <React.Fragment key={list.id}>
          {beforeContent}
          {content}
          {afterContent}
        </React.Fragment>
      );
    });
  }

  let content: any;

  if (!isListsLoading && table) {
    content = (
      <div className={`bg-white ${styles.table_container}`}>
        <div
          className={styles.table_name}
          data-testid={testId_Table_Header}
        >
          {table.name}
        </div>
        <div className={`container m-3 ${styles.table}`}>
          <div className={`row g-4 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-4 ${styles.table}`}>
            {listContent}
            <ListCreatorExpander key={tableId} tableId={table.id} />
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className={`border bg-white ${styles.table}`}>
        <TablePlaceholder isLoading={isListsLoading} />
      </div>
    );
  }

  const onTodoDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (isTodosLoading || !isTodosSuccess) {
      return;
    }

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId
      && source.index === destination.index
    ) {
      return;
    }

    if (result.type === DndTypes.TODO) {
      moveTodo({
        todoId: draggableId,
        srcListId: source.droppableId,
        srcIndex: source.index,
        destListId: destination.droppableId,
        destIndex: destination.index,
      });
    }
  }, [isTodosSuccess, isTodosLoading, moveTodo]);

  return (
    <DragDropContext onDragEnd={onTodoDragEnd}>
      {content}
    </DragDropContext>
  );
}
