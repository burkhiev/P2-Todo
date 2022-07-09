import React, { useEffect, useState } from 'react';

import styles from './Main.css';

import Table from './table/Table';
import Sidebar from '../sidebar/Sidebar/Sidebar';
import { selectAllTables, useGetTables } from '../../store/api/apiSlice';
import { TodoTableId } from '../../models/ITodoTable';
import { useAppSelector } from '../../hooks/reduxHooks';
import { INVALID_TABLE_ID } from '../../service/Consts';

export default function Main() {
  const {
    isLoading,
    isSuccess,
    isFetching,
  } = useGetTables(undefined);

  const tables = useAppSelector(selectAllTables);
  const [tableId, setTableId] = useState<TodoTableId | undefined>(undefined);

  useEffect(() => {
    if (isSuccess) {
      const selectedExists = tables.some((table) => table.id === tableId);

      if (!selectedExists) {
        setTableId(tables.length > 0 ? tables[0].id : INVALID_TABLE_ID);
      }
    }
  }, [isSuccess, tables, tableId]);

  return (
    <main className={`d-flex ${styles.main}`}>
      <div className={`col-5 col-lg-4 col-xl-3 ${styles.main_sidebar_sticky}`}>
        <Sidebar
          tableId={tableId}
          selectTable={setTableId}
        />
      </div>
      <div className="col-5 col-lg-4 col-xl-3" />
      <div className={`col ${styles.main_table_container}`}>
        <Table tableId={tableId} isLoading={isLoading || isFetching} />
      </div>
    </main>
  );
}
