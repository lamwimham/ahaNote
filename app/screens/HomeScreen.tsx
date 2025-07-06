import AnimatedFloatingActionButton from '@/components/AnimatedFloatingActionButton';
import BottomSheetInput from '@/components/BottomSheetInput';
import SimpleCard from '@/components/SimpleCard'; // ✅ 替换为 SimpleCard
import { ThemedText } from '@/components/ThemedText';
import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';

// 定义灵感数据类型
interface InspirationItem {
  id: string;
  title: string;
  content: string;
}

// 生成30条模拟灵感数据
const generateMockInspirations = (): InspirationItem[] => {
  const mockContents: string[] = [
    '这是一段灵感内容1',
    '这是一段灵感内容2',
    '这是一段灵感内容3',
    '这是一段灵感内容4',
    '这是一段灵感内容5',
  ];

  return mockContents.map((content, index) => ({
    id: `insp-${Date.now()}-${index}`,
    title: `灵感: `+ content,
    content,
  }));
};

const HomeScreen: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inspirations, setInspirations] = useState<InspirationItem[]>(
    generateMockInspirations()
  );
  const [selectId, setSelectId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const [scrollEnabled] = useState(true);
  const [editContent, setEditContent] = useState('');

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleConfirm = (text: string) => {
    if (text.trim() && selectId) {
      const card = inspirations.find((item) => item.id === selectId);
      if (card) {
        card.content = text;
      }
      setInspirations((prev) => [...prev]);
    } else if (text.trim()) {
      const newInspiration: InspirationItem = {
        id: `insp-${Date.now()}-${inspirations.length + 1}`,
        title: `灵感 #${inspirations.length + 1}`,
        content: text,
      };
      setInspirations((prev) => [newInspiration, ...prev]);

      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
    setIsModalVisible(false);
    setEditContent('');
    setSelectId(null);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setEditContent('');
    setSelectId(null);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <ThemedView
      style={[
        styles.container,
        {
          // paddingTop: insets.top,
        },
      ]}
    >
      {inspirations.length > 0 ? (
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 100,
            paddingTop: 10,
          }}
          scrollEnabled={scrollEnabled}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {inspirations.map((item) => (
            <SimpleCard
              key={item.id}
              title={item.title}
              tags={['标签1', '标签2']}
              content={item.content}
              style={styles.cardMargin}
            />
          ))}
        </ScrollView>
      ) : (
        <ThemedView
          style={[styles.emptyState, { paddingBottom: insets.bottom + 100 }]}
        >
          <ThemedText style={styles.emptyText}>还没有记录灵感</ThemedText>
          <ThemedText style={styles.hintText}>点击下方按钮添加一条灵感</ThemedText>
        </ThemedView>
      )}

      {/* 添加灵感按钮 */}
      <AnimatedFloatingActionButton
        icon="lightbulb-on"
        label="来灵感啦"
        position="right"
        onPress={() => setIsModalVisible(true)}
        backgroundColor="#007AFF"
        labelColor="#fff"
        iconColor="#fff"
        scrollY={scrollY}
        scrollThreshold={50}
      />

      <BottomSheetInput
        visible={isModalVisible}
        onConfirm={handleConfirm}
        onClose={handleClose}
        snapPoints={['80%']}
        text={editContent}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  scrollContainer: {
    flex: 1,
  },
  cardMargin: {
    marginBottom: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 14,
    color: '#BDC3C7',
  },
});

export default HomeScreen;