import type { DeviceType } from '@/device/ua';
import { resolveApiBase } from './endpoints';

export type ApiClientOptions = {
  deviceType: DeviceType;
  token?: string;
};

export function createApiClient(options: ApiClientOptions) {
  const baseURL = resolveApiBase(options.deviceType);

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set('x-device-type', options.deviceType);

    if (options.token) {
      headers.set('Authorization', `Bearer ${options.token}`);
    }

    const response = await fetch(`${baseURL}${path}`, {
      ...init,
      headers
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  return {
    baseURL,
    get<T>(path: string, init?: RequestInit) {
      return request<T>(path, {
        ...init,
        method: 'GET'
      });
    },
    post<T>(path: string, body?: unknown, init?: RequestInit) {
      const headers = new Headers(init?.headers);
      headers.set('Content-Type', 'application/json');

      return request<T>(path, {
        ...init,
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined
      });
    }
  };
}
