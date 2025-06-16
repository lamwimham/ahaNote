# 🚀 欢迎来使用你的 AhaNote 应用

[English](./README.md) | [中文](./README_CN.md)

这是一个使用 [`create-expo-app`](https://www.npmjs.com/package/create-expo-app) 创建的 [**Expo**](https://expo.dev) 项目。

## 🧰 开发前准备

在开始开发之前，请确保你的电脑上安装了以下工具：

- **Node.js**（推荐使用 v18.x）
- **npm** 或 **yarn**
- **Expo CLI**

我们将在下面逐步指导你完成这些工具的安装和配置。

---

## 🖥️ macOS 开发环境搭建（推荐方式）

### 1. 安装 Homebrew（如尚未安装）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. 安装 `nvm`（Node 版本管理器）

将 `nvm` 添加到你的 shell 配置文件中（根据你使用的 shell，可能是 `~/.zshrc` 或 `~/.bash_profile`）：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

然后重新加载你的 shell 配置文件：

```bash
source ~/.zshrc   # 或 source ~/.bash_profile
```

验证是否安装成功：

```bash
nvm --version
```

### 3. 安装并使用 Node.js v18

列出可用的 Node.js 版本：

```bash
nvm ls-remote
```

安装 Node.js v18：

```bash
nvm install 18
```

将其设置为默认版本：

```bash
nvm alias default 18
```

检查当前 Node.js 版本：

```bash
node -v
```

你应该看到类似 `v18.x.x` 的输出。

---

## 📱 开始开发项目

### 1. 安装依赖项

```bash
npm install
```

或使用 yarn：

```bash
yarn install
```

### 2. 启动开发服务器

```bash
npx expo start
```

> 你可以通过以下方式打开应用：
> - **iOS 模拟器**（按下 `i` 键）
> - **Android 模拟器**（按下 `a` 键）
> - **手机上的 Expo Go**（扫描二维码）

---

## 🛠️ 学习更多内容

如需深入了解如何使用 Expo 进行开发，请参考以下资源：

- [📘 Expo 官方文档](https://docs.expo.dev/)
- [📘 文件路由介绍](https://docs.expo.dev/router/introduction/)
- [📘 Expo 入门教程](https://docs.expo.dev/tutorial/introduction/)

---

## 🌐 加入社区

- [GitHub 仓库](https://github.com/expo/expo)
- [Discord 社区聊天室](https://chat.expo.dev)
- [Expo 论坛](https://forums.expo.dev)

---

## 💡 重置项目（可选）

如果你想获得一个全新的项目结构，运行以下命令：

```bash
npm run reset-project
```

该命令会将初始代码移动到 `app-example` 目录，并为你提供一个干净的 `app` 文件夹用于开发。
