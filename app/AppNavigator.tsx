// /src/navigation/AppNavigator.tsx

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawer } from '@/components/CustomDrawer';
import HomeScreen from './HomeScreen';
// import SearchScreen from './SearchScreen'; // 假设你有一个搜索页面组件

const Drawer = createDrawerNavigator();

export const AppNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="AhaNote" component={HomeScreen} />
    </Drawer.Navigator>
  );
};