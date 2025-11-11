import ProfileCard from '@/components/tabs/index/ProfileCard';
import { Button, ButtonText } from '@/components/ui/index';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
  const router = useRouter();

  const [personList, setPersonList] = useState([]);
  const check = useAuthStore((state) => state.check)

  useEffect(() => {
    initPage()
  },[])

  const initPage = useCallback(async () => {
    check(router)
    const { data: persons, error, status } = await supabase
      .from('reply_person')
      .select();

    if (!error) {
      setPersonList(persons);
    }
  }, []);


  return (
    <View style={styles.container}>
      
      <Carousel
        loop={false}
        width={SCREEN_WIDTH}
        height={SCREEN_WIDTH * 1.5}
        data={personList}
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


      <Button
        action="primary"
        style={{ margin: 'auto',marginTop: 0, marginBottom: 0}}
        size="xs"
        onPress={() => router.push('/login')}
      >
        <ButtonText>去登录页</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
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
