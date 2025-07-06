// CustomHeader.tsx
import React, { memo, useCallback } from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  TextStyle,
} from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NavigationProp } from '@react-navigation/native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useTheme } from 'react-native-paper';

// 定义导航类型
type AllowedNavigationProp =
  | DrawerNavigationProp<Record<string, any>>
  | NavigationProp<Record<string, any>>;

// Props 类型定义
interface CustomHeaderProps {
  navigation: AllowedNavigationProp;
  title?: string; // 支持自定义标题
  headerTitleStyle?: TextStyle; // 自定义标题样式
  rightComponent?: React.ReactNode; // 自定义右侧组件
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  navigation,
  title = 'AhaNote',
  headerTitleStyle,
  rightComponent,
}) => {
  const theme = useTheme();

  const navigateToHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const openDrawerIfAvailable = useCallback(() => {
    if ('openDrawer' in navigation) {
      navigation.openDrawer();
    }
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.headerContainer}>
        {/* 左侧：Menu 按钮 */}
        <ThemedView style={styles.leftActions}>
          <TouchableOpacity
            onPress={openDrawerIfAvailable}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name="menu"
              size={28}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
        </ThemedView>

        {/* 中间：标题（点击无反馈） */}
        <TouchableOpacity
          onPress={navigateToHome}
          activeOpacity={1} // 禁用透明度变化
          // 禁用背景色变化
          style={styles.titleContainer}
        >
          <ThemedText
            numberOfLines={1}
            ellipsizeMode="head"
            style={[styles.title, headerTitleStyle]}
          >
            {title}
          </ThemedText>
        </TouchableOpacity>

        {/* 右侧：图标组 或 自定义组件 */}
        <ThemedView style={styles.rightActions}>
          {rightComponent ? (
            rightComponent
          ) : (
            <>
              <TouchableOpacity 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => navigation.navigate('Search')}>
                <MaterialIcons
                  name="search"
                  size={24}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
            </>
          )}
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
};

export default memo(CustomHeader, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.headerTitleStyle === nextProps.headerTitleStyle &&
    prevProps.rightComponent === nextProps.rightComponent
  );
});

// 样式定义
const styles = StyleSheet.create({
  safeArea: {
    // backgroundColor: '#fff',
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    height: 28,
    elevation: 4,
    shadowRadius: 2,
  },
  leftActions: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    gap: 12,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  rightActions: {
    backgroundColor: 'transparent',

    flexDirection: 'row',
    gap: 12,
  },
});