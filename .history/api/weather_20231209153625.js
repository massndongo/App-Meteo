import axios from "axios";
import { rapidApiKey } from "../constants";

const searchEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}';
const forcastEndpoint = 'https://https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}';

const apiCall = async (endpoint, params)=>{
    const options = {
        method: 'GET',
        url: endpoint,
        params: params,
        headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
      };

      try{
        const response = await axios.request(options);
        return response.data;
      }catch(error){
        console.log('error: ',error);
        return {};
    }
}

export const fetchWeatherForecast = params=>{
    return apiCall(forcastEndpoint, params);
}

export const fetchLocations = params=>{
    return apiCall(searchEndpoint, params);
}
