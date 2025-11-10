import { useCallback } from 'react';
import { Button, ButtonText } from '@/components/ui/index';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

type ProfileCardProps = {
  avatar: string;
  name: string;
  description: string;
};

export default function ProfileCard({ avatar, name, description }: ProfileCardProps) {
  const router = useRouter();
  const handleChatPress = useCallback(() => {
    router.push('/chat');
  }, [router]);

  return (
    <View style={styles.card}>
      <Image source={{ uri: avatar }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.bio}>{description}</Text>
      </View>
      <Button action="primary" style={{ margin: 15 }} size='md' onPress={handleChatPress}>
        <ButtonText onPress={handleChatPress}>开始聊天</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  info: {
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#666',
  },
});
