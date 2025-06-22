// screens/HistoryScreen.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

const HistoryScreen: React.FC = () => {
  const historyItems = [
    { id: '1', label: 'Visited Home Page' },
    { id: '2', label: 'Searched for "React"' },
    { id: '3', label: 'Viewed Profile' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>History</ThemedText>
      <FlatList
        data={historyItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.item}>
            <ThemedText>{item.label}</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default HistoryScreen;