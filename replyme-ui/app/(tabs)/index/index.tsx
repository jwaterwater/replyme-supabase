import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
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
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // 开始时的处理逻辑
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.velocityX) > 500) {
        translateX.value = withSpring(0);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, rStyle]}>
          <ProfileCard {...DUMMY_DATA[0]} />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
  },
});
