// components/CustomHeader.tsx
import React, { memo } from 'react';
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NavigationProp } from '@react-navigation/native';
import { ThemedView } from './ThemedView';

// 定义导航类型
type AllowedNavigationProp =
  | DrawerNavigationProp<Record<string, any>>
  | NavigationProp<Record<string, any>>;

// Props 类型定义
interface CustomHeaderProps {
  navigation: AllowedNavigationProp;
  title?: string; // 支持自定义标题
}

// 主组件
const CustomHeader: React.FC<CustomHeaderProps> = ({ navigation, title = 'AhaNote' }) => {
  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const openDrawerIfAvailable = () => {
    if ('openDrawer' in navigation) {
      navigation.openDrawer();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.headerContainer}>
        {/* 左侧：Home + Menu 按钮 */}
        <ThemedView style={styles.leftActions}>
          <TouchableOpacity onPress={openDrawerIfAvailable} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="menu" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToHome} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="home" size={28} color="#000" />
          </TouchableOpacity>
        </ThemedView>

        {/* 中间：标题 */}
        <Text numberOfLines={1} ellipsizeMode="head" style={styles.title}>
          {title}
        </Text>

        {/* 右侧：图标组 */}
        <ThemedView style={styles.rightActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Icon name="history" size={24} color="#000" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
};

export default memo(CustomHeader);

// 样式分离
const styles = StyleSheet.create({
  safeArea: {
    // backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    elevation: 4,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 16,
  },
});