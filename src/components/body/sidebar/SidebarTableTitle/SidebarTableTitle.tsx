import React, { useState } from 'react';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import { TodoTableId } from '../../../../models/ITodoTable';
import { selectTableById } from '../../../../store/todo/tableSlice';
import TableTitleEditor from './SidebarEditTableTitleForm';

interface ISidebarTableTitleProps {
  tableId?: TodoTableId
}

export default function SidebarTableTitle(props: ISidebarTableTitleProps) {
  const { tableId } = props;

  const table = useAppSelector((state) => selectTableById(state, tableId ?? ''));

  const [editorOpen, setEditorOpen] = useState(false);

  function onClose() {
    setEditorOpen(false);
    document.body.removeEventListener('click', onClose);
  }

  function onOpen(e: React.MouseEvent) {
    e.stopPropagation();

    setEditorOpen(true);
    document.body.addEventListener('click', onClose);
  }

  let content: any;

  if (table) {
    if (editorOpen) {
      content = <TableTitleEditor tableId={table.tableId} onClose={onClose} />;
    } else {
      content = (
        <button
          type="button"
          onClick={onOpen}
          className="btn"
        >
          <h1 className="fs-5">{table.name}</h1>
        </button>
      );
    }
  } else {
    content = (
      <div className="text-center">
        -- // --
      </div>
    );
  }

  return (
    <div className="mx-3 my-3">
      {content}
    </div>
  );
}
