import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { AnimatedFAB, useTheme, FABProps } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AnimatedFloatingActionButtonProps extends Omit<FABProps, 'icon'> {
  icon?: string;
  label: string;
  position?: 'left' | 'right';
  extended?: boolean;
  scrollThreshold?: number;
  scrollY?: Animated.Value;
  onPress?: () => void;
  style?: ViewStyle;
  showBackground?: boolean;
  animateIcon?: boolean;
  backgroundColor?: string;
  labelColor?: string;
  iconColor?: string;
  fadeOnScroll?: boolean;
}

const AnimatedFloatingActionButton: React.FC<AnimatedFloatingActionButtonProps> = ({
  icon = 'plus',
  label,
  position = 'right',
  extended = true,
  scrollThreshold = 50,
  scrollY,
  onPress,
  style,
  showBackground = false,
  animateIcon = true,
  backgroundColor,
  labelColor,
  iconColor,
  fadeOnScroll = true,
  ...rest
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  // 状态管理
  const [isExtended, setIsExtended] = useState(extended);
  const [visible, setVisible] = useState(true);
  
  // 动画值
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 处理滚动动画
  useEffect(() => {
    if (!scrollY || !fadeOnScroll) return;

    // let lastValue = 0;
    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const listener = scrollY.addListener(({ value }) => {
      // 检测滚动方向
      // const isScrollingDown = value > lastValue;
      // lastValue = value;
      
      // 滚动超过阈值 - 折叠按钮并半透明
      if (value > scrollThreshold) {
        if (!isScrolling) {
          isScrolling = true;
          
          // 折叠按钮
          setIsExtended(false);
          
          // 半透明效果
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 0.95,
              friction: 5,
              useNativeDriver: true,
            })
          ]).start();
        }
        
        // 清除之前的超时
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        // 设置新的超时来检测滚动停止
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
                  // 恢复不透明
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          })
        ]).start();
        }, 200);
      }

      // 滚动到顶部 - 展开按钮并不透明
      if (value <= scrollThreshold) {
        // 展开按钮
        setIsExtended(true);
        
        // 恢复不透明
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          })
        ]).start();
      }
    });

    return () => {
      scrollY.removeListener(listener);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollY, scrollThreshold, fadeOnScroll]);

  // 计算位置样式 - 考虑安全区域
  const getPositionStyle = () => {
    const baseStyle = { bottom: insets.bottom + 64 };
    switch (position) {
      case 'left':
        return { ...baseStyle, left: insets.left + 40 };
      case 'right':
      default:
        return { ...baseStyle, right: insets.right + 150 };
    }
  };

  // 计算背景容器样式
  const backgroundStyle = showBackground
    ? {
        backgroundColor: backgroundColor || theme.colors.surface,
        borderRadius: 28,
        padding: 4,
      }
    : {};

  return (
    <Animated.View 
      style={[
        styles.container, 
        getPositionStyle(), 
        backgroundStyle, 
        style,
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }] 
        }
      ]}
    >
      <AnimatedFAB
        icon={icon}
        label={label}
        extended={isExtended}
        visible={visible}
        onPress={onPress}
        animateFrom={position}
        iconMode={animateIcon ? 'dynamic' : 'static'}
        style={{
          backgroundColor: backgroundColor || theme.colors.primary,
        }}
        color={iconColor || theme.colors.onPrimary}
        {...rest}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AnimatedFloatingActionButton;