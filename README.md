# multi-device-template

基于 `rsbuild + react + unocss` 的多端开发模板，包含：

- PC / Mobile / Pad 三端响应式布局
- 基于 UA 的设备识别（含 iPadOS 桌面 UA 兜底）
- 按设备类型路由 API 基地址（`/api/pc`、`/api/pad`、`/api/mobile`）
- 统一 `fetch` 封装，并自动附带 `x-device-type` 请求头

## 快速开始

```bash
npm install
npm run dev
```

默认启动端口：`3000`

## 目录结构

```text
src/
  api/
    client.ts        # API 客户端封装
    endpoints.ts     # 设备 -> API 基地址映射
  components/
    DevicePanel.tsx  # 多端页面示例
  device/
    ua.ts            # UA 识别逻辑
    device-context.tsx
    use-device.ts
  App.tsx
  main.tsx
  styles.css
```

## 设备识别

- 默认自动读取 `navigator.userAgent`
- 支持通过 URL 参数强制切换设备，便于调试：

```text
?device=mobile
?device=tablet
?device=desktop
```

## API 环境策略

- `desktop -> /api/pc`
- `tablet -> /api/pad`
- `mobile -> /api/mobile`

开发环境可通过 `PUBLIC_API_ORIGIN` 注入网关域名，例如：

```bash
PUBLIC_API_ORIGIN=http://localhost:8080 npm run dev
```

最终请求地址示例：`http://localhost:8080/api/mobile/env`

## UnoCSS px 自动换算（375 设计稿）

- 已在 `/Users/yuzili/Projects/Practice/multi-device-template/uno.config.ts` 配置 `postprocess`
- 在 `mobile / pad` 开发中，可直接写 `[]` 任意值里的 `px`
- UnoCSS 生成 CSS 时会自动换算为 `vw / vh`（基准：`375 x 812`）
- `desktop:*` 变体默认跳过自动换算，避免影响 PC 自适应策略

示例：

```tsx
<div className="w-[150px] h-[200px] p-[16px_12px] text-[14px]" />
```

对应换算后（示意）：

- `w-[150px] -> width: 40vw`
- `h-[200px] -> height: 24.6305vh`
- `p-[16px_12px] -> padding: 1.9704vh 3.2vw`
- `text-[14px] -> font-size: 3.7333vw`

## 可扩展建议

- 在网关层按 `x-device-type` 做 BFF 分流
- 接入 SSR 时将服务端 UA 透传到 `detectDeviceType`
- 配置 `mock` 服务，按端返回不同结构数据
