import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import store from '../../../store/store';

interface IAppProvidersProps {
  children: React.ReactNode
}

export default function AppProviders(props: IAppProvidersProps) {
  const { children } = props;

  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider>
    </Provider>
  );
}
