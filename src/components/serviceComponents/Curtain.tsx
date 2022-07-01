import React from 'react';

import { useAppSelector } from '../../hooks/reduxHooks';
import { selectCurtainState } from '../../store/style/curtainSlice';

import styles from './Curtain.css';

/**
 * Компонент покрывает веб страницу затемненным фоном
 */
export default function Curtain() {
  const curtainEnable = useAppSelector(selectCurtainState);

  return (
    <div className={curtainEnable ? styles.curtain : ''} />
  );
}
