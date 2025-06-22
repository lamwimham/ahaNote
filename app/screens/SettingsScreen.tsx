import React, { useState } from 'react';
import { Switch, StyleSheet } from 'react-native';

// import CustomHeader from '@/components/CustomHeader';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList} from '@/types/types';
export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // 此处应调用全局主题切换函数，例如通过 Context 或 Redux
  };

  return (
    <>
      {/* <CustomHeader title="Settings" navigation={navigation} /> */}
      <ThemedView style={styles.container}>
        <ThemedView style={styles.settingItem}>
          <ThemedText style={styles.settingLabel}>Night Mode</ThemedText>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </ThemedView>

        {/* 可选设置项 */}
        <ThemedView style={styles.settingItem}>
          <ThemedText style={styles.settingLabel}>Notifications</ThemedText>
          <Switch value={true} onValueChange={() => {}} />
        </ThemedView>

        <ThemedView style={styles.settingItem}>
          <ThemedText style={styles.settingLabel}>Enable Biometric Login</ThemedText>
          <Switch value={false} onValueChange={() => {}} />
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
});