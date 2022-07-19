import React, { useState } from 'react';

import { useAppSelector } from '../../../hooks/reduxHooks';
import useTodoValidators from '../../../hooks/useTodoValidators';
import { TodoTableId } from '../../../models/ITodoTable';
import { selectTableById, useUpdateTable } from '../../../store/api/tableSlice';
import InvalidArgumentError from '../../../service/errors/InvalidArgumentError';
import FieldEditor from '../../body/shared/editors/FieldEditor';

const INVALID_TABLE_ID_ERR_MSG = 'Invalid argument error.'
  + ' Non-existed "tableId" received.';

export const testId_SidebarEditTableTitleForm = 'SidebarEditTableTitleForm';
export const testId_SidebarEditTableTitleForm_Field = 'SidebarEditTableTitleForm_Field';

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

  function onChange(value: string) {
    setNameIsValid(validateName(value));
    setName(value);
  }

  async function onEntered() {
    setIsValidated(true);

    if (nameIsValid && table) {
      await updateTable({ id: table.id, name }).unwrap();
      onClose();
    }
  }

  return (
    <div
      className="d-flex ps-3 w-100"
      data-testid={testId_SidebarEditTableTitleForm}
    >
      <FieldEditor
        isLoading={isLoading}
        onChange={onChange}
        text={name}
        isValid={nameIsValid}
        isValidated={isValidated}
        mustValidate
        onEntered={onEntered}
        placeholder="Введите название"
        takeFocus
        testId={testId_SidebarEditTableTitleForm_Field}
      />
    </div>
  );
}
