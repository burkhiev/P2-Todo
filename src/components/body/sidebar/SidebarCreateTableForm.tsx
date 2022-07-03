import React, { useState } from 'react';

import useTableService from '../../../hooks/useTableService';
import useTodoValidators from '../../../hooks/useTodoValidators';
import { TodoTableId } from '../../../models/ITodoTable';
import CreateBtns from '../buttons/CreateBtns';
import FieldEditor from '../editors/FieldEditor';

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

  function onTitleChange(value: string) {
    setName(value);
    setIsTitleValid(validateTitle(value));
  }

  const { addTable } = useTableService();

  function onAddTodo() {
    setIsValidated(true);

    if (isTitleValid) {
      const newTableId = addTable(name);
      onClose(newTableId);
    }
  }

  return (
    <>
      <div className="mb-2">
        <FieldEditor
          text={name}
          placeholder="Добавить таблицу"
          mustValidate
          isValid={isTitleValid}
          isValidated={isValidated}
          onChange={onTitleChange}
          onEntered={onAddTodo}
          takeFocus
        />
      </div>
      <CreateBtns
        onAccept={onAddTodo}
        onClose={onClose}
        acceptBtnText="Добавить"
      />
    </>
  );
}
