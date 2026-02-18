import { type ReactNode } from 'react';
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

export const withProviders = (component: () => ReactNode) => () => (
      <Provider store={store}>
        <ConnectedRouter history={history}>
            <ConfigProvider>
              <ErrorBoundary>
                {component()}
              </ErrorBoundary>
            </ConfigProvider>
        </ConnectedRouter>
      </Provider>
);
