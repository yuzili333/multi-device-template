import { defineConfig, presetIcons, presetUno } from 'unocss';

const MOBILE_DESIGN_WIDTH = 375;
const MOBILE_DESIGN_HEIGHT = 812;

const WIDTH_BASED_PROPS = new Set([
  'width',
  'min-width',
  'max-width',
  'left',
  'right',
  'margin-left',
  'margin-right',
  'padding-left',
  'padding-right',
  'column-gap',
  'font-size',
  'letter-spacing',
  'text-indent',
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius'
]);

const HEIGHT_BASED_PROPS = new Set([
  'height',
  'min-height',
  'max-height',
  'top',
  'bottom',
  'margin-top',
  'margin-bottom',
  'padding-top',
  'padding-bottom',
  'row-gap',
  'line-height'
]);

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function pxToVw(px: number): string {
  return `${round4((px / MOBILE_DESIGN_WIDTH) * 100)}vw`;
}

function pxToVh(px: number): string {
  return `${round4((px / MOBILE_DESIGN_HEIGHT) * 100)}vh`;
}

function replacePx(value: string, axis: 'vw' | 'vh'): string {
  return value.replace(/(-?\d*\.?\d+)px/g, (_, raw) => {
    const px = Number(raw);
    return axis === 'vh' ? pxToVh(px) : pxToVw(px);
  });
}

function convertSpacingShorthand(value: string): string {
  const tokens = value.trim().split(/\s+/);
  if (!tokens.length || tokens.length > 4) {
    return replacePx(value, 'vw');
  }

  const axisByIndex =
    tokens.length === 1
      ? ['vh']
      : tokens.length === 2
        ? ['vh', 'vw']
        : tokens.length === 3
          ? ['vh', 'vw', 'vh']
          : ['vh', 'vw', 'vh', 'vw'];

  return tokens
    .map((token, idx) => replacePx(token, axisByIndex[idx] as 'vw' | 'vh'))
    .join(' ');
}

function convertPxByProperty(prop: string, value: string): string {
  if (!value.includes('px')) {
    return value;
  }

  if (prop === 'margin' || prop === 'padding' || prop === 'inset') {
    return convertSpacingShorthand(value);
  }

  if (HEIGHT_BASED_PROPS.has(prop)) {
    return replacePx(value, 'vh');
  }

  if (WIDTH_BASED_PROPS.has(prop)) {
    return replacePx(value, 'vw');
  }

  return replacePx(value, 'vw');
}

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  postprocess: [
    (util) => {
      const isArbitraryValueSelector = util.selector.includes('\\[');
      const isDesktopRule =
        util.selector.includes('.desktop\\:') || util.parent?.includes('(min-width:1200px)');

      if (!isArbitraryValueSelector || isDesktopRule) {
        return;
      }

      util.entries = util.entries.map(([prop, value, meta]) => {
        if (typeof value !== 'string') {
          return [prop, value, meta];
        }

        return [prop, convertPxByProperty(prop, value), meta];
      });
    }
  ],
  theme: {
    colors: {
      brand: {
        50: '#eef8f0',
        100: '#d5ecd8',
        500: '#2f8f46',
        700: '#1f6631'
      }
    },
    breakpoints: {
      mobile: '0px',
      tablet: '768px',
      desktop: '1200px'
    }
  },
  shortcuts: {
    'page-shell': 'min-h-[100vh] bg-[radial-gradient(circle_at_top,_#eef8f0,_#f8fafc_45%)] text-slate-900',
    'card-base':
      'rounded-[clamp(12px,1.2vw,24px)] bg-white/80 backdrop-blur shadow-[0_1.2vh_3vh_rgba(15,23,42,0.12)] border border-slate-200',
    'section-title': 'text-[clamp(18px,2.2vw,30px)] font-semibold tracking-tight text-slate-800'
  }
});
