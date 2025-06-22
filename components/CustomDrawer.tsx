// /src/components/CustomDrawer.tsx

import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Drawer, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface MenuItem {
  icon: string;
  label: string;
  subItems?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    icon: 'person-outline',
    label: '个人信息',
    subItems: [
      { label: '基本资料', href: '/profile/basic' },
      { label: '账号安全', href: '/profile/security' },
    ],
  },
  {
    icon: 'settings-outline',
    label: '应用设置',
    subItems: [
      { label: '通知设置', href: '/settings/notifications' },
      { label: '隐私设置', href: '/settings/privacy' },
    ],
  },
];

export const CustomDrawer = (props: any) => {
  const theme = useTheme();
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView style={styles.container}>
        {/* 用户信息 */}
        <ThemedView style={[styles.profileSection, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Icon name="person-circle-outline" size={64} color={theme.colors.onSurface} />
          <ThemedView style={styles.profileInfo}>
            <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>用户名</ThemedText>
            <ThemedText style={{ fontSize: 14, color: 'gray' }}>user@example.com</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* 菜单项 */}
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <TouchableWithoutFeedback
              onPress={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
            >
              <ThemedView style={styles.collapsibleHeader}>
                <Icon name={item.icon} size={24} color={theme.colors.onSurface} />
                <ThemedText style={{ marginLeft: 16 }}>{item.label}</ThemedText>
              </ThemedView>
            </TouchableWithoutFeedback>

            {expandedItem === item.label &&
              item.subItems?.map((subItem, subIndex) => (
                <Drawer.Item
                  key={subIndex}
                  label={subItem.label}
                  onPress={() => {
                    console.log(`Navigate to ${subItem.href}`);
                    props.navigation.closeDrawer(); // 关闭抽屉
                  }}
                  style={styles.subItem}
                />
              ))}
          </React.Fragment>
        ))}
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subItem: {
    paddingLeft: 72,
    paddingVertical: 4,
  },
});