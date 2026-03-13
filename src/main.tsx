import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './app/styles/index.css';
import App from './app/index';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
