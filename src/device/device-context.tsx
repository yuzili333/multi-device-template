import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { detectDeviceType, type DeviceType } from './ua';

type DeviceContextValue = {
  deviceType: DeviceType;
  userAgent: string;
};

const DeviceContext = createContext<DeviceContextValue | null>(null);

function resolveUserAgent(): string {
  return typeof navigator === 'undefined' ? '' : navigator.userAgent;
}

export function DeviceProvider({ children }: { children: ReactNode }) {
  const userAgent = resolveUserAgent();

  const value = useMemo<DeviceContextValue>(() => {
    const url = typeof window === 'undefined' ? null : new URL(window.location.href);
    const forceDevice = url?.searchParams.get('device');

    if (forceDevice === 'mobile' || forceDevice === 'tablet' || forceDevice === 'desktop') {
      return {
        deviceType: forceDevice,
        userAgent
      };
    }

    return {
      deviceType: detectDeviceType(userAgent),
      userAgent
    };
  }, [userAgent]);

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

export function useDeviceContext() {
  const ctx = useContext(DeviceContext);
  if (!ctx) {
    throw new Error('useDeviceContext must be used in DeviceProvider');
  }
  return ctx;
}
