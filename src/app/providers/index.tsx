import { type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { AuthProvider } from 'react-auth-kit';
import { ConfigProvider } from 'antd';
import { store, history } from '../store';

// const authStore = createStore({
//   authName: '_auth',
//   authType: 'cookie',
//   cookieDomain: window.location.hostname,
//   cookieSecure: window.location.protocol === 'https:',
// });

// Example theme override
ConfigProvider.config({
    theme: {
      primaryColor: '#1DA57A',
    },
});

export const withProviders = (component: () => ReactNode) => () => (
    <AuthProvider
      authType={'cookie'}
      authName={'_auth'}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === 'https:'}
    >
      <Provider store={store}>
        <ConnectedRouter history={history}>
            <ConfigProvider>
                {component()}
            </ConfigProvider>
        </ConnectedRouter>
      </Provider>
    </AuthProvider>
);
