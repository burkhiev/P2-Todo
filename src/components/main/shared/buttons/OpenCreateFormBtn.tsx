import React from 'react';

import BtnStyles from './BootstrapBtnStyles';

interface IOpenCreateFormBtnProps {
  text: string
  onOpen: (() => void) | ((e: React.MouseEvent<any>) => void),
  testId: string,
  openFormBtnStyle?: string
}

export default function OpenCreateFormBtn(props: IOpenCreateFormBtnProps) {
  const {
    text, onOpen, testId, openFormBtnStyle = 'btn-outline-secondary',
  } = props;

  return (
    <button
      type="button"
      className={`${BtnStyles.openCreateForm} ${openFormBtnStyle}`}
      onClick={onOpen}
      data-testid={testId}
    >
      <span className={BtnStyles.openCreateFormIcon} />
      {text}
    </button>
  );
}
