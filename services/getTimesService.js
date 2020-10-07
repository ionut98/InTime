import channel from './channel';

export default async () => {
  return await channel.get('/times');
};
