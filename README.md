# VLight Design System

VLight 的独立设计系统文档站。当前技术栈：

- React 19 + Vite 8 + TypeScript 6
- Tailwind CSS 4
- shadcn/ui（Base UI + Lucide）
- `@/*` → `src/*` 导入别名

## 开发

```bash
npm run dev
```

## 无需服务的固定预览

```bash
npm run build:static-preview
```

生成后直接在浏览器打开项目根目录的 `OPEN-PREVIEW.html`。该入口会加载
`static-preview/index.html`，不依赖 Vite 开发服务。源码更新后重新运行一次命令即可刷新预览。

需要保存源码后自动刷新时，保持以下命令运行，再打开同一个 `OPEN-PREVIEW.html`：

```bash
npm run dev -- --host 127.0.0.1
```

入口会自动探测本地开发服务并切换到带 HMR 的实时预览；如果服务未运行，则仍回退到上面的离线静态预览。

## 验证

```bash
npm run tokens:css
npm run lint
npm run build
```

## Token 约定

`tokens/design-tokens.json` 是唯一真源。`npm run tokens:css` 会生成 `src/globals.css`，保留
Base → Semantic → Component 的 CSS 变量引用，并同步导出 Figma effect styles。

文档站自己的颜色、字体、字号、行高、间距、圆角、边框和阴影均引用生成后的 token 变量。

## Design System Registry

根目录的 `registry.json` 只索引 Foundation、Icon 和可复用 UI Component，不包含文档站壳层。
它由源码清单生成；设计系统资产发生变化后运行：

```bash
npm run registry:generate
```

不要直接维护生成结果；应修改对应 token、Icon、UI Component 或 registry 生成规则后重新生成。

## History Log

`history-log.json` is the append-only record of approved Foundation, Icon, and reusable Component changes. Each entry captures the date, affected object, summary, reason, and exact before/after values or references.

Validate it after every qualifying Design System change:

```bash
npm run history:validate
```

The History page reads this file directly. Documentation-shell changes, including navigation, routing, preview layouts, and the History page itself, are not logged. See `AGENTS.md` and `skills/vlight-design-system-history/SKILL.md` for the mandatory AI workflow.

## Foundation 页面

- `/?page=color`：Base、Semantic 与渐变参考。
- `/?page=typography`：字体家族、Typography Variables、全部 Figma Text Styles 与使用规范。
