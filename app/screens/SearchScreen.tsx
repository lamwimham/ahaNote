// src/screens/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  TextInput,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Chip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'search_history';
const MAX_HISTORY = 10;

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [historyQueries, setHistoryQueries] = useState<string[]>([]);

  // 加载历史记录
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(HISTORY_KEY);
      if (history) {
        setHistoryQueries(JSON.parse(history));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  const saveHistory = async (newHistory: string[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const updatedHistory = [
      searchQuery,
      ...historyQueries.filter(q => q !== searchQuery)
    ].slice(0, MAX_HISTORY);

    setHistoryQueries(updatedHistory);
    saveHistory(updatedHistory);
  };

  const handleHistoryItemPress = (query: string) => {
    setSearchQuery(query);
  };

  const removeHistoryItem = (query: string) => {
    const newHistory = historyQueries.filter(q => q !== query);
    setHistoryQueries(newHistory);
    saveHistory(newHistory);
  };

  const clearHistory = async () => {
    setHistoryQueries([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  };

  return (
    <>
      <ThemedView style={styles.container}>
        {/* 搜索输入框和按钮同行布局 */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="输入探索关键词..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoFocus
          />

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <ThemedText style={styles.buttonText}>探索</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 历史记录区域 */}
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <ThemedText style={styles.historyTitle}>探索历史</ThemedText>
            {historyQueries.length > 0 && (
              <TouchableOpacity onPress={clearHistory}>
                <ThemedText style={styles.clearText}>清除</ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {historyQueries.length === 0 ? (
            <ThemedText style={styles.emptyText}>暂无探索记录</ThemedText>
          ) : (
            <ScrollView contentContainerStyle={styles.chipContainer}>
              {historyQueries.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.chipWrapper}
                  onPress={() => handleHistoryItemPress(item)}
                  onLongPress={() => removeHistoryItem(item)}
                >
                  <Chip mode="flat" 
                    style={styles.chip}
                    textStyle={styles.chipText}
                  >
                    {item}
                  </Chip>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ThemedView>
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    fontSize: 14,
    borderColor: '#ccc',
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRightWidth: 0, // 隐藏右侧边框
  },
  searchButton: {
    backgroundColor: '#007AFF',
    height: 40,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 0,
    borderLeftWidth: 0, // 隐藏左侧边框
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearText: {
    color: '#007AFF',
    fontSize: 14,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  chipWrapper: {
    marginVertical: 4,
    flexShrink: 1,
    flexGrow: 0,
    flexBasis: 'auto',
  },
  chip: {
    paddingHorizontal: 2,
    backgroundColor: '#ddd',
    elevation: 2,
    ...(Platform.OS === 'ios' ? { minHeight: 32 } : {}),
  },
  chipText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#999'
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
});