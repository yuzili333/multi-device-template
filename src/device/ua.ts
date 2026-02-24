export type DeviceType = 'mobile' | 'tablet' | 'desktop';

const IPAD_DESKTOP_UA = /Macintosh/i;
const IOS_TABLET_UA = /iPad/i;
const IOS_MOBILE_UA = /iPhone|iPod/i;

const ANDROID_UA = /Android/i;
const ANDROID_MOBILE_UA = /Android.*Mobile|Mobile Safari/i;
const ANDROID_TABLET_UA = /Android(?!.*Mobile)|Tablet|Nexus 7|Nexus 9|SM-T/i;

const HARMONY_UA = /HarmonyOS|OpenHarmony|HongMeng|HMOS/i;
const HUAWEI_BRAND_UA = /HUAWEI|HONOR/i;
const HARMONY_TABLET_HINT = /Tablet|Pad|MatePad|MediaPad|HUAWEI C5/i;
const HARMONY_MOBILE_HINT = /Phone|Mobile|HUAWEI P|HUAWEI Mate|HUAWEI nova|HONOR/i;

const GENERIC_TABLET_UA = /PlayBook|Kindle/i;
const GENERIC_MOBILE_UA = /BlackBerry|IEMobile|Opera Mini/i;

function isIPadDesktopUA(source: string): boolean {
  return (
    IPAD_DESKTOP_UA.test(source) &&
    typeof navigator !== 'undefined' &&
    navigator.maxTouchPoints > 1
  );
}

function detectAndroidLikeDevice(source: string): DeviceType | null {
  const isHarmony = HARMONY_UA.test(source);
  const isHuaweiFamily = HUAWEI_BRAND_UA.test(source) && (isHarmony || !ANDROID_UA.test(source));
  const isAndroid = ANDROID_UA.test(source);

  if (!isAndroid && !isHarmony && !isHuaweiFamily) {
    return null;
  }

  if (HARMONY_TABLET_HINT.test(source) || ANDROID_TABLET_UA.test(source)) {
    return 'tablet';
  }

  if (HARMONY_MOBILE_HINT.test(source) || ANDROID_MOBILE_UA.test(source)) {
    return 'mobile';
  }

  if (isAndroid || isHarmony || isHuaweiFamily) {
    return 'mobile';
  }

  return null;
}

export function detectDeviceType(ua?: string): DeviceType {
  const source = ua ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');

  if (!source) {
    return 'desktop';
  }

  if (isIPadDesktopUA(source) || IOS_TABLET_UA.test(source) || GENERIC_TABLET_UA.test(source)) {
    return 'tablet';
  }

  const androidLikeDevice = detectAndroidLikeDevice(source);
  if (androidLikeDevice) {
    return androidLikeDevice;
  }

  if (IOS_MOBILE_UA.test(source) || GENERIC_MOBILE_UA.test(source)) {
    return 'mobile';
  }

  return 'desktop';
}

export function getDeviceLabel(device: DeviceType): string {
  const map: Record<DeviceType, string> = {
    mobile: 'Mobile',
    tablet: 'Pad',
    desktop: 'PC'
  };

  return map[device];
}
