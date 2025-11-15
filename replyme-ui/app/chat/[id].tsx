import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ScrollView as RNScrollView } from 'react-native';
import { Keyboard } from 'react-native';
import { KeyboardControllerView, KeyboardStickyView, useKeyboardAnimation } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useChatStore } from '@/stores/chat';
import { useLocalSearchParams, useNavigation } from 'expo-router';
type Message = {
  id: string;
  sender: 'me' | 'other';
  senderLabel: string;
  initials: string;
  text: string;
  time: string;
};

export default function ChatScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { fetchFriendsInfo,friendsInfo,personInfo,sendMessage,messageList,currentMessage } = useChatStore();
  useEffect( () => {
    let userName = 'test'
    fetchFriendsInfo(parseInt(id as string))
  },[id])

 

  useEffect( () => {
    navigation.setOptions({
      title: personInfo.name
    })
  },[personInfo])


  const [draft, setDraft] = useState('');


  const scrollRef = useRef<RNScrollView>(null);
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);
  const inputBarHeight = 72;
  const { height: keyboardHeight } = useKeyboardAnimation();

  

  const handleSend = useCallback(() => {
    const content = draft.trim();
    setDraft('')
    sendMessage(content)
    return

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
  }, [messageList]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);

    return () => {
      showSub.remove();
    };
  }, [handleKeyboardShow]);

  return (
    <Box style={{ flex: 1 }}>
      <KeyboardControllerView style={{ flex: 1 }}>
        <Box className="flex-1">
          <Box className="flex-1">
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 10,
              }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            >
              <VStack space="lg">
                {messageList.map((message,index) => {
                  const isMine = message.from === 'user';
                  const bubbleClass = isMine
                    ? 'bg-primary-500 rounded-3xl rounded-br-md'
                    : 'bg-secondary-700 rounded-3xl rounded-bl-md';
                  const textClass = isMine
                    ? 'text-typography-0'
                    : 'text-typography-900';

                  return (
                    <HStack
                      key={index}
                      space="sm"
                      className={`w-full items-end ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMine && (
                        <Avatar size="xs">
                          <AvatarFallbackText>{message.from}</AvatarFallbackText>
                        </Avatar>
                      )}

                      <VStack
                        space="xs"
                        className={`max-w-[80%] ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        {!isMine && (
                          <Text size="xs" className="text-typography-500">
                            {message.from}
                          </Text>
                        )}
                        <Box className={`px-4 py-3 bg-secondary-700 rounded-3xl rounded-bl-md`}>
                          <Text className={`leading-5 ${textClass}`}>
                            {message.content}
                          </Text>
                        </Box>
                        <Text size="2xs" className="text-typography-400">
                          {message.from}
                        </Text>
                      </VStack>
                    </HStack>
                  );
                })}


                {currentMessage && <HStack
                      space="sm"
                      className={`w-full items-end justify-start`}
                    >
                    
                      <VStack
                        space="xs"
                        className={`max-w-[80%] items-start`}
                      >
                        <Text size="xs" className="text-typography-500">
                           AI
                        </Text>
                        <Box className={`px-4 py-3 text-typography-500`}>
                          <Text className={`leading-5 text-typography-900`}>
                            {currentMessage}
                          </Text>
                        </Box>
                        <Text size="2xs" className="text-typography-400">
                        </Text>
                      </VStack>
                  </HStack>}
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
    </Box>
  );
}
