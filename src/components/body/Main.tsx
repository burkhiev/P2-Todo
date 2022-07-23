import React, { useState } from 'react';

import styles from './Main.css';
import tableStyles from './table/Table.css';

import Table from './table/Table';
import Sidebar from '../sidebar/Sidebar/Sidebar';
import { selectAllTables, useGetTables } from '../../store/api/tableSlice';
import { useAppSelector } from '../../hooks/reduxHooks';
import { INVALID_TABLE_ID } from '../../service/Consts';
import TablePlaceholder from './table/TablePlaceholder/TablePlaceholder';

export default function Main() {
  const tables = useAppSelector(selectAllTables)
    .sort((a, b) => a.name.localeCompare(b.name));

  const {
    isLoading,
    isSuccess,
    isFetching,
  } = useGetTables(undefined);

  const [tableId, setTableId] = useState(INVALID_TABLE_ID);

  if (
    isSuccess
    && !isLoading
    && !isFetching
    && tableId === INVALID_TABLE_ID
    && tables.length
  ) {
    setTableId(tables[0].id);
  }

  let tableComponent: JSX.Element | undefined;
  if (tableId === INVALID_TABLE_ID || !tables.some((t) => t.id === tableId)) {
    tableComponent = (
      <div className={`border bg-white ${tableStyles.table}`}>
        <TablePlaceholder isLoading={isLoading} />
      </div>
    );
  } else {
    tableComponent = <Table tableId={tableId} />;
  }

  return (
    <main className={`d-flex ${styles.main}`}>
      <div className={`col-5 col-lg-4 col-xl-3 ${styles.main_sidebar_sticky}`}>
        <Sidebar tableId={tableId} selectTable={setTableId} />
      </div>
      <div className="col-5 col-lg-4 col-xl-3" />
      <div className={`col ${styles.main_table_container}`}>
        {tableComponent}
      </div>
    </main>
  );
}
