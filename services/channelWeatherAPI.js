import axios from 'axios';

const channelWeather = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/onecall',
  timeout: 10000,
});

channelWeather.interceptors.response.use(
  (response) => {
    return response;
  }, 
  (error) => {
    return {
      success: false,
    };
  }
);

export default channelWeather;
