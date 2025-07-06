// components/ChatBubble.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 消息类型
type MessageType = 'ai' | 'user';

interface Message {
  id: string;
  type: MessageType;
  text: string;
}

const ChatBubble: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = React.useState<Message[]>([
    { id: '1', type: 'ai', text: '你好！我是你的AI助手，有什么可以帮助你的吗？' },
    { id: '2', type: 'user', text: '帮我推荐一本好书吧。' },
    { id: '3', type: 'ai', text: '如果你喜欢科幻小说，我推荐《三体》！' },
    { id: '4', type: 'user', text: '听起来不错，这本书主要讲什么？' },
    { id: '5', type: 'ai', text: '《三体》讲述了地球文明与三体文明之间的博弈，涉及宇宙社会学、黑暗森林法则等概念，情节紧凑且富有哲理。' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.messageList,
          { paddingBottom: insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// 单条消息组件
const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.aiBubble,
      ]}>
        <Text style={[
          styles.bubbleText,
          isUser ? styles.userText : styles.aiText,
        ]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#000000',
  },
});
