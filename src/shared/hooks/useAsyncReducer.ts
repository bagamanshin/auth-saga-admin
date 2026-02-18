import { useEffect, useState } from 'react';
import { type Reducer } from 'redux';
import { type Saga } from 'redux-saga';
import { store } from '@app/store';

interface AsyncModuleConfig {
  key: string;
  moduleLoader: () => Promise<{ [key: string]: unknown }>;
  reducerKey: string;
  sagaKey: string;
}

export const useAsyncReducer = (config: AsyncModuleConfig) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAndInject = async () => {
      try {
        const mod = await config.moduleLoader();
        
        if (mounted) {
          const reducer = mod[config.reducerKey] as Reducer;
          const saga = mod[config.sagaKey] as Saga;

          if (reducer) {
            store.injectReducer(config.key, reducer);
          }

          if (saga) {
            store.injectSaga(config.key, saga);
          }

          setLoaded(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load module'));
        }
      }
    };

    loadAndInject();

    return () => {
      mounted = false;
    };
  }, [config]);

  return { loaded, error };
};
