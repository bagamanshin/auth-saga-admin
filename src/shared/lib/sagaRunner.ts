import type { AnyAction } from 'redux';
import { runSaga } from 'redux-saga';

type SagaWorker<Args extends unknown[], Result> = (...args: Args) => Generator<unknown, Result, unknown>;

type SagaRunnerEnvironment = {
  dispatch: (action: AnyAction) => unknown;
  getState: () => unknown;
};

let sagaRunnerEnvironment: SagaRunnerEnvironment | null = null;

export const configureSagaRunner = (environment: SagaRunnerEnvironment) => {
  sagaRunnerEnvironment = environment;
};

export const runSagaWorker = async <Args extends unknown[], Result>(
  worker: SagaWorker<Args, Result>,
  ...args: Args
): Promise<Result> => {
  if (!sagaRunnerEnvironment) {
    throw new Error('Saga runner is not configured');
  }

  const task = runSaga(
    {
      dispatch: sagaRunnerEnvironment.dispatch,
      getState: sagaRunnerEnvironment.getState,
    },
    worker,
    ...args
  );

  return task.toPromise();
};
