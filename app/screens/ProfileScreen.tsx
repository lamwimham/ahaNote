import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList} from '@/types/types';
export default function ProfileScreen() {
  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>
      {/* <CustomHeader navigation={navigation} title="Profile" /> */}
      <ThemedView style={styles.container}>
        <ThemedText style={styles.welcomeText}>Welcome back! This is your profile.</ThemedText>

        {/* 可选的额外内容区域 */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>User Info</ThemedText>
          <ThemedText style={styles.cardContent}>Name: John Doe</ThemedText>
          <ThemedText style={styles.cardContent}>Email: john.doe@example.com</ThemedText>
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    marginBottom: 4,
  },
});