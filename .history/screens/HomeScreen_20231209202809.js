import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import { debounce } from "lodash";
import { theme } from '../theme';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import * as Progress from 'react-native-progress';
import { StatusBar } from 'expo-status-bar';
import { weatherImages } from '../constants';
import { getData, storeData } from '../utils/asyncStorage';
import { format } from 'date-fns';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({})


  const handleSearch = search=>{
    if(search)
      fetchLocations({
        lat: 14.6928,
        lon: -17.4467
      }).then(data=>{
        
      if (data) {
        setLoading(false);
        setWeather({
          location: {
            name: data.name,
            country: data.sys.country,
            
          },
          current: {
            wind: {
              deg: data.wind.deg,
              wind_kph: data.wind.speed
            },
            humidity: data.main.humidity,
            condition: data.weather[0].main,
            sunrise: data.sys.sunrise
          }
        });
        storeData('coord', `14.6928,-17.4467`);
      } else {
        console.error("Invalid data structure from API:", data);
      }
        setLocations(data);
      })
  }

  const handleLocation = (latitude, longitude) => {
    setLoading(true);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      lat: 14.6928,
      lon: -17.4467
    }).then(data => {
      if (data) {
        console.log(data);
        setLoading(false);
        setWeather({
          location: {
            name: data.city.name,
            country: data.city.country
          },
          current: {
            wind: {
              deg: data.list[0].wind.deg,
              wind_kph: data.list[0].wind.speed
            },
            humidity: data.list[0].main.humidity,
            condition: data.list[0].weather[0].main,
            sunrise: data.city.sunrise
          }
        });
        storeData('coord', `14.6928,-17.4467`);
      } else {
        console.error("Invalid data structure from API:", data);
      }
        
    });
  };

  useEffect(()=>{
    fetchMyWeatherData();
  },[]);

  const fetchMyWeatherData = async ()=>{
    let coord = await getData('coord');
    console.log(coord);
    let cityName = 'Islamabad';
    // if(coord){
    //   cityName = myCity;
    // }
    fetchWeatherForecast({
      lat: 14.6928,
      lon: -17.4467
    }).then(data=>{
      console.log(data);
      console.log('got data: ',data.city.name); 
      if (data) {
        console.log(data);
        setLoading(false);
        setWeather({
          location: {
            name: data.city.name,
            country: data.city.country
          },
          current: {
            wind: {
              deg: data.list[0].wind.deg,
              wind_kph: data.list[0].wind.speed
            },
            humidity: data.list[0].main.humidity,
            condition: data.list[0].weather[0].main,
            sunrise: data.city.sunrise

          }
        });
        storeData('coord', `14.6928,-17.4467`);
      } else {
        console.error("Invalid data structure from API:", data);
      }
    })
    
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const {location, current} = weather;
  
    console.log("Location:", location);
    console.log("Current:", current);

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image blurRadius={70} source={require('../assets/images/bg.png')} className="absolute w-full h-full" />
        {
          loading? (
            <View className="flex-1 flex-row justify-center items-center">
              <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
            </View>
          ):(
            <SafeAreaView className="flex flex-1">
              {/* search section */}
              <View style={{height: '7%'}} className="mx-4 relative z-50">
                <View className="flex-row justify-end items-center rounded-full" style={{backgroundColor: showSearch? theme.bgWhite(0.2): 'transparent'}}>
                  
                    {
                      showSearch? (
                        <TextInput onChangeText={handleTextDebounce} placeholder="Search city" placeholderTextColor={'lightgray'} className="pl-6 h-10 pb-1 flex-1 text-base text-white" />
                      ):null
                    }
                    <TouchableOpacity 
                      onPress={()=> toggleSearch(!showSearch)} 
                      className="rounded-full p-3 m-1" 
                      style={{backgroundColor: theme.bgWhite(0.3)}}>
                      {
                        showSearch? (
                          <XMarkIcon size="25" color="white" />
                        ):(
                          <MagnifyingGlassIcon size="25" color="white" />
                        )
                      }
                      
                  </TouchableOpacity>
                </View>
                {
                  locations.length>0 && showSearch?(
                    <View className="absolute w-full bg-gray-300 top-16 rounded-3xl ">
                      {
                        locations.map((loc, index)=>{
                          let showBorder = index+1 != locations.length;
                          let borderClass = showBorder? ' border-b-2 border-b-gray-400':'';
                          return (
                            <TouchableOpacity 
                              key={index}
                              onPress={()=> handleLocation(loc)} 
                              className={"flex-row items-center border-0 p-3 px-4 mb-1 "+borderClass}>
                                <MapPinIcon size="20" color="gray" />
                                <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                            </TouchableOpacity>
                          )
                        })
                      }
                    </View>
                  ):null
                }
                
              </View>

              {/* forecast section */}
              <View className="mx-4 flex justify-around flex-1 mb-2">
                {/* location */}
                <Text className="text-white text-center text-2xl font-bold">
                  {location?.name}, <Text className="text-lg font-semibold text-gray-300">{location?.country}</Text>
                </Text>
                {/* weather icon */}
                <View className="flex-row justify-center">
                  <Image 
                    // source={{uri: 'https:'+current?.condition?.icon}} 
                    source={weatherImages[current?.condition || 'other']} 
                    className="w-52 h-52" />
                  
                </View>
                {/* degree celcius */}
                <View className="space-y-2">
                    <Text className="text-center font-bold text-white text-6xl ml-5">{current?.wind?.deg}&#176;</Text>
                    <Text className="text-center text-white text-xl tracking-widest">{current?.condition} </Text>
                </View>

                {/* other stats */}
                <View className="flex-row justify-between mx-4">
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../assets/icons/wind.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">{current?.wind.wind_kph}km</Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../assets/icons/drop.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../assets/icons/sun.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">
                      { format(new Date(current?.sunrise), 'HH:mm') }
                    </Text>
                  </View>
                  
                </View>
              </View>

              {/* forecast for next days */}
              <View className="mb-2 mx-6 flex-row justify-between items-center">
                {
                  weather?.forecast?.forecastday?.map((item,index)=>{
                    const date = new Date(item.date);
                    const options = { weekday: 'long' };
                    let dayName = date.toLocaleDateString('en-US', options);
                    dayName = dayName.split(',')[0];

                    return (
                      <View key={index} className="flex justify-center items-center rounded-3xl py-3 space-y-1" 
                        style={{backgroundColor: theme.bgWhite(0.15), width: '29%'}}>
                        <Image 
                          // source={{uri: 'https:'+item?.day?.condition?.icon}}
                          source={weatherImages[item?.day?.condition?.text || 'other']}
                            className="w-11 h-11" />
                        <Text className="text-white">{dayName}</Text>
                        <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&#176;</Text>
                      </View>
                    )
                  })
                }
                
              </View>
            
            </SafeAreaView>
          )
        }
      
    </View>
  )
}
