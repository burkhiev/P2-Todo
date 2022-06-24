import React from 'react';

import BtnStyles from './BtnStyles';

interface ICreateBtnsProps {
  onAccept: () => void,
  onClose: () => void,
  acceptBtnText?: string
}

export default function CreateBtns(props: ICreateBtnsProps) {
  const { onAccept, onClose: onCloseAction, acceptBtnText } = props;

  function onAction(e: React.MouseEvent<any>) {
    e.stopPropagation();
    onAccept();
  }

  function onClose(e: React.MouseEvent<any>) {
    e.stopPropagation();
    onCloseAction();
  }

  return (
    <div className="d-flex">
      <button
        type="button"
        className={BtnStyles.accept}
        onClick={onAction}
      >
        {acceptBtnText ?? 'Добавить'}
      </button>
      <button
        type="button"
        className={BtnStyles.close}
        onClick={onClose}
      >
        <span className={BtnStyles.closeIcon} />
      </button>
    </div>
  );
}
