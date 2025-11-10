import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Button, ButtonText } from '@/components/ui/index';
import ProfileCard from '@/components/tabs/index/ProfileCard';
const SCREEN_WIDTH = Dimensions.get('window').width;
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';


/* const DUMMY_DATA = [
   {
    id: '3',
    imageUrl: 'https://qiniu.waoo.cc/saas/1762779038454_watermark.png',
    name: 'Emily Johnson',
    bio: "Hi, I’m Emily Johnson, a 24-year-old graphic designer living in San Francisco.",
  },
  {
    id: '1',
    imageUrl: 'https://qiniu.waoo.cc/saas/1762778971816_watermark.png',
    name: 'Jake Thompson',
    bio: 'Hi, I’m Jake Thompson, a 26-year-old software engineer from Austin, Texas. ',
  },
  {
    id: '4',
    imageUrl: 'https://qiniu.waoo.cc/saas/1762779005725_watermark.png',
    name: 'Sophia Lee',
    bio: "Hello! My name is Sophia Lee, and I’m a 22-year-old student studying Environmental Science at the University of Washington. I’m passionate about sustainability and conservation",
  },
   {
    id: '2',
    imageUrl: 'https://qiniu.waoo.cc/saas/1762778992434_watermark.png',
    bio: "Hello! My name is Sophia Lee, and I’m a 22-year-old student studying Environmental Science at the University of Washington. I’m passionate about sustainability and conservation",
    name: 'Sophia Lee'
  },
]; */

export default function HomeScreen() {
  const router = useRouter();
  const [personList,setPersonList] = useState([])

  useEffect(() => {
    initPersons()
  },[])

  async function initPersons  () {
    let { data: persons,error,status } = await supabase.from('reply_person').select()
    if(status == 200) {
      setPersonList(persons)
    }
  }

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
