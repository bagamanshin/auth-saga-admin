
// Mock fetch
if (!globalThis.fetch) {
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: jest.fn(),
  });
}
