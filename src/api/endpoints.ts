import type { DeviceType } from '@/device/ua';

const endpointByDevice: Record<DeviceType, string> = {
  desktop: '/api/pc',
  tablet: '/api/pad',
  mobile: '/api/mobile'
};

export function resolveApiBase(deviceType: DeviceType): string {
  const fallback = endpointByDevice.desktop;
  const base = endpointByDevice[deviceType] ?? fallback;

  if (import.meta.env.PROD) {
    return base;
  }

  const mockOrigin = import.meta.env.PUBLIC_API_ORIGIN as string | undefined;
  if (mockOrigin) {
    return `${mockOrigin}${base}`;
  }

  return base;
}
