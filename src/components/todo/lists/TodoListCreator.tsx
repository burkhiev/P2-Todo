import classnames from 'classnames';
import React, { useState } from 'react';

import { useAppDispatch } from '../../../hooks/reduxHooks';
import { TodoTableId } from '../../../models/ITodoTable';
import { listAdded, listRemoved } from '../../../store/todo/listSlice';

interface ITodoListCreatorProps {
  tableId: TodoTableId
}

export default function TodoListCreator(props: ITodoListCreatorProps) {
  const { tableId } = props;

  const dispatch = useAppDispatch();
  
  const [isActive, setIsActive] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [listTitle, setListTitle] = useState('');

  function setDefaultStates() {
    setIsActive(false);
    setIsValidated(false);
    setListTitle('');
  }

  function onOpenAddForm() {
    setIsActive(true);
  }

  function onCloseAddForm() {
    setDefaultStates();
  }

  function onAddList() {
    setIsValidated(true);

    if (listTitle) {
      dispatch(listAdded(tableId, listTitle));
      setDefaultStates();
    }
  }

  function onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value ?? '';
    setListTitle(value);
  }

  let content: any;

  if (isActive) {
    let isValid = !isValidated || (isValidated && listTitle.length > 0);
    let inputCss = `form-control ${isValid ? '' : 'is-invalid'}`;

    content = (
      <>
        <div className='mb-1'>
          <input
            type='text'
            value={listTitle}
            placeholder='Ввести заголовок списка'
            className={inputCss}
            onChange={onTitleChange}
          />
        </div>
        <div className='d-flex align-items-center'>
          <div className='col-8'>
            <button
              type='button'
              className='btn btn-primary btn-sm col-12'
              onClick={onAddList}
            >
              Добавить
            </button>
          </div>
          <div className='col d-flex'>
            <button
              type='button'
              className='btn ms-2 p-0'
              onClick={onCloseAddForm}
            >
              <span className='bi bi-x-square fs-4'></span>
            </button>
          </div>
        </div>
      </>
    )

  } else {
    content = (
      <div className='d-flex'>
        <button
          type='button'
          className='btn btn-outline-secondary col'
          onClick={onOpenAddForm}
        >
          Добавьте ещё одну колонку
        </button>
      </div>
    );
  }

  return (
    <div>
      {content}
    </div>
  )
}
