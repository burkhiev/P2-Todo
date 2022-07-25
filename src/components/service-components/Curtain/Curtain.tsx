import React from 'react';

import styles from './Curtain.css';

import { useAppSelector } from '../../../hooks/reduxHooks';
import { selectCurtainState } from '../../../store/style/styleSlice';

export const Curtain_TestId = 'Curtain';

/**
 * Компонент покрывает веб страницу затемненным фоном
 */
export default function Curtain() {
  const curtainEnable = useAppSelector(selectCurtainState);

  return (
    <div
      className={curtainEnable ? styles.curtain : ''}
      data-testid={Curtain_TestId}
    />
  );
}
