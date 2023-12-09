import { StatusBar } from "expo-status-bar"
import { SafeAreaView, View, Image, TextInput, TouchableOpacity, Text } from "react-native"
import { theme } from '../theme';
import {} from 'he'

export default function HomeScreen(){
    return (
        <View class="flex-1 relative">
            <StatusBar style="light" />
            <Image blurRadius={70} source={require('../assets/images/bg.png')} 
                    className="absolute h-[100vh] w-full" 
            />
            <SafeAreaView className="flex flex-1">
                <View style={{height: '7%'}} className="mx-4 relative z-50">
                    <View className="flex-row justify-end items-center rounded-full" 
                            style={{backgroundColor: theme.bgWhite(0.2)}}
                    >
                        <TextInput 
                            placeholder='Chercher une ville' 
                            placeholderTextColor={'lightgray'}
                            className="pl-6 h-10 flex-1 text-base text-white"
                        />
                        <TouchableOpacity 
                            style={{backgroundColor: theme.bgWhite(0.3)}}
                            className="rounded-full p-3 m-1"
                        >
                            <Text>Icon</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </SafeAreaView>
        </View>
    )
    
}