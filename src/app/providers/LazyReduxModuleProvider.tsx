import React from 'react';
import { Spin } from 'antd';
import { useLazyReducer } from './useLazyReducer';

interface LazyReduxModuleProviderProps {
  moduleKey: string;
  moduleLoader: () => Promise<{ [key: string]: unknown }>;
  reducerKey: string;
  sagaKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyReduxModuleProvider: React.FC<LazyReduxModuleProviderProps> = ({
  moduleKey,
  moduleLoader,
  reducerKey,
  sagaKey,
  children,
  fallback = <Spin />,
}) => {
  const { loaded, error } = useLazyReducer({
    key: moduleKey,
    moduleLoader,
    reducerKey,
    sagaKey,
  });

  if (error) {
    throw error;
  }

  if (!loaded) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
