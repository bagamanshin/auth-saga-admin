import { useEffect, useState } from 'react';
import { type Reducer } from 'redux';
import { type Saga } from 'redux-saga';
import { store } from '@app/store';

interface LazyReduxModuleConfig {
  key: string;
  moduleLoader: () => Promise<{ [key: string]: unknown }>;
  reducerKey: string;
  sagaKey: string;
}

export const useLazyReducer = ({
  key, moduleLoader, reducerKey, sagaKey
}: LazyReduxModuleConfig) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAndInject = async () => {
      try {
        const mod = await moduleLoader();
        
        if (mounted) {
          const reducer = mod[reducerKey] as Reducer;
          const saga = mod[sagaKey] as Saga;

          if (reducer) {
            store.injectReducer(key, reducer);
          }

          if (saga) {
            store.injectSaga(key, saga);
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
  }, [key, moduleLoader, reducerKey, sagaKey]);

  return { loaded, error };
};
