import { Spin } from 'antd';
import React, { Suspense, type ReactPropTypes } from 'react';

export const withSuspense = (Component: React.FC<Record<string, unknown>>) => (props: ReactPropTypes) => (
  <Suspense fallback={<Spin />}>
    <Component {...props} />
  </Suspense>
);
