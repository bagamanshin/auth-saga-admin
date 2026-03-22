import { runSaga } from 'redux-saga';
import { request } from '../request';

const ENDPOINT = '/api/test';
const originalFetch = globalThis.fetch;

describe('request', () => {
  afterEach(() => {
    jest.restoreAllMocks();

    if (originalFetch) {
      Object.defineProperty(globalThis, 'fetch', {
        configurable: true,
        writable: true,
        value: originalFetch,
      });
      return;
    }

    Reflect.deleteProperty(globalThis, 'fetch');
  });

  it('passes AbortSignal to fetch and aborts it when the saga is cancelled', async () => {
    let resolveFetchStarted: (() => void) | undefined;
    const fetchStarted = new Promise<void>((resolve) => {
      resolveFetchStarted = resolve;
    });
    let receivedSignal: AbortSignal | undefined;

    const fetchMock = jest.fn(((_input, init) => {
      receivedSignal = init?.signal as AbortSignal | undefined;
      resolveFetchStarted?.();
      return new Promise<Response>(() => {});
    }) as typeof fetch);
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: fetchMock,
    });

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

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost/api/test',
      expect.objectContaining({
        method: 'GET',
        headers: {},
        body: null,
      }),
    );
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBe(receivedSignal);
    expect(receivedSignal?.aborted).toBe(true);
    expect(abortSpy).toHaveBeenCalledTimes(1);
  });
});
