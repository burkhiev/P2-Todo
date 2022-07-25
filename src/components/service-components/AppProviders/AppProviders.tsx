import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import setupStore, { AppStore } from '../../../store/store';

interface IAppProvidersProps {
  store?: AppStore
}

export default function AppProviders(props: PropsWithChildren<IAppProvidersProps>) {
  const { children, store } = props;

  return (
    <Provider store={store ?? setupStore()}>
      {children}
    </Provider>
  );
}
