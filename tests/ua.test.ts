import { afterEach, describe, expect, it } from 'vitest';
import { detectDeviceType, getDeviceLabel } from '@/device/ua';

function mockNavigator(maxTouchPoints: number) {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      userAgent: '',
      maxTouchPoints
    }
  });
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'navigator');
});

describe('detectDeviceType', () => {
  it('should detect Android mobile', () => {
    const ua =
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Mobile Safari/537.36';

    expect(detectDeviceType(ua)).toBe('mobile');
  });

  it('should detect Android tablet', () => {
    const ua =
      'Mozilla/5.0 (Linux; Android 13; SM-T970) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36';

    expect(detectDeviceType(ua)).toBe('tablet');
  });

  it('should detect HarmonyOS mobile', () => {
    const ua =
      'Mozilla/5.0 (Linux; HarmonyOS 4.0; HUAWEI P60 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36';

    expect(detectDeviceType(ua)).toBe('mobile');
  });

  it('should detect HarmonyOS tablet', () => {
    const ua =
      'Mozilla/5.0 (Linux; HarmonyOS 4.0; HUAWEI MatePad Pro) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Safari/537.36';

    expect(detectDeviceType(ua)).toBe('tablet');
  });

  it('should detect iPadOS desktop UA by touch points', () => {
    mockNavigator(5);
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';

    expect(detectDeviceType(ua)).toBe('tablet');
  });

  it('should return desktop for regular desktop UA', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

    expect(detectDeviceType(ua)).toBe('desktop');
  });
});

describe('getDeviceLabel', () => {
  it('should map device label correctly', () => {
    expect(getDeviceLabel('mobile')).toBe('Mobile');
    expect(getDeviceLabel('tablet')).toBe('Pad');
    expect(getDeviceLabel('desktop')).toBe('PC');
  });
});
