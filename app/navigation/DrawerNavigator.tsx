// navigation/DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AppStack from './AppStack';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="AppStack"      
      screenOptions={{
        headerShown: false, // 👈 在这里统一关闭所有 Drawer.Screen 的默认 Header
      }}>
      <Drawer.Screen name="AppStack" component={AppStack} options={{ title: 'Home' }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;