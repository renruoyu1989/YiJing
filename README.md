# 易心（YiJing）

基于 `uni-app`（Vue 3 + TypeScript + Vite）的《易经》起卦与解卦小应用，支持 H5、微信小程序与 App（iOS/Android，App-Plus）。

## 环境要求

- Node.js（建议 18 LTS 或 20 LTS）
- npm（随 Node 安装）
- iOS 打包需：macOS + HBuilderX + Apple Developer 账号（证书/描述文件）
- 微信小程序需：微信开发者工具 + 小程序 AppID

## 安装依赖

```bash
npm install
```

## 网页运行（H5）

开发调试（本地热更新）：

```bash
npm run dev:h5
```

构建发布版（生成静态资源）：

```bash
npm run build:h5
```

构建产物一般在：

- `dist/build/h5/`

## 发布微信小程序（mp-weixin）

### 1）配置微信小程序 AppID

编辑 `src/manifest.json`：

- 设置 `mp-weixin.appid`
- 如需本地请求调试，可保持 `mp-weixin.setting.urlCheck: false`

### 2）开发调试

```bash
npm run dev:mp-weixin
```

然后用微信开发者工具打开（通常是）：

- `dist/dev/mp-weixin/`

### 3）构建发布

```bash
npm run build:mp-weixin
```

然后用微信开发者工具打开并上传（通常是）：

- `dist/build/mp-weixin/`

上传前建议在微信开发者工具中检查：

- `项目设置` -> `AppID` 是否一致
- `详情` -> `本地设置` -> `不校验合法域名...`（仅开发期）
- `详情` -> `上传` 生成体验版 / 提交审核 / 发布

## 发布 iOS（App-Plus）

uni-app 的 iOS 发布通常通过 HBuilderX 完成（支持云打包或导出 Xcode 工程）。CLI 构建可用于生成资源，但最终 iOS 包仍需要在 macOS 上打包签名。

### 1）填写应用基础信息

编辑 `src/manifest.json`：

- `name`：应用名称
- `appid`：应用 AppID（建议在 HBuilderX 中生成/管理）

### 2）使用 HBuilderX 打包（推荐）

1. 安装并打开 HBuilderX
2. `文件` -> `导入` -> `从本地目录导入`，选择项目根目录 `YiJing/`
3. 打开 `src/manifest.json`（或在 HBuilderX 的可视化界面中编辑）补全应用信息
4. `发行` -> `原生App-云打包`
5. 选择 iOS，按提示配置：
   - Apple Developer 账号
   - iOS 证书（.p12）与 Profile（.mobileprovision）
   - Bundle Identifier（与证书/描述文件一致）
6. 云打包完成后下载 `.ipa`，在 TestFlight / 蒲公英等渠道分发或提交 App Store 审核

### 3）导出 Xcode 工程（可选）

如需更多原生能力或自定义签名流程，可在 HBuilderX 中选择导出 iOS 工程：

1. `发行` -> `原生App-本地打包`/`导出iOS工程`（不同版本菜单名称略有差异）
2. 在 macOS 上用 Xcode 打开工程
3. 配置签名与 Capabilities
4. Archive 后上传到 App Store Connect

## 常用命令

- `npm run type-check`：TypeScript 类型检查
- `npm run dev:h5`：H5 开发
- `npm run build:h5`：H5 构建
- `npm run dev:mp-weixin`：微信小程序开发
- `npm run build:mp-weixin`：微信小程序构建

