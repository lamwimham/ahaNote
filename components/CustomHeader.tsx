// /src/components/CustomHeader.tsx

import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const CustomHeader = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const theme = useTheme();

  const handleMenuPress = () => {
    navigation.openDrawer(); // 打开抽屉
  };

  const handleSearch = () => {
    console.log('Search pressed');
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" onPress={handleMenuPress} color={theme.colors.primary} />
      <Appbar.Action icon="magnify" onPress={handleSearch} color={theme.colors.primary} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 0,
    backgroundColor: '#fff',
  },
  title: {
    alignItems: 'center',
  },
});

export default CustomHeader;