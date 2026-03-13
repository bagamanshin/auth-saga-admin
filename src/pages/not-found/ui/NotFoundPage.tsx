import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { PATHS } from '@shared/config/routes';

export const NotFoundPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to={PATHS.home}>
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};
