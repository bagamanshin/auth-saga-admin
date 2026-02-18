import React from 'react';
import { Spin } from 'antd';
import { useAsyncReducer } from '@shared/hooks/useAsyncReducer';

interface AsyncModuleProviderProps {
  moduleKey: string;
  moduleLoader: () => Promise<{ [key: string]: unknown }>;
  reducerKey: string;
  sagaKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AsyncModuleProvider: React.FC<AsyncModuleProviderProps> = ({
  moduleKey,
  moduleLoader,
  reducerKey,
  sagaKey,
  children,
  fallback = <Spin />,
}) => {
  const { loaded, error } = useAsyncReducer({
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
