import React, { PropsWithChildren } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import setupStore, { AppStore } from '../../../store/store';

interface IAppProvidersProps {
  store?: AppStore
}

export default function AppProviders(props: PropsWithChildren<IAppProvidersProps>) {
  const { children, store } = props;

  return (
    <Provider store={store ?? setupStore()}>
      {/* <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider> */}
      {children}
    </Provider>
  );
}
