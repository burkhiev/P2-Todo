import React from 'react';

import { useAppSelector } from '../../hooks/reduxHooks';
import { selectCurtainState } from '../../store/style/curtainSlice';

import './curtain.css';

export default function Curtain() {
  const curtainEnable = useAppSelector(selectCurtainState);

  return (
    <div className={curtainEnable ? 'curtain' : ''} />
  );
}
