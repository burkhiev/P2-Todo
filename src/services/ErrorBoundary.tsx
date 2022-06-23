import React from 'react';

export default class ErrorBoundary
  extends React.Component<any, { hasError: boolean }>
{
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(
      'Something went wrong',
      errorInfo.componentStack
    );
  }

  render() {
    let content = this.props.children;

    if (this.state.hasError) {
        content = 'Что-то пошло не так...'
    }

    return (
      <div>{content}</div>
    )
  }
}
