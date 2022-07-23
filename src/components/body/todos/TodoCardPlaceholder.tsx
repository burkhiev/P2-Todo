import React from 'react';

export default function TodoCardPlaceholder() {
  return (
    <div className="v-stack mb-1">
      <div className="d-flex rounded border-bottom">
        <button
          type="button"
          className="d-block flex-grow-1 p-4 btn rounded bg-secondary opacity-50 text-start"
        >
          <span className="visually-hidden">placeholder</span>
        </button>
      </div>
    </div>
  );
}
