import channelWeather from './channelWeatherAPI';

export default async () => {
  const result = await channelWeather.get('', {
    params: {
      lat: '46.785744',
      lon: '23.652539',
      exclude: 'minutely,hourly,daily,alerts',
      appid: '1c3c776488ac09378e23f64fbcb7b325',
      units: 'metric',
    },
  });

  const {
    data: {
      current: {
        temp,
      },
    }
  } = result;

  return `${Math.round(temp)}`;

};
