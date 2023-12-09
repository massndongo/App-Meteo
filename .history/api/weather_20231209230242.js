import axios from "axios";
import { apiKey } from "../constants";

const forecastEndpoint = params=> `https://api.openweathermap.org/data/2.5/forecast?q=${params.cityName}&lang=fr&&appid=${apiKey}`;
const locationsEndpoint = params=> `https://api.openweathermap.org/data/2.5/weather?q=${params.cityName}&appid=${apiKey}`;
const apiCall = async (endpoint)=>{
    const options = {
        method: 'GET',
        url: endpoint,
    };

      try{
        const response = await axios.request(options);
        return response.data;
      }catch(error){
        console.log(endpoint);
        console.log('error: ',error);
        return {};
    }
}

export const fetchWeatherForecast = params=>{
    let forecastUrl = forecastEndpoint(params);
    return apiCall(forecastUrl);
}

export const fetchLocations = params=>{
    let locationsUrl = locationsEndpoint(params);
    return apiCall(locationsUrl);
}