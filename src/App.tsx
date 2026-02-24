import { useMemo, useState } from 'react';
import { createApiClient } from '@/api/client';
import DevicePanel from '@/components/DevicePanel';
import { DeviceProvider } from '@/device/device-context';
import { useDevice } from '@/device/use-device';

function Dashboard() {
  const { deviceType, userAgent, isMobile, isTablet, isDesktop } = useDevice();
  const [result, setResult] = useState<string>('');

  const api = useMemo(() => createApiClient({ deviceType }), [deviceType]);
  const isPCAdaptive = isDesktop;

  const containerClass = isPCAdaptive
    ? 'mx-auto w-[min(96vw,1680px)] px-[clamp(20px,2vw,40px)] py-[clamp(24px,3vh,40px)]'
    : 'mx-auto w-[94vw] tablet:w-[92vw] px-[4vw] py-[5vh] tablet:px-[5vw] tablet:py-[4.5vh]';
  const contentGridClass = isPCAdaptive
    ? 'grid gap-[clamp(16px,1.4vw,28px)] [grid-template-columns:minmax(0,1.65fr)_minmax(320px,0.95fr)]'
    : 'grid gap-[2.8vh] tablet:gap-[2.4vh]';
  const cardPaddingClass = isPCAdaptive
    ? 'p-[clamp(18px,1.4vw,28px)]'
    : 'p-[4vw] tablet:p-[3.2vw]';
  const panelPreClass = isPCAdaptive
    ? 'mt-[clamp(10px,1.6vh,18px)] max-h-[34vh] overflow-auto rounded-[clamp(10px,0.8vw,14px)] bg-slate-900 p-[clamp(10px,0.9vw,14px)] text-[clamp(11px,0.75vw,13px)] text-slate-100'
    : 'mt-[2vh] max-h-[28vh] overflow-auto rounded-[2.2vw] bg-slate-900 p-[2.8vw] tablet:rounded-[1.4vw] tablet:p-[2vw] text-[3vw] tablet:text-[1.7vw] text-slate-100';

  async function testRequest() {
    try {
      const payload = await api.get<{ env: string; region?: string }>('/env');
      setResult(JSON.stringify(payload, null, 2));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setResult(`请求失败: ${message}`);
    }
  }

  return (
    <main className="page-shell">
      <div className={containerClass}>
        <header className={`mb-[2.8vh] card-base ${cardPaddingClass}`}>
          <h1 className="mb-[1.4vh] text-[7vw] tablet:text-[4vw] desktop:text-[clamp(30px,2.3vw,46px)] font-bold tracking-tight text-slate-900">
            Rsbuild 多端自适应模板
          </h1>
          <p className="text-[3.6vw] tablet:text-[2.1vw] desktop:text-[clamp(14px,1vw,17px)] text-slate-600">
            PC 端采用自适应布局策略，Mobile / Pad 端采用响应式布局策略，支持基于 UA 的设备识别与 API 环境路由。
          </p>

          <div className="mt-[2vh] flex flex-wrap gap-[1.4vw] tablet:gap-[0.9vw] text-[3vw] tablet:text-[1.7vw] desktop:text-[clamp(11px,0.75vw,13px)] text-slate-700">
            <span
              className={`rounded-[999px] px-[2.2vw] py-[0.9vh] tablet:px-[1.3vw] tablet:py-[0.7vh] ${isMobile ? 'bg-brand-100' : 'bg-slate-100'}`}
            >
              Mobile
            </span>
            <span
              className={`rounded-[999px] px-[2.2vw] py-[0.9vh] tablet:px-[1.3vw] tablet:py-[0.7vh] ${isTablet ? 'bg-brand-100' : 'bg-slate-100'}`}
            >
              Pad
            </span>
            <span
              className={`rounded-[999px] px-[2.2vw] py-[0.9vh] tablet:px-[1.3vw] tablet:py-[0.7vh] ${isDesktop ? 'bg-brand-100' : 'bg-slate-100'}`}
            >
              PC
            </span>
          </div>
        </header>

        <div className={contentGridClass}>
          <DevicePanel deviceType={deviceType} baseURL={api.baseURL} />

          <aside className={`card-base ${cardPaddingClass}`}>
            <h2 className="section-title mb-[1.4vh]">API 环境测试</h2>
            <button
              type="button"
              onClick={testRequest}
              className="rounded-[2vw] tablet:rounded-[1.2vw] desktop:rounded-[clamp(10px,0.7vw,14px)] bg-brand-500 px-[3.6vw] py-[1.4vh] tablet:px-[2.2vw] tablet:py-[1vh] desktop:px-[clamp(14px,1vw,20px)] desktop:py-[clamp(8px,0.7vh,12px)] text-[3.2vw] tablet:text-[1.8vw] desktop:text-[clamp(13px,0.85vw,15px)] font-medium text-white transition hover:bg-brand-700"
            >
              请求 /env
            </button>
            <pre className={panelPreClass}>
              {result || '点击按钮测试当前设备对应的 API 环境'}
            </pre>
            <p className="mt-[2vh] text-[2.9vw] tablet:text-[1.6vw] desktop:text-[clamp(11px,0.72vw,13px)] text-slate-500 break-all">
              UA: {userAgent}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <DeviceProvider>
      <Dashboard />
    </DeviceProvider>
  );
}
