import React, { useEffect, useState } from 'react';

import styles from './Table.css';

import { TodoTableId } from '../../../models/ITodoTable';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { selectTableById } from '../../../store/todo/tableSlice';
import ListCreatorExpander from '../lists/ListCreator/ListCreatorExpander';
import ListDragDropWrap from '../lists/ListDragDropWrap';
import { selectListsByTableId } from '../../../store/todo/listSlice';
import ListPlaceholder from '../lists/ListPlaceholder/ListPlaceholder';
import { TodoListId } from '../../../models/ITodoList';
import useTodoListDropInfo from '../../../hooks/dnd/useTodoListDropInfo';
import { INVALID_TABLE_ID } from '../../../service/Consts';
import TablePlaceholder from './TablePlaceholder/TablePlaceholder';

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
  listId: TodoListId,
  dropSide: TodoListDropSide
}

interface ITableProps {
  tableId?: TodoTableId
}

export default function Table(props: ITableProps) {
  const { tableId } = props;

  const table = useAppSelector((state) => selectTableById(state, tableId ?? INVALID_TABLE_ID));
  const lists = useAppSelector((state) => selectListsByTableId(state, tableId ?? INVALID_TABLE_ID));

  const [placeholderIndex, setPlaceholderIndex] = useState(-1);
  const [placeholderDropSide, setPlaceholderDropSide] = useState(TodoListDropSide.AFTER);
  const [fadedListIndex, setFadedListIndex] = useState(-1);

  function setDefaultStates() {
    setFadedListIndex(-1);
    setPlaceholderIndex(-1);
    setPlaceholderDropSide(TodoListDropSide.AFTER);
  }

  const [{ listIsOver }] = useTodoListDropInfo();

  useEffect(() => {
    if (!listIsOver) {
      setDefaultStates();
    }
  }, [listIsOver]);

  function onDragging(index: number) {
    setFadedListIndex(index);

    if (lists.length === 1) {
      setPlaceholderIndex(index);
      return;
    }

    if (index > 0) {
      setPlaceholderIndex(index - 1);
      setPlaceholderDropSide(TodoListDropSide.AFTER);
    } else {
      setPlaceholderIndex(index + 1);
      setPlaceholderDropSide(TodoListDropSide.BEFORE);
    }
  }

  function onDrop(arg: IOnDropArg): (IOnDropReturnType | undefined) {
    const { listId, placeholderDropSide: phDropSide, placeholderIndex: phIndex } = arg;

    if (phIndex < 0 || lists.length <= phIndex) {
      return undefined;
    }

    setDefaultStates();

    return {
      listId,
      dropSide: phDropSide,
    };
  }

  function onDropOver(index: number) {
    if (placeholderIndex === index) {
      if (placeholderDropSide === TodoListDropSide.AFTER) {
        setPlaceholderDropSide(TodoListDropSide.BEFORE);
      } else {
        setPlaceholderDropSide(TodoListDropSide.AFTER);
      }
    }

    setPlaceholderIndex(index);
  }

  const listContent = lists.map((list, index) => {
    let content;

    if (fadedListIndex !== index) {
      content = (
        <ListDragDropWrap
          listId={list.listId}
          key={list.listId}
          onDragging={() => onDragging(index)}
          onDropOver={() => onDropOver(index)}
        />
      );
    }

    let beforeContent;
    let afterContent;

    if (index === placeholderIndex) {
      const placeholder = (
        <ListPlaceholder
          key="PLACEHOLDER"
          listId={list.listId}
          placeholderDropSide={placeholderDropSide}
          placeholderIndex={placeholderIndex}
          onDrop={onDrop}
        />
      );

      beforeContent = placeholderDropSide === TodoListDropSide.BEFORE ? placeholder : '';
      afterContent = placeholderDropSide === TodoListDropSide.AFTER ? placeholder : '';
    }

    return (
      <React.Fragment key={list.listId}>
        {beforeContent}
        {content}
        {afterContent}
      </React.Fragment>
    );
  });

  let content: any;

  if (table) {
    content = (
      <div className={`v-stack border pb-3 ${styles.current_table}`}>
        <div className="m-5 mt-4 fs-4">
          {table.name}
        </div>
        <div className="container">
          <div className="row gy-4 row-cols-sm-2 row-cols-xl-4">
            {listContent}
            <ListCreatorExpander key={tableId} tableId={table.tableId} />
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className={`border ${styles.current_table}`}>
        <TablePlaceholder />
      </div>
    );
  }

  return content;
}
