import { Result, Button } from 'antd';

export type NotFoundPageProps = {
  onGoHome: () => void;
};

export const NotFoundPage = ({ onGoHome }: NotFoundPageProps) => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={onGoHome}>
          Back Home
        </Button>
      }
    />
  );
};
