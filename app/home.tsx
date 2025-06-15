import AnimatedFloatingActionButton from '@/components/AnimatedFloatingActionButton';
import BottomSheetInput from '@/components/BottomSheetInput';
import SwipeableCard from '@/components/SwipeableCard';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 定义灵感数据类型
interface InspirationItem {
  id: string;
  title: string;
  content: string;
}

// 生成30条模拟灵感数据
const generateMockInspirations = (): InspirationItem[] => {
  const mockContents: string[] = [
  ];

  return mockContents.map((content, index) => ({
    id: `insp-${Date.now()}-${index}`,
    title: `灵感 #${index + 1}`,
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
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [editContent, setEditContent] = useState('');
  // 创建滚动位置跟踪器
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true, // 启用动画
    });
  };
  const handleConfirm = (text: string) => {
    if (text.trim() && selectId) {
      // 修改列表项
      const card = inspirations.find((item) => item.id === selectId);
      if (card) {
        card.content = text;
      }
      setInspirations((prev) => [...prev]);
    } else if (text.trim()) {
      // 新增
      const newInspiration: InspirationItem = {
        id: `insp-${Date.now()}-${inspirations.length + 1}`,
        title: `灵感 #${inspirations.length + 1}`,
        content: text,
      };
      setInspirations((prev) => [newInspiration, ...prev]);

      // 延迟一下确保 DOM 更新后再滚动（React 异步更新）
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

  // 处理滚动事件
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  // 处理卡片滑动操作
  const handleSwipe = (id: string, direction: 'left' | 'right' | 'click') => {
    console.log(`卡片 ${id} - ${direction === 'left' ? '没想法' : '有想法'}`);
    if (direction === 'right') {
      // 编辑，或进入沟通模式
      const card = inspirations.find((card) => card.id === id);
      console.log('进入沟通模式', card);
      if (card) {
        setEditContent(card?.content);
      }
      // 记录操作的id
      setSelectId(id);
      // setIsModalVisible(true);
    } else if (direction === 'left'){
      // 移除
      setInspirations((prev) => prev.filter((item) => item.id !== id));
    } else {
      const card = inspirations.find((card) => card.id === id);
      console.log('进入编辑模式', card);
      if (card) {
        setEditContent(card?.content);
      }
      // 记录操作的id
      setSelectId(id);
      setIsModalVisible(true);

    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
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
          scrollEnabled={scrollEnabled} // 控制滚动是否启用
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {inspirations.map((item) => (
            <SwipeableCard
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.content}
              onSwipeLeft={() => handleSwipe(item.id, 'left')}
              onSwipeRight={() => handleSwipe(item.id, 'right')}
              onSwipeClick={() => handleSwipe(item.id, 'click')}
              onActivationChange={(isActive) => {
                setScrollEnabled(!isActive);
              }}
              style={styles.cardMargin}
            />
          ))}
        </ScrollView>
      ) : (
        <View
          style={[styles.emptyState, { paddingBottom: insets.bottom + 100 }]}
        >
          <Text style={styles.emptyText}>还没有记录灵感</Text>
          <Text style={styles.hintText}>点击下方按钮添加第一条灵感</Text>
        </View>
      )}

      {/* 添加灵感按钮 */}
      <AnimatedFloatingActionButton
        icon='lightbulb-on'
        label='来灵感啦'
        position='right'
        onPress={() => setIsModalVisible(true)}
        backgroundColor='#007AFF'
        labelColor='#FFFFFF'
        iconColor='#FFFFFF'
        scrollY={scrollY}
        scrollThreshold={50}
      />

      <BottomSheetInput
        visible={isModalVisible}
        onConfirm={handleConfirm}
        onClose={handleClose}
        snapPoints={['68%']}
        text={editContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 8,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    flex: 1,
  },
  cardMargin: {
    marginBottom: 10,
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
