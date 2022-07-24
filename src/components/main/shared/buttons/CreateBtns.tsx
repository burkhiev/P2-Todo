import React from 'react';

import BtnStyles from './BootstrapBtnStyles';

interface ICreateBtnsProps {
  acceptBtnText?: string,
  isLoading: boolean,
  onAccept: () => void,
  onClose: () => void,
  actionBtnTestId: string,
  closeBtnTestId: string
}

export default function CreateBtns(props: ICreateBtnsProps) {
  const {
    isLoading,
    onAccept,
    onClose: onCloseAction,
    acceptBtnText,
    actionBtnTestId,
    closeBtnTestId,
  } = props;

  function onAction(e: React.MouseEvent<any>) {
    e.stopPropagation();
    onAccept();
  }

  function onClose(e: React.MouseEvent<any>) {
    e.stopPropagation();
    onCloseAction();
  }

  const btnText = (isLoading ? '' : acceptBtnText ?? 'Добавить');
  const placeholderCss = (isLoading ? 'placeholder' : '');
  const visible = (isLoading ? 'd-none' : '');

  return (
    <div className="d-flex">
      <button
        type="button"
        className={`${BtnStyles.accept} ${placeholderCss}`}
        onClick={onAction}
        data-testid={actionBtnTestId}
      >
        {btnText}
      </button>
      <button
        type="button"
        className={`${BtnStyles.close} ${visible}`}
        onClick={onClose}
        data-testid={closeBtnTestId}
      >
        <span className={BtnStyles.closeIcon} />
      </button>
    </div>
  );
}
