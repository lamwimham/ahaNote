// components/CustomMenu.tsx
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Divider, IconButton, Menu } from 'react-native-paper';

interface MenuItem {
  title: string;
  onPress: () => void;
}

interface CustomMenuProps {
  anchor?: 'left' | 'right'; // 可选 left 或 right，默认是 right
  icon?: string; // 图标名称，默认为 dots-vertical
  menuItems: MenuItem[];
}

const CustomMenu = ({ anchor = 'right', icon = 'dots-vertical', menuItems = [] }: CustomMenuProps) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          icon={icon}
          size={24}
          onPress={openMenu}
          style={anchor === 'left' ? styles.leftButton : styles.rightButton}
        />
      }
      style={anchor === 'left' ? styles.drawerLeft : styles.drawerRight}
    >
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          <Menu.Item onPress={item.onPress} title={item.title} />
          {index < menuItems.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Menu>
  );
};

const styles = StyleSheet.create({
  leftButton: {
    marginLeft: 8,
    marginRight: 0,
  },
  rightButton: {
    marginRight: 8,
    marginLeft: 0,
  },
  drawerLeft: {
    alignSelf: 'flex-start',
    transform: [{ translateX: 0 }],
  },
  drawerRight: {
    alignSelf: 'flex-end',
    transform: [{ translateX: 0 }],
  },
});

export default CustomMenu;