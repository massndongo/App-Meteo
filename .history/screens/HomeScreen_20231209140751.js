import { StatusBar } from "expo-status-bar"
import { SafeAreaView, View, Image } from "react-native"

export default function HomeScreen(){
    return (
        <View class="flex-1 relative">
            <StatusBar style="light" />
            <Image blurRadius={70} source={require('../assets/images/bg.png')} 
                    className="absolute h-full w-full" 
            />
            <SafeAreaView>
                
            </SafeAreaView>
        </View>
    )
    
}