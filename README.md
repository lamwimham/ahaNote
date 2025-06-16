
# 🚀 Welcome to Your AhaNote App

[English](./README.md) | [中文](./README_CN.md)

This is a [**Expo**](https://expo.dev) project created using [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## 🧰 Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js** (we recommend v18.x)
- **npm** or **yarn**
- **Expo CLI**

We'll walk through setting up everything from scratch below.

---

## 🖥️ Development Setup on macOS (Recommended)

### 1. Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install `nvm` (Node Version Manager)

Add `nvm` to your shell profile (`~/.zshrc` or `~/.bash_profile`, depending on your shell):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Then reload your shell config:

```bash
source ~/.zshrc   # or source ~/.bash_profile
```

Verify installation:

```bash
nvm --version
```

### 3. Install and Use Node.js v18

List available versions:

```bash
nvm ls-remote
```

Install Node.js v18:

```bash
nvm install 18
```

Set it as default:

```bash
nvm alias default 18
```

Check current version:

```bash
node -v
```

You should see output like: `v18.x.x`.

---

## 📱 Get Started with the Project

### 1. Install Dependencies

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

### 2. Start the Development Server

```bash
npx expo start
```

> You can now open the app in:
> - **iOS Simulator** (press `i`)
> - **Android Emulator** (press `a`)
> - **Expo Go** on your phone (scan the QR code)

---

## 🛠️ Learn More

To dive deeper into developing with Expo, check out these resources:

- [📘 Expo Documentation](https://docs.expo.dev/)
- [📘 File-based Routing Guide](https://docs.expo.dev/router/introduction/)
- [📘 Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)

---

## 🌐 Join the Community

- [GitHub Repo](https://github.com/expo/expo)
- [Discord Chat](https://chat.expo.dev)
- [Expo Forums](https://forums.expo.dev)

---

## 💡 Reset the Project (Optional)

If you want a fresh start, run:

```bash
npm run reset-project
```

This will move the starter code to the `app-example` directory and give you a clean `app` folder to develop in.

