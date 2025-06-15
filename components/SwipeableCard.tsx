import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  PanResponder, 
  Dimensions,
  Easing,
} from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.7; // 滑动阈值
const CARD_HEIGHT = 200; // 卡片高度
const TEXT_OFFSET = SCREEN_WIDTH * 0.4; // 文字初始偏移量

interface SwipeableCardProps {
  id: string;
  title: string;
  content: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeClick?: () => void;
  onActivationChange?: (isActive: boolean) => void;
  style?: any;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  id,
  title,
  content,
  onSwipeLeft,
  onSwipeRight,
  onSwipeClick,
  onActivationChange,
  style,
}) => {
  const theme = useTheme();
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  
  const [isLongPressed, setIsLongPressed] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressActive = useRef(false);
  const isDragging = useRef(false);
  const currentPosition = useRef(0);
  
  // 文字动画值 - 与卡片同步移动但延迟出现
  const leftTextPosition = useRef(new Animated.ValueXY()).current;
  const rightTextPosition = useRef(new Animated.ValueXY()).current;
  const leftTextOpacity = useRef(new Animated.Value(1)).current;
  const rightTextOpacity = useRef(new Animated.Value(1)).current;
  const leftTextScale = useRef(new Animated.Value(0.8)).current;
  const rightTextScale = useRef(new Animated.Value(0.8)).current;

  // 清理计时器
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (isLongPressActive.current && onActivationChange) {
        onActivationChange(false);
      }
    };
  }, [onActivationChange]);

  // 激活状态变化时通知父组件
  useEffect(() => {
    if (onActivationChange) {
      onActivationChange(isLongPressActive.current);
    }
  }, [isLongPressed]);

  const handleLongPress = () => {
    setIsLongPressed(true);
    isLongPressActive.current = true;
    
    Animated.parallel([
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(rotation, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();
  };

  const resetState = () => {
    setIsLongPressed(false);
    isLongPressActive.current = false;
    isDragging.current = false;
    currentPosition.current = 0;
    
    // 重置所有动画
    Animated.parallel([
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(rotation, {
        toValue: 0,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(leftTextPosition, {
        toValue: { x: -TEXT_OFFSET, y: 0 },
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(rightTextPosition, {
        toValue: { x: TEXT_OFFSET, y: 0 },
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(leftTextOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rightTextOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleSwipeComplete = (direction: 'left' | 'right' | 'click') => {
    const distance = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: distance, y: 0 },
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(leftTextOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rightTextOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      if (direction === 'right' && onSwipeRight) {
        onSwipeRight();
      } else if (direction === 'left' && onSwipeLeft) {
        onSwipeLeft();
      } else if (direction === 'click' && onSwipeClick) {
        onSwipeClick();
      }
      resetState();
    });
  };

  // 更新文字位置和透明度
const updateTextAnimation = (dx: number) => {
  // 计算当前滑动比例 (0~1)
  const swipeRatio = Math.min(1, Math.abs(dx) / (SCREEN_WIDTH / 2));
  
  // 右滑时显示左侧文字
  if (dx > 0) {
    // 文字位置计算：初始偏移 + 卡片位移的60%
    const textX = dx * 0.5 - TEXT_OFFSET * (1 - swipeRatio);
    
    leftTextPosition.setValue({ x: textX, y: 0 });
    // Animated.parallel([
    //   Animated.spring(leftTextOpacity, {
    //     toValue: swipeRatio * 0.9, // 更早显示
    //     useNativeDriver: true,
    //   }),
    //   Animated.spring(leftTextScale, {
    //     toValue: 0.9 + swipeRatio * 0.3, // 轻微缩放效果
    //     useNativeDriver: true,
    //   }),
    //   Animated.spring(rightTextOpacity, {
    //     toValue: 0,
    //     useNativeDriver: true,
    //   })
    // ]).start();
    Animated.spring(leftTextScale, {
      toValue: 0.9 + swipeRatio * 0.3, // 保留缩放效果
      useNativeDriver: true,
    }).start();
  } 
  // 左滑时显示右侧文字
  else if (dx < 0) {
    const textX = dx * 0.5 + TEXT_OFFSET * (1 - swipeRatio);
    
    rightTextPosition.setValue({ x: textX, y: 0 });
    // Animated.parallel([
    //   Animated.spring(rightTextOpacity, {
    //     toValue: swipeRatio * 0.9, // 更早显示
    //     useNativeDriver: true,
    //   }),
    //   Animated.spring(rightTextScale, {
    //     toValue: 0.9 + swipeRatio * 0.3, // 轻微缩放效果
    //     useNativeDriver: true,
    //   }),
    //   Animated.spring(leftTextOpacity, {
    //     toValue: 0,
    //     useNativeDriver: true,
    //   })
    // ]).start();
    Animated.spring(rightTextScale, {
      toValue: 0.9 + swipeRatio * 0.3,
      useNativeDriver: true,
    }).start();
  } 
  // 滑动幅度小，隐藏文字
  else {
    Animated.spring(leftTextScale, {
      toValue: 0.8,
      friction: 10,
      useNativeDriver: true,
    }).start();

    Animated.spring(rightTextScale, {
      toValue: 0.8,
      friction: 10,
      useNativeDriver: true,
    }).start();
    // Animated.parallel([
    //   Animated.spring(leftTextOpacity, {
    //     toValue: 0,
    //     friction: 10,
    //     useNativeDriver: true,
    //   }),
    //   Animated.spring(rightTextOpacity, {
    //     toValue: 0,
    //     friction: 10,
    //     useNativeDriver: true,
    //   })
    // ]).start();
  }
};

  // 创建滑动手势处理器
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      if (isLongPressActive.current) return true;
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 3);
    },
    
    onPanResponderGrant: (_, gestureState) => {
      longPressTimer.current = setTimeout(() => {
        isDragging.current = true;
        handleLongPress();
        // 初始化文字位置
        leftTextPosition.setValue({ x: -TEXT_OFFSET, y: 0 });
        rightTextPosition.setValue({ x: TEXT_OFFSET, y: 0 });
      }, 150);
    },
    
    onPanResponderMove: (_, gestureState) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      
      if (isLongPressActive.current && isDragging.current) {
        position.setValue({ x: gestureState.dx, y: 0 });
        currentPosition.current = gestureState.dx;
        
        // 更新文字动画
        updateTextAnimation(gestureState.dx);
        
        // 添加旋转效果
        rotation.setValue(gestureState.dx * 0.03);
      }
    },
    
    onPanResponderRelease: (_, gestureState) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      if (!isLongPressActive.current) {
        handleSwipeComplete('click');
      } else {
        console.log('长按释放');
      }

      
      if (isDragging.current && isLongPressActive.current) {
        const velocityThreshold = 0.5;
        const distanceThreshold = SWIPE_THRESHOLD;
        
        const isRightSwipe = 
          gestureState.dx > distanceThreshold || 
          gestureState.vx > velocityThreshold;
        
        const isLeftSwipe = 
          gestureState.dx < -distanceThreshold || 
          gestureState.vx < -velocityThreshold;
        
        if (isRightSwipe) {
          handleSwipeComplete('right');
        } else if (isLeftSwipe) {
          handleSwipeComplete('left');
        } else {
          resetState();
        }
      } else if (!isLongPressActive.current) {
        resetState();
      }
      
      isDragging.current = false;
    },
    
    onPanResponderTerminate: () => {
      resetState();
      isDragging.current = false;
    }
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { 
        rotateZ: rotation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: ['-50deg', '0deg', '50deg']
        }) 
      }
    ],
    opacity: opacity
  };

  // 左侧文字样式 - 右滑时从左侧进入
  const leftTextStyle = {
    transform: [
      { translateX: leftTextPosition.x },
      { translateY: leftTextPosition.y },
      { scale: leftTextScale }
    ],
    opacity: 1
  };

  // 右侧文字样式 - 左滑时从右侧进入
  const rightTextStyle = {
    transform: [
      { translateX: rightTextPosition.x },
      { translateY: rightTextPosition.y },
      { scale: rightTextScale }
    ],
    opacity: 1
  };

  return (
    <View style={[styles.container, style]}>
      {/* 卡片容器 */}
      <Animated.View 
        style={[styles.cardWrapper, cardStyle]} 
        {...panResponder.panHandlers}
      >
        <Card 
        mode='outlined'
        style={[
          styles.card,
          isLongPressed && styles.cardActive
        ]}>
          <Card.Title 
            title={title} 
            titleStyle={styles.cardTitle}
            subtitle={content} 
            subtitleStyle={styles.cardSubtitle}
          />
          <Card.Content>
            <Text style={styles.cardContent}>{content}</Text>
          </Card.Content>
        </Card>
      </Animated.View>
      
      {/* 左侧文字 - 右滑时从左侧进入 */}
      <Animated.View style={[styles.leftTextContainer, leftTextStyle]}>
        <MaterialIcons 
          name="chat" 
          size={40} 
          color="#34c759"
          style={styles.textIcon}
        />
      </Animated.View>
      
      {/* 右侧文字 - 左滑时从右侧进入 */}
      <Animated.View style={[styles.rightTextContainer, rightTextStyle]}>
        <MaterialIcons 
          name="delete" 
          size={40} 
          color="#ff3b30"
          style={styles.textIcon}
        />
      </Animated.View>
    </View>
  );
};

const CARD_BORDER_RADIUS = 4;
// const ACTION_BACKGROUND_OPACITY = 0.1;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
    height: CARD_HEIGHT,
    justifyContent: 'center',
  },
  cardWrapper: {
    width: '100%',
    zIndex: 20, // 卡片在上层
  },
  card: {
    borderRadius: CARD_BORDER_RADIUS,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    borderColor: '#fff',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    
    height: CARD_HEIGHT, // 留出空间给文字
  },
  cardActive: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  cardContent: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 10,
    color: '#444',
  },
  cardActions: {
    justifyContent: 'center',
    paddingVertical: 15,
    borderTopColor: '#f0f0f0',
  },
  hintText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  
  // 左侧文字容器
  leftTextContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: [{ translateY: -25 }],
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // 右侧文字容器
  rightTextContainer: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: [{ translateY: -25 }],
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  actionText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  textIcon: {
    marginRight: 5,
    //垂直居中
    alignSelf: 'center',
  }
});

export default SwipeableCard;