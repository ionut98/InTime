import channel from './channel';

export default async (newTime) => {
  const result = await channel.post('/time', {
    record: newTime
  });

  return result.data;
};
