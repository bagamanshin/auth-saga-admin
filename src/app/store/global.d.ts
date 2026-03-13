import type { RootState as AppRootState } from './index';

declare global {
  type RootState = AppRootState;
}

export {};
