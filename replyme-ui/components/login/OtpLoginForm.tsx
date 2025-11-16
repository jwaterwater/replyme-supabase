import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { supabase } from '@/lib/supabase';
import { useEffect, useMemo, useState } from 'react';

type LoginFormProps = {
  onSuccess?: (login:boolean) => void;
  onForgot?: () => void;
};

type LoginMode = 'email' | 'phone';

type ModeConfig = {
  placeholder: string;
  keyboardType: 'email-address' | 'phone-pad';
  autoComplete: 'email' | 'tel';
  textContentType: 'emailAddress' | 'telephoneNumber';
  sendCode: (identifier: string) => Promise<void>;
  verifyCode: (
    identifier: string,
    token: string
  ) => Promise<{ session: boolean }>;
};

const buildModeConfig = (mode: LoginMode): ModeConfig => {
  if (mode === 'phone') {
    return {
      placeholder: 'Phone number',
      keyboardType: 'phone-pad',
      autoComplete: 'tel',
      textContentType: 'telephoneNumber',
      sendCode: async identifier => {
        const { error } = await supabase.auth.signInWithOtp({
          phone: identifier,
          options: { shouldCreateUser: true },
        });

        if (error) {
          throw error;
        }
      },
      verifyCode: async (identifier, token) => {
        const { data, error } = await supabase.auth.verifyOtp({
          type: 'sms',
          phone: identifier,
          token,
        });

        if (error) {
          throw error;
        }

        return { session: Boolean(data.session) };
      },
    };
  }

  return {
    placeholder: 'Email address',
    keyboardType: 'email-address',
    autoComplete: 'email',
    textContentType: 'emailAddress',
    sendCode: async identifier => {
      const { error } = await supabase.auth.signInWithOtp({
        email: identifier,
        options: { shouldCreateUser: true },
      });

      if (error) {
        throw error;
      }
    },
    verifyCode: async (identifier, token) => {
      const { data, error } = await supabase.auth.verifyOtp({
        type: 'email',
        email: identifier,
        token,
      });

      if (error) {
        throw error;
      }

      return { session: Boolean(data.session) };
    },
  };
};

const OTP_RESEND_SECONDS = 60;

type OtpLoginFormProps = LoginFormProps & {
  mode: LoginMode;
};

const OtpLoginForm = ({ mode, onSuccess, onForgot }: OtpLoginFormProps) => {
  const config = useMemo(() => buildModeConfig(mode), [mode]);
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasIdentifier = identifier.trim().length > 0;

  useEffect(() => {
    if (otpTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [otpTimer]);

  const handleSendCode = async () => {
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      setErrorMessage(
        mode === 'phone'
          ? 'Please add your phone number first.'
          : 'Please add your email address first.'
      );
      return;
    }

    setStatusMessage(null);
    setErrorMessage(null);
    setIsSendingCode(true);

    try {
      await config.sendCode(trimmedIdentifier);
      setStatusMessage('Verification code sent. Check your inbox or SMS.');
      setOtpTimer(OTP_RESEND_SECONDS);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'We could not send the code. Please try again in a moment.'
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleContinue = async () => {
    const trimmedIdentifier = identifier.trim();
    const trimmedToken = secret.trim();

    if (!trimmedIdentifier || !trimmedToken) {
      setErrorMessage('Please enter both your contact info and the code.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const result = await config.verifyCode(trimmedIdentifier, trimmedToken);
      setStatusMessage('Code verified. Signing you in...');

      if (result.session) {
        onSuccess?.(true);
      }

      setSecret('');
      setOtpTimer(0);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'We could not verify the code. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack space="sm">
      <VStack space="sm">
        <Input variant="outline" size="lg">
          <InputField
            value={identifier}
            onChangeText={setIdentifier}
            placeholder={config.placeholder}
            keyboardType={config.keyboardType}
            autoComplete={config.autoComplete}
            textContentType={config.textContentType}
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
            isDisabled={otpTimer > 0 || !hasIdentifier || isSendingCode}
            onPress={handleSendCode}
          >
            <ButtonText>
              {isSendingCode
                ? 'Sending...'
                : otpTimer > 0
                  ? `${otpTimer}s`
                  : 'Send code'}
            </ButtonText>
          </Button>
        </HStack>
      </VStack>

  
      <Button
        size="md"
        action="primary"
        className="w-full"
        onPress={handleContinue}
        isDisabled={isSubmitting}
      >
        <ButtonText className="w-full text-center">
          {isSubmitting ? 'Signing in...' : 'Continue'}
        </ButtonText>
      </Button>

      {errorMessage ? (
        <Text size="sm" className="text-error-500">
          {errorMessage}
        </Text>
      ) : null}
      {statusMessage ? (
        <Text size="sm" className="text-success-500">
          {statusMessage}
        </Text>
      ) : null}
    </VStack>
  );
};

export const EmailLoginForm = (props: LoginFormProps) => (
  <OtpLoginForm mode="email" {...props} />
);

export const PhoneLoginForm = (props: LoginFormProps) => (
  <OtpLoginForm mode="phone" {...props} />
);

