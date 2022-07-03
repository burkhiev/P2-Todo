import React, { useState } from 'react';
import classnames from 'classnames';

import { useAppSelector } from '../../../../hooks/reduxHooks';
import useTodoValidators from '../../../../hooks/useTodoValidators';
import { TodoTableId } from '../../../../models/ITodoTable';
import { selectTableById } from '../../../../store/todo/tableSlice';
import useTableService from '../../../../hooks/useTableService';

const INVALID_TABLE_ID_ERR_MSG = 'Invalid argument error.'
  + ' Non-existed "tableId" received.';

interface ISidebarEditTableTitleFormProps {
  tableId: TodoTableId,
  onClose: () => void
}

export default function SidebarEditTableTitleForm(props: ISidebarEditTableTitleFormProps) {
  const { tableId, onClose } = props;
  const table = useAppSelector((state) => selectTableById(state, tableId));

  if (!table) {
    throw new Error(INVALID_TABLE_ID_ERR_MSG);
  }

  const [validateName] = useTodoValidators();
  const [name, setName] = useState(table.name);
  const [nameIsValid, setNameIsValid] = useState(validateName(table.name));
  const [isValidated, setIsValidated] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value ?? '';
    setNameIsValid(validateName(value));
    setName(value);
  }

  const { updateTable } = useTableService(table.tableId);

  function onEntered(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      onClose();
    }

    if (e.key !== 'Enter') {
      return;
    }

    setIsValidated(true);

    if (nameIsValid && table) {
      updateTable(name);
      onClose();
    }
  }

  function onClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  const inputClasses = ['form-control'];

  if (isValidated && !nameIsValid) {
    inputClasses.push('is-invalid');
  }

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={onChange}
        onClick={onClick}
        onKeyDown={onEntered}
        className={classnames(inputClasses)}
        autoFocus
      />
    </div>
  );
}
