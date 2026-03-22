import type { ComponentType } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ConfigProvider } from 'antd';
import { store, history } from '../store';
import { ErrorBoundary } from './ErrorBoundary';

// Example theme override
ConfigProvider.config({
    theme: {
      primaryColor: '#1DA57A',
    },
});

export const withProviders = (Component: ComponentType) => () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ConfigProvider>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </ConfigProvider>
    </ConnectedRouter>
  </Provider>
);
