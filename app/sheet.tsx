import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';

import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather'; // 图标库

interface BottomSheetInputProps {
  visible?: boolean;
  onClose?: () => void;
  onConfirm?: (text: string) => void;
  snapPoints?: string[];
}
const BottomSheetInput: React.FC<BottomSheetInputProps> = ({
  visible = false,
  onClose = () => {},
  onConfirm = () => {},
  snapPoints = ['75%'],
}) => {
  const [inputText, setInputText] = useState(''); // 使用初始值
  // ref
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  useEffect(() => {
    if (visible) {
      setInputText('');
    }
  }, [visible, inputText]);
  // 根据 visible 控制 BottomSheet 是否展开
  useEffect(() => {
    if (visible && bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
      bottomSheetRef.current.expand();
    } else if (!visible && bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(-1);
      bottomSheetRef.current.close();
    }
  }, [visible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose(); // 当 BottomSheet 关闭时回调
      }
    },
    [onClose]
  );
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // 新增：定义 inputRef
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // 延迟确保渲染完成
    }
  }, [visible]);

  // 编辑器状态
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    list: false,
  });

  const handleConfirm = () => {
    if (inputText.trim()) {
      onConfirm(inputText.trim());
    }
    setInputText(''); // 清空输入框
    Keyboard.dismiss(); // 收起键盘
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close(); // 主动关闭
    }
  };
  const toggleFormat = (key: 'bold' | 'italic' | 'underline' | 'list') => {
    const newFormats = { ...formats, [key]: !formats[key] };
    setFormats(newFormats);
  };
  const insets = useSafeAreaInsets();

  const getToolbarMargin = () => {
    if (isKeyboardVisible) {
      return Platform.OS === 'ios' ? 1 : 8;
    }
    return Platform.OS === 'ios'
      ? Math.max(insets.bottom, 24) // 确保至少有 24pt 的间距
      : 16;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        keyboardBehavior='extend'
        enableDynamicSizing={false}
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
              placeholder='输入内容...'
              multiline
              textAlignVertical='top'
              returnKeyType='done'
              onSubmitEditing={handleConfirm}
              submitBehavior='submit'
              autoFocus
            />
          </BottomSheetView>

          {/* 工具栏固定在底部 */}
          <BottomSheetView
            style={[
              styles.toolbarContainer,
              { marginBottom: getToolbarMargin() },
            ]}
          >
            <View style={styles.toolbarContent}>
              {/* 左侧滚动按钮区域 */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps='handled' // 允许点击输入框时，键盘不收起
                style={styles.buttonScrollView}
              >
                <View style={styles.buttonGroup}>
                  {/* 加粗按钮 */}
                  <TouchableOpacity
                    style={[
                      styles.toolbarButton,
                      formats.bold && styles.activeButton,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFormat('bold');
                    }}
                  >
                    <Icon
                      name='bold'
                      size={20}
                      color={formats.bold ? '#007AFF' : '#333'}
                    />
                  </TouchableOpacity>
                  {/* 斜体按钮 */}
                  <TouchableOpacity
                    style={[
                      styles.toolbarButton,
                      formats.italic && styles.activeButton,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFormat('italic');
                    }}
                  >
                    <Icon
                      name='italic'
                      size={20}
                      color={formats.italic ? '#007AFF' : '#333'}
                    />
                  </TouchableOpacity>
                  {/* 下划线按钮 */}
                  <TouchableOpacity
                    style={[
                      styles.toolbarButton,
                      formats.underline && styles.activeButton,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFormat('underline');
                    }}
                  >
                    <Icon
                      name='underline'
                      size={20}
                      color={formats.underline ? '#007AFF' : '#333'}
                    />
                  </TouchableOpacity>
                  {/* 列表按钮 */}
                  <TouchableOpacity
                    style={[
                      styles.toolbarButton,
                      formats.list && styles.activeButton,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFormat('list');
                    }}
                  >
                    <Icon
                      name='list'
                      size={20}
                      color={formats.list ? '#007AFF' : '#333'}
                    />
                  </TouchableOpacity>
                  {/* ...其他格式化按钮... */}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.toolbarButton}
                onPress={() => console.log('Voice button clicked')}
              >
                <Icon name='mic' size={20} color='#333' />
              </TouchableOpacity>
              {/* 右侧确认按钮 */}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Icon name='send' size={24} color='#fff' />
              </TouchableOpacity>
              {/* 其他按钮可以继续添加 */}
            </View>
          </BottomSheetView>
        </KeyboardAvoidingView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default BottomSheetInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    height: '95%',
    // backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
  toolbarContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  toolbarContent: {
    zIndex: 10, // 确保工具栏在最上层
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  buttonScrollView: {
    flex: 1, // 占据除确认按钮外的所有空间
    marginRight: 8, // 与确认按钮保持间距
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
  },
  confirmButton: {
    width: 44,
    height: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    // 不需要 marginRight，因为父容器已经有 paddingHorizontal
  },
  activeButton: {
    backgroundColor: '#e0f0ff',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between', // 确保内容和工具栏分布在两端
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // toolbarContainer: {
  //   paddingHorizontal: 8,
  //   paddingVertical: 8,
  //   borderTopWidth: 1,
  //   justifyContent: 'space-between',
  //   borderTopColor: '#ddd',
  //   backgroundColor: '#fff',
  // },
  // confirmButton: {
  //   width: 48,
  //   height: 40,
  //   backgroundColor: '#4CAF50', // 绿色背景
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 8,
  //   marginRight: 8, // 与前面按钮留出间距
  // },
});
