import { getDeviceLabel, type DeviceType } from '@/device/ua';

type DevicePanelProps = {
  deviceType: DeviceType;
  baseURL: string;
};

export default function DevicePanel({ deviceType, baseURL }: DevicePanelProps) {
  const isDesktop = deviceType === 'desktop';
  const sectionPaddingClass = isDesktop ? 'p-[clamp(18px,1.4vw,28px)]' : 'p-[4vw] tablet:p-[3.2vw]';
  const blockGapClass = isDesktop ? 'mb-[clamp(10px,1.2vh,20px)]' : 'mb-[2vh]';
  const gridGapClass = isDesktop ? 'gap-[clamp(10px,0.9vw,14px)]' : 'gap-[1.8vh] tablet:gap-[1.5vh]';
  const itemPaddingClass = isDesktop
    ? 'p-[clamp(10px,0.9vw,14px)]'
    : 'p-[2.8vw] tablet:p-[2vw]';

  const config = {
    mobile: {
      title: 'Mobile 布局',
      desc: '响应式策略：默认单列，优先保证触控区域与首屏信息密度。',
      boxClass: 'grid-cols-1'
    },
    tablet: {
      title: 'Pad 布局',
      desc: '响应式策略：窄屏单列、标准平板双列，兼顾横竖屏。',
      boxClass: 'grid-cols-1 tablet:grid-cols-2'
    },
    desktop: {
      title: 'PC 布局',
      desc: '自适应策略：根据可用宽度自动调整列数与模块密度。',
      boxClass: 'grid-cols-[repeat(auto-fit,minmax(180px,1fr))]'
    }
  }[deviceType];

  return (
    <section className={`card-base ${sectionPaddingClass}`}>
      <div
        className={`${blockGapClass} flex flex-wrap items-center justify-between gap-[1.2vw] tablet:gap-[0.8vw] desktop:gap-[clamp(8px,0.6vw,12px)]`}
      >
        <h2 className="section-title">{config.title}</h2>
        <span className="rounded-[999px] bg-brand-50 px-[2.6vw] py-[0.9vh] tablet:px-[1.5vw] tablet:py-[0.7vh] desktop:px-[clamp(10px,0.8vw,14px)] desktop:py-[clamp(5px,0.45vh,8px)] text-[3.2vw] tablet:text-[1.8vw] desktop:text-[clamp(13px,0.85vw,15px)] text-brand-700">
          当前设备: {getDeviceLabel(deviceType)}
        </span>
      </div>

      <p className={`${blockGapClass} text-[3.5vw] tablet:text-[2vw] desktop:text-[clamp(14px,0.95vw,16px)] text-slate-600`}>
        {config.desc}
      </p>
      <p
        className={`${isDesktop ? 'mb-[clamp(14px,1.8vh,26px)]' : 'mb-[2.6vh]'} text-[3.3vw] tablet:text-[1.9vw] desktop:text-[clamp(13px,0.9vw,15px)] text-slate-500`}
      >
        API 基地址: {baseURL}
      </p>

      <div className={`grid ${gridGapClass} ${config.boxClass}`}>
        <div
          className={`rounded-[2.2vw] tablet:rounded-[1.3vw] desktop:rounded-[clamp(10px,0.75vw,14px)] bg-slate-100 text-[3.3vw] tablet:text-[1.9vw] desktop:text-[clamp(13px,0.9vw,15px)] text-slate-700 ${itemPaddingClass}`}
        >
          内容模块 A
        </div>
        <div
          className={`rounded-[2.2vw] tablet:rounded-[1.3vw] desktop:rounded-[clamp(10px,0.75vw,14px)] bg-slate-100 text-[3.3vw] tablet:text-[1.9vw] desktop:text-[clamp(13px,0.9vw,15px)] text-slate-700 ${itemPaddingClass}`}
        >
          内容模块 B
        </div>
        <div
          className={`rounded-[2.2vw] tablet:rounded-[1.3vw] desktop:rounded-[clamp(10px,0.75vw,14px)] bg-slate-100 text-[3.3vw] tablet:text-[1.9vw] desktop:text-[clamp(13px,0.9vw,15px)] text-slate-700 ${itemPaddingClass}`}
        >
          内容模块 C
        </div>
      </div>
    </section>
  );
}
