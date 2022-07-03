import React from 'react';

import styles from './TablePlaceholder.css';

export default function TablePlaceholder() {
  return (
    <div className={`${styles.table_placeholder_container}`}>
      <div>
        <div className="d-flex">
          <span className={`bi bi-crop m-auto ${styles.table_placeholder_icon}`} />
        </div>
        <div className="d-flex mt-5">
          <span className="display-6">здесь пусто</span>
        </div>
      </div>
    </div>
  );
}
