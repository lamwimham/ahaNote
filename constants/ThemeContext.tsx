// // app/theme/ThemeContext.tsx
// import React, { createContext, useState, useEffect } from 'react';
// import { Appearance, ColorSchemeName } from 'react-native';
// import { ThemeType, AppTheme } from './Theme';

// type ThemeContextType = {
//   theme: ThemeType;
//   isDark: boolean;
//   toggleTheme: () => void;
// };

// const ThemeContext = createContext<ThemeContextType>({
//   theme: AppTheme,
//   isDark: false,
//   toggleTheme: () => {},
// });

// export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isDark, setIsDark] = useState<boolean>(Appearance.getColorScheme() === 'dark');

//   useEffect(() => {
//     const subscription = Appearance.addChangeListener(
//       // 显式声明参数类型为 ColorSchemeName
//       ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
//         setIsDark(colorScheme === 'dark');
//       }
//     );
//     return () => subscription.remove();
//   }, []);

//   const theme = {
//     ...AppTheme,
//     colors: {
//       ...AppTheme.colors,
//       background: isDark ? AppTheme.colors.dark.background : AppTheme.colors.background,
//       text: isDark ? AppTheme.colors.dark.text : AppTheme.colors.text,
//     },
//   };

//   const toggleTheme = () => {
//     setIsDark(prev => !prev);
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => React.useContext(ThemeContext);