import React, { useState } from 'react';

import styles from './Main.css';

import Table from './table/Table';
import Sidebar from '../sidebar/Sidebar/Sidebar';
import { selectAllTables, useGetTables } from '../../store/api/tableSlice';
import { useAppSelector } from '../../hooks/reduxHooks';
import { INVALID_TABLE_ID } from '../../service/Consts';
import TablePlaceholder from './table/TablePlaceholder/TablePlaceholder';
import { selectCurrentImageStyle } from '../../store/style/styleSlice';

export default function Main() {
  const {
    isLoading,
    isSuccess,
    isFetching,
  } = useGetTables(undefined);

  const curImageStyle = useAppSelector(selectCurrentImageStyle);
  const tables = useAppSelector(selectAllTables)
    .sort((a, b) => a.name.localeCompare(b.name));

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

  let table: JSX.Element | undefined;
  if (tableId === INVALID_TABLE_ID || !tables.some((t) => t.id === tableId)) {
    table = <TablePlaceholder isLoading={isLoading} />;
  } else {
    table = <Table tableId={tableId} />;
  }

  return (
    <main className={`
      ${styles.main}
      ${curImageStyle === 0
      ? styles.main_bg_image0
      : styles.main_bg_image1}
    `}
    >
      <Sidebar tableId={tableId} selectTable={setTableId} />
      {table}
    </main>
  );
}
