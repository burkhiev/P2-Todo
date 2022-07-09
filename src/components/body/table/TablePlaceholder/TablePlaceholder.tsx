import React from 'react';

import styles from './TablePlaceholder.css';

export const testId_TablePlaceholder = 'TablePlaceholder';
export const testId_TablePlaceholder_Spinner = 'TablePlaceholder_Spinner';

interface ITablePlaceholderProps {
  isLoading: boolean
}

export default function TablePlaceholder(props: ITablePlaceholderProps) {
  const { isLoading } = props;

  let content = (
    <>
      <span className={`bi bi-crop ${styles.table_placeholder_icon}`} />
      <span className="display-6">Тут пусто</span>
    </>
  );

  if (isLoading) {
    content = (
      <div
        className={styles.table_placeholder_icon}
        data-testid={testId_TablePlaceholder_Spinner}
      >
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.table_placeholder_container}`}
      data-testid={testId_TablePlaceholder}
    >
      <div className={`${styles.table_placeholder}`}>
        {content}
      </div>
    </div>
  );
}
