import { MD3LightTheme as DefaultLightTheme, MD3DarkTheme as DefaultDarkTheme } from 'react-native-paper';

const lightColors = {
  ...DefaultLightTheme.colors,
  primary: '#6200ee',
  onPrimary: '#ffffff',
  surface: '#f5f5f5', // 这是卡片默认背景色
  onSurface: '#000000',
};

const darkColors = {
  ...DefaultDarkTheme.colors,
  primary: '#bb86fc',
  onPrimary: '#000000',
  surface: '#1e1e1e', // 暗黑模式下卡片背景色
  onSurface: '#ffffff',
};

export const lightTheme = {
  ...DefaultLightTheme,
  colors: lightColors,
};

export const darkTheme = {
  ...DefaultDarkTheme,
  colors: darkColors,
};