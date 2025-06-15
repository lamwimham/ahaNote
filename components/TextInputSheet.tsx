import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 👈 已引入

// 👇 在文件顶部添加以下接口定义（或根据实际情况导入）
interface TextInputSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (text: string) => void;
  snapPoints?: string[];
}
const TextInputSheet: React.FC<TextInputSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  snapPoints = ['75%'],
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [inputText, setInputText] = useState('');
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 确保 snapPoints 是一个字符串数组
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      console.log('Closing bottom sheet');
      bottomSheetRef.current?.close();
    }
  }, [visible]);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      console.log('Keyboard height:', e.endCoordinates.height);
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      console.log('Keyboard closed');
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

const onContentSizeChange = (contentWidth: number, contentHeight: number) => {
  scrollViewRef.current?.scrollTo({ y: 5, animated: true });
};
  const handleConfirm = () => {
    if (inputText.trim()) {
      onConfirm(inputText);
      setInputText('');
    }
    bottomSheetRef.current?.close();
    Keyboard.dismiss(); // 👈 手动收起软键盘
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      backgroundStyle={{
        backgroundColor: '#f2f2f7',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
      containerStyle={{
        elevation: 10,
        zIndex: 1000,
      }}
      detached
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={isFocused ? insets.bottom : insets.bottom}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'
          onContentSizeChange={onContentSizeChange} // 监听内容尺寸变化
        >
          <BottomSheetView style={styles.container}>
            <View style={{ flex: 1 }}>

              {/* 输入框区域，受键盘影响抬高 */}
              <Animated.View
                style={[
                  styles.inputContainer,
                  { marginBottom: keyboardHeight },
                ]}
              >
                <TextInput
                  multiline
                  style={styles.fullscreenInput}
                  placeholder='开始输入...'
                  value={inputText}
                  onChangeText={setInputText}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  returnKeyType='done'
                  onSubmitEditing={handleConfirm}
                  submitBehavior='submit'
                />
              </Animated.View>
            </View>
          </BottomSheetView>
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

export default TextInputSheet;

// ========================
// 样式定义（重点修改 input）
// ========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    paddingTop: 10,
  },
  staticContent: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputContainer: {
    flex: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 0, // 动态由 JS 控制
    backgroundColor: '#fff',
  },
  fullscreenInput: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    fontSize: 16,
    color: '#1c1c1e',
    padding: 16,
    textAlignVertical: 'top',
  },
  confirmButton: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
