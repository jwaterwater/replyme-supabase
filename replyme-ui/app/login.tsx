
import { Button, ButtonText } from '@/components/ui/button';
import { View } from 'react-native';
export default function LoginScreen () {

    return (
        <View>
            <Button variant="solid" size="md" action="primary">
                <ButtonText>Click me</ButtonText>
            </Button>
        </View>
    );
}