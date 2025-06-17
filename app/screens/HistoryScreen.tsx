// screens/HistoryScreen.tsx
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

const HistoryScreen: React.FC = () => {
  const historyItems = [
    { id: '1', label: 'Visited Home Page' },
    { id: '2', label: 'Searched for "React"' },
    { id: '3', label: 'Viewed Profile' },
  ];

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>History</ThemedText>
      <FlatList
        data={historyItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ThemedText>{item.label}</ThemedText>
          </View>
        )}
      />
    </View>
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