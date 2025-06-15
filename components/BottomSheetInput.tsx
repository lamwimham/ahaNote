import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  AppState,
  AppStateStatus,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

interface BottomSheetInputProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (text: string) => void;
  snapPoints: string[];
  text: string;
}

const BottomSheetInput: React.FC<BottomSheetInputProps> = ({
  visible = false,
  onClose,
  onConfirm,
  snapPoints = ['70%'],
  text = '',
}) => {
  // console.log('传入的text', text, visible);
  const isClosing = useRef(false);
  const [inputText, setInputText] = useState(text);
  // setInputText(text);
  // console.log('inputText', inputText);
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);

  // 应用状态监听
  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const safeInsets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [wasKeyboardVisible, setWasKeyboardVisible] = useState(false);
  const appStateRef = useRef(AppState.currentState);
  const isInputFocused = useRef(false);
  const inputRef = useRef<any>(null);

  // 编辑器状态
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    list: false,
  });

  // 更新聚焦状态
  const handleFocus = () => {
    isInputFocused.current = true;
  };

  const handleBlur = () => {
    isInputFocused.current = false;
  };

  const handleConfirm = () => {
    if (inputText.trim()) {
      onConfirm(inputText.trim());
    }
    setInputText('');
    Keyboard.dismiss();
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };
  
  const toggleFormat = (key: 'bold' | 'italic' | 'underline' | 'list') => {
    const newFormats = { ...formats, [key]: !formats[key] };
    setFormats(newFormats);
  };

  // 自定义工具栏底部边距
  const getToolbarMargin = () => {
    if (isKeyboardVisible) {
      return 0;
    }
    return Platform.OS === 'ios' ? Math.max(safeInsets.bottom, 16) : 16;
  };
  
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      appStateRef.current = nextAppState;
      // setAppStateVisible(nextAppState);
      
      if (nextAppState === 'active') {
        if (wasKeyboardVisible) {
          setTimeout(() => {
            if (visible && inputRef.current && bottomSheetRef.current) {
              bottomSheetRef.current.snapToIndex(0);
              inputRef.current.focus();
            }
          }, 10);
        }
      } else if (nextAppState === 'background') {
        setWasKeyboardVisible(isInputFocused.current);
        Keyboard.dismiss();
      } else if (nextAppState === 'inactive') {
        setWasKeyboardVisible(isInputFocused.current);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [wasKeyboardVisible, visible, keyboardHeight]);

  useEffect(() => {
    return () => {
      if (blurTimeout.current) clearTimeout(blurTimeout.current);
      isClosing.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (visible) {
      isClosing.current = false;
      setInputText(text);
      if (bottomSheetRef.current) {
        bottomSheetRef.current.snapToIndex(0);
      }
    } else {
      isClosing.current = true;
      if (bottomSheetRef.current) {
        bottomSheetRef.current.snapToIndex(-1);
      }
    }
  }, [visible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === 0 && visible) {
        inputRef.current?.focus();
      }
      
      if (index !== 0) {
        inputRef.current?.blur();
        Keyboard.dismiss();
      }

      if (index === -1) {
        onClose();
      }
    },
    [onClose, visible]
  );

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShow = Keyboard.addListener(showEvent, (e) => {
      setIsKeyboardVisible(true);
      if (e.endCoordinates.height !== keyboardHeight) {
        setKeyboardHeight(e.endCoordinates.height);
      }
    });

    const keyboardDidHide = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
      if (blurTimeout.current) clearTimeout(blurTimeout.current);
      isClosing.current = false;
    };
  }, [onClose, inputText, isInputFocused]);

  // 处理背景点击关闭
  const handleBackgroundPress = () => {
    if (!isKeyboardVisible) {
      onClose();
    }
  };

  // 如果没有显示，返回 null
  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* 添加背景遮罩层 */}
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      {/* 底部弹窗组件 */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        keyboardBehavior="extend"
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <BottomSheetView style={styles.contentContainer}>
            <BottomSheetTextInput
              ref={inputRef}
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="输入内容..."
              multiline
              textAlignVertical="top"
              returnKeyType="done"
              onSubmitEditing={handleConfirm}
              submitBehavior="submit"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </BottomSheetView>

          {/* 工具栏固定在底部 */}
          <BottomSheetView
            style={[
              styles.toolbarContainer,
              {
                marginBottom: getToolbarMargin(),
              },
            ]}
          >
            <View style={styles.toolbarContent}>
              {/* 左侧滚动按钮区域 */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.buttonScrollView}
              >
                <View style={styles.buttonGroup}>
                  {/* 加粗按钮 */}
                  <ToolbarButton 
                    active={formats.bold}
                    icon="bold"
                    onPress={() => toggleFormat('bold')}
                  />
                  {/* 斜体按钮 */}
                  <ToolbarButton 
                    active={formats.italic}
                    icon="italic"
                    onPress={() => toggleFormat('italic')}
                  />
                  {/* 下划线按钮 */}
                  <ToolbarButton 
                    active={formats.underline}
                    icon="underline"
                    onPress={() => toggleFormat('underline')}
                  />
                  {/* 列表按钮 */}
                  <ToolbarButton 
                    active={formats.list}
                    icon="list"
                    onPress={() => toggleFormat('list')}
                  />
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.toolbarButton}
                onPress={() => console.log('Voice button clicked')}
              >
                <Icon name="mic" size={20} color="#333" />
              </TouchableOpacity>
              {/* 右侧确认按钮 */}
              {/* <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Icon name="send" size={24} color="#fff" />
              </TouchableOpacity> */}
            </View>
          </BottomSheetView>
        </KeyboardAvoidingView>
      </BottomSheet>
    </View>
  );
};

// 工具栏按钮组件
const ToolbarButton = ({ 
  active, 
  icon, 
  onPress 
}: { 
  active: boolean; 
  icon: string; 
  onPress: () => void; 
}) => (
  <TouchableOpacity
    style={[
      styles.toolbarButton,
      active && styles.activeButton
    ]}
    onPress={onPress}
  >
    <Icon
      name={icon}
      size={20}
      color={active ? '#007AFF' : '#333'}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // 容器样式
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  
  // 添加覆盖层样式
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    height: '95%',
    backgroundColor: '#fff',
  },
  
  toolbarContainer: {
    paddingVertical: 2,
    // borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  
  toolbarContent: {
    zIndex: 10,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  
  buttonScrollView: {
    flex: 1,
    marginRight: 8,
  },
  
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  toolbarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
  },
  
  confirmButton: {
    width: 44,
    height: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  
  activeButton: {
    backgroundColor: '#e0f0ff',
  },
  
  keyboardAvoidingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
});

export default BottomSheetInput;