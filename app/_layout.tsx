import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './home';
// import Sheet from './sheet';
// import { useState } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // const [isSheetVisible, setIsSheetVisible] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <PaperProvider>
          <GestureHandlerRootView>
            {/* 直接渲染 HomeScreen */}
            <HomeScreen />
            {/* <Sheet/>  */}
            <StatusBar style='auto' />
          </GestureHandlerRootView>
        </PaperProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
