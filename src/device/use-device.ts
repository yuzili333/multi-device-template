import { useDeviceContext } from './device-context';

export function useDevice() {
  const { deviceType, userAgent } = useDeviceContext();

  return {
    deviceType,
    userAgent,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop'
  };
}
