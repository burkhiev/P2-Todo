import React, { useState } from 'react';

import { useAppSelector } from '../../../hooks/reduxHooks';
import useTodoValidators from '../../../hooks/useTodoValidators';
import { TodoTableId } from '../../../models/ITodoTable';
import { selectTableById, useUpdateTable } from '../../../store/api/apiSlice';
import InvalidArgumentError from '../../../service/errors/InvalidArgumentError';

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
    throw new InvalidArgumentError(INVALID_TABLE_ID_ERR_MSG);
  }

  const [validateName] = useTodoValidators();
  const [updateTable, { isLoading }] = useUpdateTable();

  const [name, setName] = useState(table.name);
  const [nameIsValid, setNameIsValid] = useState(validateName(table.name));
  const [isValidated, setIsValidated] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value ?? '';
    setNameIsValid(validateName(value));
    setName(value);
  }

  async function onEntered(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      onClose();
    }

    if (e.key !== 'Enter') {
      return;
    }

    setIsValidated(true);

    if (nameIsValid && table) {
      await updateTable({ id: table.id, name }).unwrap();
      onClose();
    }
  }

  function onClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  let content: any;
  let invalidStyle: any;

  if (isValidated && !nameIsValid) {
    invalidStyle = 'is-invalid';
  }

  if (isLoading) {
    content = (
      <input
        type="text"
        className="w-100 placeholder placeholder-lg"
        autoFocus={false}
      />
    );
  } else {
    content = (
      <input
        type="text"
        value={name}
        onChange={onChange}
        onClick={onClick}
        onKeyDown={onEntered}
        className={`w-100 form-control form-control-sm ${invalidStyle}`}
        autoFocus
      />
    );
  }

  return (
    <div className="w-100 ms-2 border placeholder-glow">
      {content}
    </div>
  );
}
