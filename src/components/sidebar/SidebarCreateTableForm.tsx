import React, { useState } from 'react';

import useTodoValidators from '../../hooks/useTodoValidators';
import { TodoTableId } from '../../models/ITodoTable';
import { useCreateTable } from '../../store/api/apiSlice';
import CreateBtns from '../body/buttons/CreateBtns';
import FieldEditor from '../body/editors/FieldEditor';

interface ISidebarCreateTableFormProps {
  onClose?: (tableId?: TodoTableId) => void
}

export default function SidebarCreateTableForm(props: ISidebarCreateTableFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClose = (_) => { } } = props;

  const [name, setName] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validateTitle] = useTodoValidators();
  const [addTable, { isLoading }] = useCreateTable();

  function onTitleChange(value: string) {
    setName(value);
    setIsTitleValid(validateTitle(value));
  }

  async function onAddTodo() {
    setIsValidated(true);

    if (isTitleValid) {
      try {
        const result = await addTable({ name }).unwrap();
        onClose(result.id);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error :>> ', error);
      }
    }
  }

  let onAdd = onAddTodo;

  if (isLoading) {
    onAdd = async () => { };
  }

  return (
    <div>
      <div className="mb-2">
        <FieldEditor
          text={name}
          placeholder="Добавить таблицу"
          mustValidate
          isValid={isTitleValid}
          isValidated={isValidated}
          isLoading={isLoading}
          onChange={onTitleChange}
          onEntered={onAdd}
          takeFocus
        />
      </div>
      <CreateBtns
        acceptBtnText="Добавить"
        isLoading={isLoading}
        onAccept={onAdd}
        onClose={onClose}
      />
    </div>
  );
}
