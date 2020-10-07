import axios from 'axios';

const channel = axios.create({
  baseURL: 'https://boschete.sytes.net:60802',
  timeout: 10000,
});

channel.interceptors.response.use(
  (response) => {
    return response;
  }, 
  (error) => {
    return {
      success: false,
    };
  }
);

export default channel;
