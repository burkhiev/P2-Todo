/* eslint-disable no-console */
import React, { PropsWithChildren } from 'react';

export default class ErrorBoundary
  extends React.Component<PropsWithChildren, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(
      'Something went wrong',
      errorInfo.componentStack,
    );
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    return (
      <div>{hasError ? 'Что-то пошло не так...' : children}</div>
    );
  }
}
