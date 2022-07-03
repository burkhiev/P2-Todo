import React from 'react';

import styles from './ListOptions.css';

import { TodoListId } from '../../../../models/ITodoList';
import useListService from '../../../../hooks/useListService';

interface IListOptionsProps {
  listId: TodoListId
}

export default function ListOptions(props: IListOptionsProps) {
  const { listId } = props;

  const { removeList } = useListService(listId);

  return (
    <div className="dropend">
      <button
        type="button"
        className="btn btn-light align-self-start"
        data-bs-toggle="dropdown"
        data-bs-offset="-5,10"
      >
        <span className="bi bi-three-dots" />
      </button>
      <div className={`dropdown-menu ${styles.todo_list_dropdown_menu_shadow}`}>
        <div className="p-2">
          <button
            type="button"
            className="dropdown-item"
            onClick={removeList}
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
