import React from 'react';

import BtnStyles from './BtnStyles';

interface IOpenCreateFormBtnProps {
  text: string
  onOpen: (() => void) | ((e: React.MouseEvent<any>) => void)
}

export default function OpenCreateFormBtn(props: IOpenCreateFormBtnProps) {
  const { text, onOpen } = props;

  return (
    <button
      type="button"
      className={BtnStyles.openCreateForm}
      onClick={onOpen}
    >
      <span className={BtnStyles.openCreateFormIcon} />
      {text}
    </button>
  );
}
