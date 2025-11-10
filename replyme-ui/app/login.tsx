import { useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Image } from '@/components/ui/image';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from '@/components/ui/actionsheet';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';

const HERO_SLIDES = [
  {
    id: 'conversation',
    title: 'Real conversations',
    description:
      'Practice real-world dialogues with an AI tutor that adapts to your tone and pace.',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200',
  },
  {
    id: 'feedback',
    title: 'Instant feedback',
    description:
      'Receive nuanced pronunciation and grammar guidance immediately after every sentence.',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200',
  },
  {
    id: 'journey',
    title: 'Daily momentum',
    description:
      'Micro lessons keep your streak alive and build confidence in minutes each day.',
    image:
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 48; // px-6 on both sides
const CAROUSEL_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING;
const CAROUSEL_HEIGHT = Math.min(CAROUSEL_WIDTH * 1.05, 360);

export default function LoginScreen() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [otpTimer, setOtpTimer] = useState(0);

  const isPhone = loginMethod === 'phone';
  const hasIdentifier = identifier.trim().length > 0;

  const openLoginSheet = (method: 'email' | 'phone') => {
    setLoginMethod(method);
    setModalOpen(false);
    setTimeout(() => {
      setSheetOpen(true);
    }, 220);
  };

  const handleContinue = () => {
    console.log('Continue login', { loginMethod, identifier });
    setSheetOpen(false);
  };

  const handleAppleLogin = () => {
    console.log('Continue with Apple');
  };

  const handleForgot = () => {
    console.log('Forgot credentials tapped');
  };

  useEffect(() => {
    if (otpTimer <= 0) return;
    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpTimer]);

  const handleSendCode = () => {
    if (!identifier.trim()) {
      console.log('Please enter contact info before requesting a code');
      return;
    }
    console.log('Send verification code', { loginMethod, identifier });
    setOtpTimer(60);
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 justify-between">
          <View className="px-6 pt-12">
            <VStack space="sm">
              <Text
                size="2xl"
                className="font-bold text-typography-900 dark:text-typography-0"
              >
                English learning, reimagined
              </Text>
              <Text className="text-typography-500 dark:text-typography-300">
                Immerse in AI-powered coaching designed for modern learners.
              </Text>
            </VStack>

            <View className="mt-8">
              <Carousel
                width={CAROUSEL_WIDTH}
                height={CAROUSEL_HEIGHT}
                data={HERO_SLIDES}
                loop={false}
                autoPlay={false}
                renderItem={({ item }) => (
                  <View className="relative h-full w-full overflow-hidden rounded-3xl">
                    <Image
                      source={{ uri: item.image }}
                      size="full"
                      resizeMode="cover"
                      className="absolute inset-0 h-full w-full"
                    />
                    <View className="absolute inset-0 bg-black/35" />
                    <View className="flex-1 justify-end p-6">
                      <Text size="lg" className="font-semibold text-white">
                        {item.title}
                      </Text>
                      <Text className="mt-2 text-sm text-white/80">
                        {item.description}
                      </Text>
                    </View>
                  </View>
                )}
                onSnapToItem={index => setActiveSlide(index)}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 0.9,
                  parallaxScrollingOffset: 40,
                }}
                style={{ width: CAROUSEL_WIDTH }}
              />
            </View>

            <View className="mt-4 flex-row items-center gap-2">
              {HERO_SLIDES.map((slide, index) => (
                <View
                  key={slide.id}
                  className={`h-1.5 flex-1 rounded-full ${
                    index === activeSlide
                      ? 'bg-primary-500'
                      : 'bg-outline-200'
                  }`}
                />
              ))}
            </View>
          </View>

          <View className="px-6 pb-10">
            <Button
              size="lg"
              action="primary"
              className="w-full"
              onPress={() => openLoginSheet('email')}
            >
              <ButtonText className="w-full text-center">
                登录 / 开始学习
              </ButtonText>
            </Button>
            <Text className="mt-4 text-center text-typography-500 dark:text-typography-300">
              Already have an account? Choose how you’d like to continue.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      

      <Actionsheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      >
        <ActionsheetBackdrop onPress={() => setSheetOpen(false)} />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <ActionsheetScrollView>
            <VStack space="lg" className="pt-6 pb-4">
              <VStack space="xs" className="px-1">
                <Text
                  size="lg"
                  className="font-semibold text-typography-900 dark:text-typography-0"
                >
                  Sign in to continue
                </Text>
                <Text className="text-typography-500 dark:text-typography-300">
                  Access personalised lessons, streaks, and saved progress.
                </Text>
              </VStack>

              <VStack space="md">
                <HStack space="sm">
                  <Button
                    size="sm"
                    action="primary"
                    variant={isPhone ? 'outline' : 'solid'}
                    className="flex-1"
                    onPress={() => setLoginMethod('email')}
                  >
                    <ButtonText className="w-full text-center">
                      Email
                    </ButtonText>
                  </Button>
                  <Button
                    size="sm"
                    action="primary"
                    variant={isPhone ? 'solid' : 'outline'}
                    className="flex-1"
                    onPress={() => setLoginMethod('phone')}
                  >
                    <ButtonText className="w-full text-center">
                      Phone
                    </ButtonText>
                  </Button>
                </HStack>

                <VStack space="sm">
                  <Input variant="outline" size="lg">
                    <InputField
                      value={identifier}
                      onChangeText={setIdentifier}
                      placeholder={
                        isPhone ? 'Phone number' : 'Email address'
                      }
                      keyboardType={isPhone ? 'phone-pad' : 'email-address'}
                      autoComplete={isPhone ? 'tel' : 'email'}
                      textContentType={
                        isPhone ? 'telephoneNumber' : 'emailAddress'
                      }
                      autoCapitalize="none"
                    />
                  </Input>

                  <HStack space="sm" className="items-center">
                    <Input variant="outline" size="lg" className="flex-1">
                      <InputField
                        value={secret}
                        onChangeText={setSecret}
                        placeholder="Verification code"
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                      />
                    </Input>
                    <Button
                      size="sm"
                      variant="outline"
                      action="primary"
                      isDisabled={otpTimer > 0 || !hasIdentifier}
                      onPress={handleSendCode}
                    >
                      <ButtonText>
                        {otpTimer > 0 ? `${otpTimer}s` : 'Send code'}
                      </ButtonText>
                    </Button>
                  </HStack>
                </VStack>

                <Text
                  size="sm"
                  className="self-end text-primary-500 dark:text-primary-400"
                  onPress={handleForgot}
                >
                  Forgot password?
                </Text>

                <Button
                  size="md"
                  action="primary"
                  className="w-full"
                  onPress={handleContinue}
                >
                  <ButtonText className="w-full text-center">
                    Continue
                  </ButtonText>
                </Button>
              </VStack>

              <VStack space="md">
                <Text className="text-center text-typography-500 dark:text-typography-300">
                  or continue with
                </Text>
                <Button
                  size="md"
                  variant="outline"
                  action="primary"
                  className="w-full"
                  onPress={handleAppleLogin}
                >
                  <ButtonText className="flex-1 text-center">
                    Continue with Apple
                  </ButtonText>
                </Button>
              </VStack>

              <VStack space="xs">
                <Text className="text-center text-typography-500 dark:text-typography-300">
                  By continuing you agree to our Terms of Service and Privacy
                  Policy.
                </Text>
                <Text className="text-center text-typography-500 dark:text-typography-300">
                  New here?{' '}
                  <Text
                    className="text-primary-500 dark:text-primary-400"
                    onPress={() => console.log('Navigate to sign up')}
                  >
                    Create an account
                  </Text>
                </Text>
              </VStack>
            </VStack>
          </ActionsheetScrollView>
        </ActionsheetContent>
      </Actionsheet>
    </SafeAreaView>
  );
}
