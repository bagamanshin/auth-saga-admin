import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './app/styles/index.css';
import App from './app/index';
import { store } from '@app/store';
import { retrieveTokens as retrieveTokensFromCookies } from '@features/auth/model/slice';

store.dispatch(retrieveTokensFromCookies());

Promise.resolve().then(() => {
  ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
});
