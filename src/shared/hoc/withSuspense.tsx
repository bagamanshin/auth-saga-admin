import { Spin } from 'antd';
import React, { Suspense } from 'react';

export const withSuspense = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => (
    <Suspense fallback={<Spin />}>
      <Component {...props} />
    </Suspense>
  );
