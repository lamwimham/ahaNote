// src/screens/SearchScreen.tsx
import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // 示例逻辑：跳转到搜索结果页并传递关键词
    // navigation.navigate('SearchResults', { query: searchQuery });
  };

  return (
    <>
      <ThemedView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter search term"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <ThemedText style={styles.buttonText}>Search</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.infoText}>Start typing to search content...</ThemedText>
      </ThemedView>
    </>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
});