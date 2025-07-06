// navigation/DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AppStack from './AppStack';
import { useTheme } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const DRAWER_WIDTH = width * 0.7;
  return (
    <Drawer.Navigator initialRouteName="AppStack"      
      screenOptions={{
        headerShown: false, // 👈 在这里统一关闭所有 Drawer.Screen 的默认 Header
        drawerStyle: {
          backgroundColor: theme.colors.background,
          width: DRAWER_WIDTH,
        }
      }}>
      <Drawer.Screen name="AppStack" component={AppStack} options={{ title: '主页' }} />
      <Drawer.Screen name="个人信息" component={ProfileScreen} />
      <Drawer.Screen name="设置" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;