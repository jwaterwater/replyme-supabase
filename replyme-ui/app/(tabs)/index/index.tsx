import { Button } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import ProfileCard from '../../../components/ProfileCard';
const SCREEN_WIDTH = Dimensions.get('window').width;

const DUMMY_DATA = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/300/300',
    name: '张三',
    bio: '热爱生活，喜欢探索新事物',
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/300/300',
    name: '里斯',
    bio: '热爱生活，喜欢探索新事物',
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/300/300',
    name: '王五',
    bio: '热爱生活，喜欢探索新事物',
  },
  // ... 更多数据
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
        <Button action='primary' >123</Button>
        <Center>
      <Text className="font-semibold">Easy</Text>
      <Divider className="my-0.5" />
      <Text className="font-semibold">Difficult</Text>
    </Center>
      <Carousel
        loop={false}
        width={SCREEN_WIDTH}
        height={SCREEN_WIDTH * 1.5}
        data={DUMMY_DATA}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <ProfileCard {...item} />
          </View>
        )}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        style={styles.carousel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carousel: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
