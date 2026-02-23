// apiProxy.ts
import { apiService } from './apiService';
import { api } from './api';
import { getApiMode } from './apiToggle';

// Proxy object that delegates to real or mock API based on toggle
export const apiProxy = new Proxy({}, {
  get(_target, prop) {
    const mode = getApiMode();
    const source = mode === 'mock' ? api : apiService;
    const value = source[prop as keyof typeof source];
    if (typeof value === 'function') {
      return value.bind(source);
    }
    return value;
  }
}) as typeof apiService & typeof api;