import axios from 'axios';
import redisClient from '../db/redis';
import { Item } from '../interfaces/item.interface';

const SKINPORT_API_URL = process.env.SKINPORT_API_URL || '';
const SKINPORT_CLIENT_ID = process.env.SKINPORT_CLIENT_ID || '';
const SKINPORT_CLIENT_SECRET = process.env.SKINPORT_CLIENT_SECRET || '';

if (!SKINPORT_API_URL || !SKINPORT_CLIENT_ID || !SKINPORT_CLIENT_SECRET) {
    throw new Error('Skinport API credentials are not defined in environment variables');
}

const encodedAuth = Buffer.from(`${SKINPORT_CLIENT_ID}:${SKINPORT_CLIENT_SECRET}`).toString('base64');
const AUTH_HEADER = `Basic ${encodedAuth}`;

export const fetchItemsFromSkinport = async (): Promise<Item[]> => {
    const cachedItems = await redisClient.get('items');

    if (cachedItems) {
        return JSON.parse(cachedItems) as Item[];
    }

    const response = await axios.get<Item[]>(
        SKINPORT_API_URL, 
        {
            headers: {
                'Authorization': AUTH_HEADER
            },
            params: {
                app_id: 730,
                currency: 'EUR'
            }
        }
    );

    if (!Array.isArray(response.data)) {
        throw new Error('Invalid data format from Skinport API');
    }

    const items: Item[] = response.data.map((item: Item) => ({
        market_hash_name: item.market_hash_name,
        min_price: item.min_price || null,
        max_price: item.max_price || null,
        quantity: item.quantity ?? 0
    }));

    await redisClient.set('items', JSON.stringify(items), { EX: 300 });

    return items;
};
