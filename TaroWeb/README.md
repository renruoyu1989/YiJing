# 易经金钱卦（Taro + Vue3 + TS）

## 环境要求

- Node.js 18+（建议 LTS）
- npm 9+

## 安装依赖

```bash
npm install
```

## 运行 H5（开发模式）

```bash
npm run dev:h5
```

启动后按终端输出打开类似 `http://localhost:10087/` 的地址。

## 构建 H5（生产包）

```bash
npm run build:h5
```

产物输出到 `dist/`（会被其它端构建覆盖，见下文说明）。

## 运行/构建微信小程序（Weapp）

开发（watch）：

```bash
npm run dev:weapp
```

生产构建：

```bash
npm run build:weapp
```

构建完成后，用微信开发者工具导入项目：

- 目录选择项目根目录 `D:/TaroWeb`
- 或直接导入构建产物目录 `dist/`（取决于你习惯的工作流）

`project.config.json` 已在仓库根目录中。

## 生成 iOS App（Capacitor：用 H5 作为壳）

说明：Capacitor 会把 H5 产物目录当作 `webDir`。本项目默认 H5 构建输出到 `dist/`，因此打包 iOS 前请先执行 `npm run build:h5`，且不要在其后再执行 `build:weapp` 覆盖 `dist/`。

1) 先构建 H5：

```bash
npm run build:h5
```

2) 安装 Capacitor（首次）：

```bash
npm i -D @capacitor/cli @capacitor/core @capacitor/ios
```

3) 初始化 Capacitor（首次）：

```bash
npx cap init taro-iching com.example.taroiching --web-dir dist
```

4) 添加 iOS 平台（首次）：

```bash
npx cap add ios
```

5) 同步资源并打开 Xcode：

```bash
npx cap sync ios
npx cap open ios
```

之后在 Xcode 中选择真机/模拟器运行即可。

