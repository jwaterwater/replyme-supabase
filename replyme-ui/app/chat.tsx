import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Keyboard } from 'react-native';
import type { ScrollView as RNScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardControllerView, KeyboardStickyView, useKeyboardAnimation } from 'react-native-keyboard-controller';

import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
type Message = {
  id: string;
  sender: 'me' | 'other';
  senderLabel: string;
  initials: string;
  text: string;
  time: string;
};

export default function ChatScreen() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      sender: 'other',
      senderLabel: 'ReplyMe 助手',
      initials: 'RM',
      text: '嗨，欢迎来到 ReplyMe～如果有任何问题，随时告诉我。',
      time: '09:15',
    },
    {
      id: '2',
      sender: 'me',
      senderLabel: '我',
      initials: 'ME',
      text: '你好！请帮我看看今天的待办里有没有紧急任务。',
      time: '09:16',
    },
    {
      id: '3',
      sender: 'other',
      senderLabel: 'ReplyMe 助手',
      initials: 'RM',
      text: '已经帮你标记了两个待办为高优先级，还需要我设置提醒吗？',
      time: '09:18',
    },
  ]);

  const scrollRef = useRef<RNScrollView>(null);
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);
  const inputBarHeight = 72;
  const { height: keyboardHeight } = useKeyboardAnimation();


  const handleSend = useCallback(() => {
    const content = draft.trim();

    if (!content) {
      return;
    }

    const formattedTime = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        sender: 'me',
        senderLabel: '我',
        initials: 'ME',
        text: content,
        time: formattedTime,
      },
    ]);
    setDraft('');
  }, [draft]);

  const handleKeyboardShow = useCallback(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [messages]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);

    return () => {
      showSub.remove();
    };
  }, [handleKeyboardShow]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardControllerView style={{ flex: 1 }}>
        <Box className="flex-1 bg-background-0">
          <Box className="border-b border-outline-200 bg-background-0 px-5 py-4">
            <HStack className="items-center justify-between">
              <HStack space="sm" className="items-center">
                <Avatar size="sm">
                  <AvatarFallbackText>RM</AvatarFallbackText>
                </Avatar>
                <VStack space="xs">
                  <Text bold size="lg" className="text-typography-900">
                    ReplyMe 助手
                  </Text>
                  <Text size="xs" className="text-typography-500">
                    在线 · 响应迅速
                  </Text>
                </VStack>
              </HStack>
              <Button variant="link" action="primary" size="sm">
                <ButtonText>查看详情</ButtonText>
              </Button>
            </HStack>
          </Box>

          <Box className="flex-1">
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 24,
              }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            >
              <VStack space="lg">
                {messages.map((message) => {
                  const isMine = message.sender === 'me';
                  const bubbleClass = isMine
                    ? 'bg-primary-500 rounded-3xl rounded-br-md'
                    : 'bg-secondary-700 rounded-3xl rounded-bl-md';
                  const textClass = isMine
                    ? 'text-typography-0'
                    : 'text-typography-900';

                  return (
                    <HStack
                      key={message.id}
                      space="sm"
                      className={`w-full items-end ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMine && (
                        <Avatar size="xs">
                          <AvatarFallbackText>{message.initials}</AvatarFallbackText>
                        </Avatar>
                      )}

                      <VStack
                        space="xs"
                        className={`max-w-[80%] ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        {!isMine && (
                          <Text size="xs" className="text-typography-500">
                            {message.senderLabel}
                          </Text>
                        )}
                        <Box className={`px-4 py-3 ${bubbleClass}`}>
                          <Text className={`leading-5 ${textClass}`}>
                            {message.text}
                          </Text>
                        </Box>
                        <Text size="2xs" className="text-typography-400">
                          {message.time}
                        </Text>
                      </VStack>
                    </HStack>
                  );
                })}
              </VStack>
            </ScrollView>
          </Box>
        </Box>

        <KeyboardStickyView style={{ width: '100%' }} offset={{ opened: bottomInset }}>
          <Box
            className="border-t border-outline-200 bg-background-0 px-4 py-3"
            style={{ paddingBottom: bottomInset }}
          >
            <HStack space="sm" className="items-center">
              <Input
                variant="rounded"
                size="lg"
                className="flex-1 border-outline-200 bg-background-50"
              >
                <InputField
                  value={draft}
                  onChangeText={setDraft}
                  placeholder="输入消息..."
                  multiline
                  numberOfLines={1}
                  textAlignVertical="center"
                  returnKeyType="send"
                  onSubmitEditing={handleSend}
                />
              </Input>
              <Button action="primary" variant="solid" size="md" onPress={handleSend}>
                <ButtonText>发送</ButtonText>
              </Button>
            </HStack>
          </Box>
        </KeyboardStickyView>
      </KeyboardControllerView>
    </SafeAreaView>
  );
}
