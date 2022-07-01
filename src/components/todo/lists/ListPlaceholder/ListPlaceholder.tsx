import React from 'react';

import styles from './ListPlaceholder.css';

import ListBootstrapStyles from '../List/ListBootstrapStyles';
import useTodoListDrop from '../../../../hooks/dragDrop/useTodoListDrop';
import { IOnDropArg, IOnDropReturnType } from '../../table/Table';

interface IListPlaceholderProps extends IOnDropArg {
  onDrop: (arg: IOnDropArg) => (IOnDropReturnType | undefined)
}

export default function ListPlaceholder(props: IListPlaceholderProps) {
  const {
    listId, placeholderDropSide, placeholderIndex, onDrop,
  } = props;

  const [, drop] = useTodoListDrop(() => onDrop({
    listId,
    placeholderDropSide,
    placeholderIndex,
  }), [listId, placeholderDropSide, placeholderIndex]);

  return (
    <div ref={drop}>
      <div className={`${ListBootstrapStyles.listPlaceholder} ${styles.todo_list_placeholder}`} />
    </div>
  );
}
