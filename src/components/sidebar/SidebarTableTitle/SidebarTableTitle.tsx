import React, { useState } from 'react';

import styles from './SidebarTableTitle.css';

import { useAppSelector } from '../../../hooks/reduxHooks';
import { TodoTableId } from '../../../models/ITodoTable';
import { selectTableById } from '../../../store/api/tableSlice';
import SidebarEditTableTitleForm from './SidebarEditTableTitleForm';

export const SidebarTableTitle_TestId = 'SidebarTableTitle';
export const SidebarTableTitle_Name_TestId = 'SidebarTableTitle_Name';
export const SidebarTableTitle_OpenEditorBtn_TestId = 'SidebarTableTitle_OpenEditor';

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

    if (table) {
      setEditorOpen(true);
      document.body.addEventListener('click', onClose);
    }
  }

  let content: any;
  let disableEditor = false;
  let onOpenAction = onOpen;

  if (!table) {
    disableEditor = true;
    onOpenAction = () => { };
  }

  if (table && editorOpen) {
    content = <SidebarEditTableTitleForm tableId={table.id} onClose={onClose} />;
  } else {
    content = (
      <button
        type="button"
        onClick={onOpenAction}
        className="d-flex w-100 btn"
        disabled={disableEditor}
        data-testid={SidebarTableTitle_OpenEditorBtn_TestId}
      >
        <div className="w-100">
          <h2
            className="fs-5 text-truncate"
            data-testid={SidebarTableTitle_Name_TestId}
          >
            {table?.name}
          </h2>
        </div>
        <div className="ms-2">
          <span className="bi bi-pen text-muted fs-6" />
        </div>
      </button>
    );
  }

  return (
    <div
      className="d-flex align-items-center m-3"
      data-testid={SidebarTableTitle_TestId}
    >
      <span className="bi bi-table me-2" />
      <div className={styles.sidebar_table_name_container}>
        {content}
      </div>
    </div>
  );
}
