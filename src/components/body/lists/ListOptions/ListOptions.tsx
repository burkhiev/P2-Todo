import React, { useCallback } from 'react';

import styles from './ListOptions.css';

import { TodoListId } from '../../../../models/ITodoList';
import { useDeleteList } from '../../../../store/api/listSlice';

export const ListOptions_TestId = 'ListOptions';
export const ListOptionsDeleteBtn_TestId = 'ListOptionsDeleteBtn';
export const ListOptionsOpenBtn_TestId = 'ListOptionsOpenBtn';

interface IListOptionsProps {
  listId: TodoListId
}

export default function ListOptions(props: IListOptionsProps) {
  const { listId } = props;

  const [deleteList] = useDeleteList();
  const onDeleteList = useCallback(
    () => deleteList({ id: listId }),
    [listId, deleteList],
  );

  function onOpenOptions(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div
      // id={`${ListOptions_TestId}_${listId}`}
      data-testid={ListOptions_TestId}
      className="dropend"
    >
      <button
        data-testid={ListOptionsOpenBtn_TestId}
        type="button"
        data-bs-toggle="dropdown"
        data-bs-offset="-5,10"
        onClick={onOpenOptions}
        className="btn btn-light align-self-start"
      >
        <span className="bi bi-three-dots" />
      </button>
      <div className={`dropdown-menu ${styles.todo_list_dropdown_menu_shadow}`}>
        <div className="p-2">
          <button
            data-testid={ListOptionsDeleteBtn_TestId}
            type="button"
            className="dropdown-item"
            onClick={onDeleteList}
          >
            Удалить
          </button>
          <button
            type="button"
            className="dropdown-item disabled"
            disabled
            tabIndex={-1}
          >
            <span className="text-muted">Сортировать</span>
          </button>
        </div>
      </div>
    </div>
  );
}
