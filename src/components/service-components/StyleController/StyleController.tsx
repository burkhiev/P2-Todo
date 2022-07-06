import React from 'react';

import Curtain from '../Curtain/Curtain';

interface IStyleControllerProps {
  children: React.ReactNode
}

export default function StyleController(props: IStyleControllerProps) {
  const { children } = props;

  return (
    <>
      <Curtain />
      {children}
    </>
  );
}
