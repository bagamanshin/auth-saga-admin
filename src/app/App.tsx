import { Switch, Route } from 'react-router-dom';
import { LoginPage } from '@pages/login';
import { PostsPage } from '@pages/posts';
import { PrivateRoute } from './providers/PrivateRoute';
import './styles/index.css';
import './App.css';

export const App = () => {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <PrivateRoute path="/" component={PostsPage} />
    </Switch>
  );
};
