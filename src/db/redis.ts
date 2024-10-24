import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({ url: `redis://${process.env.REDIS_HOST}:6379` });

redisClient.connect();

export default redisClient;
