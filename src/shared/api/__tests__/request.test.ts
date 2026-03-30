import { runSaga } from 'redux-saga';
import { request } from '../request';

const ENDPOINT = '/api/test';

describe('request', () => {
  it('passes AbortSignal to fetch and aborts it when the saga is cancelled', async () => {
    let receivedSignal: AbortSignal | undefined;
    const { promise: fetchStarted, resolve: resolveFetchStarted } = Promise.withResolvers<void>();

    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(((_input, init) => {
      receivedSignal = init?.signal as AbortSignal | undefined;
      resolveFetchStarted();
      return new Promise<Response>(() => {});
    }) as typeof fetch);

    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

    const task = runSaga(
      {
        dispatch: () => undefined,
        getState: () => undefined,
      },
      request<undefined, { id: number }>,
      ENDPOINT,
    );

    await fetchStarted;

    task.cancel();
    await task.toPromise();

    expect(fetchSpy).toHaveBeenCalledWith(
      `http://localhost${ENDPOINT}`,
      expect.objectContaining({
        method: 'GET',
        headers: {},
        body: null,
      }),
    );
    expect(fetchSpy.mock.calls[0]?.[1]?.signal).toBe(receivedSignal);
    expect(receivedSignal?.aborted).toBe(true);
    expect(abortSpy).toHaveBeenCalledTimes(1);
  });
});
